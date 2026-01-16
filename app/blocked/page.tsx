'use client';

import { useEffect } from 'react';
import { Ban } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function BlockedPage() {
  useEffect(() => {
    // Clear the session ID when user is blocked
    localStorage.removeItem('user_session_id');
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 to-red-800 flex items-center justify-center p-4">
      <div className="text-center">
        <Ban className="w-24 h-24 text-red-200 mx-auto mb-6" />
        <h1 className="text-4xl font-bold text-white mb-2">Access Blocked</h1>
        <p className="text-red-100 text-lg mb-8">
          Your access has been blocked by the administrator.
        </p>
        <p className="text-red-200 text-sm mb-8">
          If you believe this is an error, please contact support.
        </p>
        <Button
          onClick={() => {
            window.location.href = '/';
          }}
          className="bg-white text-red-900 hover:bg-red-50"
        >
          Go Back
        </Button>
      </div>
    </div>
  );
}
