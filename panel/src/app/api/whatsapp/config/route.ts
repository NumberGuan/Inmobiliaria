import { NextResponse } from 'next/server';
import { getBotConfig, saveBotConfig, BotConfig } from '@/lib/botConfig';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const config = getBotConfig();
    return NextResponse.json(config, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const currentConfig = getBotConfig();

    const updatedConfig: BotConfig = {
      geminiApiKey: body.geminiApiKey !== undefined ? body.geminiApiKey.trim() : currentConfig.geminiApiKey,
      openWaUrl: body.openWaUrl !== undefined ? body.openWaUrl.trim() : currentConfig.openWaUrl,
      openWaApiKey: body.openWaApiKey !== undefined ? body.openWaApiKey.trim() : currentConfig.openWaApiKey,
      botActive: body.botActive !== undefined ? Boolean(body.botActive) : currentConfig.botActive,
      sessionName: body.sessionName !== undefined ? body.sessionName.trim() : currentConfig.sessionName,
      activityLogs: currentConfig.activityLogs // Preserve logs
    };

    const ok = saveBotConfig(updatedConfig);
    if (ok) {
      return NextResponse.json({ success: true, config: updatedConfig }, { status: 200 });
    } else {
      return NextResponse.json({ error: 'Failed to write configuration file' }, { status: 500 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
