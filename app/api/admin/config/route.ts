import { NextRequest, NextResponse } from 'next/server';
import { getConfig, updateTelegramConfig, addBlockedIp, removeBlockedIp, getBlockedIps } from '@/lib/config-store';

export async function GET(req: NextRequest) {
  try {
    const config = getConfig();
    
    // Don't expose the full token, just confirm it's set
    return NextResponse.json({
      telegramBotTokenSet: !!config.telegramBotToken,
      telegramChatIdSet: !!config.telegramChatId,
      blockedIps: config.blockedIps,
    });
  } catch (error) {
    console.error('Config fetch error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { telegramBotToken, telegramChatId } = await req.json();

    if (!telegramBotToken || !telegramChatId) {
      return NextResponse.json(
        { error: 'Missing telegramBotToken or telegramChatId' },
        { status: 400 }
      );
    }

    const config = updateTelegramConfig(telegramBotToken, telegramChatId);

    return NextResponse.json({
      success: true,
      message: 'Telegram configuration updated successfully',
      config: {
        telegramBotTokenSet: !!config.telegramBotToken,
        telegramChatIdSet: !!config.telegramChatId,
      },
    });
  } catch (error) {
    console.error('Config update error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// Handle blocked IPs
export async function POST(req: NextRequest) {
  try {
    const { action, ip } = await req.json();

    if (!action || !ip) {
      return NextResponse.json(
        { error: 'Missing action or ip' },
        { status: 400 }
      );
    }

    if (action === 'block') {
      addBlockedIp(ip);
      return NextResponse.json({
        success: true,
        message: `IP ${ip} has been blocked`,
        blockedIps: getBlockedIps(),
      });
    } else if (action === 'unblock') {
      removeBlockedIp(ip);
      return NextResponse.json({
        success: true,
        message: `IP ${ip} has been unblocked`,
        blockedIps: getBlockedIps(),
      });
    } else {
      return NextResponse.json(
        { error: 'Invalid action. Use "block" or "unblock"' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('IP management error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
