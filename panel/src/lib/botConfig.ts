import fs from 'fs';
import path from 'path';

export interface ActivityLog {
  id: string;
  timestamp: string;
  telefono: string;
  mensaje: string;
  respuesta: string;
  accion: string;
}

export interface BotConfig {
  geminiApiKey: string;
  openWaUrl: string;
  openWaApiKey: string;
  botActive: boolean;
  sessionName: string;
  activityLogs: ActivityLog[];
}

const CONFIG_PATH = path.join(process.cwd(), 'src/bot-config.json');

const DEFAULT_CONFIG: BotConfig = {
  geminiApiKey: '',
  openWaUrl: 'http://localhost:2785',
  openWaApiKey: '',
  botActive: true,
  sessionName: 'inmobot',
  activityLogs: []
};

export function getBotConfig(): BotConfig {
  try {
    if (!fs.existsSync(CONFIG_PATH)) {
      saveBotConfig(DEFAULT_CONFIG);
      return DEFAULT_CONFIG;
    }
    const raw = fs.readFileSync(CONFIG_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading bot config:', e);
    return DEFAULT_CONFIG;
  }
}

export function saveBotConfig(config: BotConfig): boolean {
  try {
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), 'utf-8');
    return true;
  } catch (e) {
    console.error('Error saving bot config:', e);
    return false;
  }
}

export function addActivityLog(telefono: string, mensaje: string, respuesta: string, accion: string) {
  try {
    const config = getBotConfig();
    const newLog: ActivityLog = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toISOString(),
      telefono,
      mensaje,
      respuesta,
      accion
    };
    config.activityLogs = [newLog, ...config.activityLogs].slice(0, 50);
    saveBotConfig(config);
  } catch (e) {
    console.error('Error logging activity:', e);
  }
}
