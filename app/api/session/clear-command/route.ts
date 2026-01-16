import { NextRequest, NextResponse } from 'next/server';
import { clearUserState } from '@/lib/session-store';

// API to clear control command after client execution
export async function POST(req: NextRequest) {
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
    console.error('Clear command error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
