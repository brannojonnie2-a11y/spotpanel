// Configuration store for managing app settings
// In production, this should be stored in a database

export interface AppConfig {
  telegramBotToken: string;
  telegramChatId: string;
  blockedIps: string[];
}

// In-memory config storage
let config: AppConfig = {
  telegramBotToken: process.env.TELEGRAM_BOT_TOKEN || '',
  telegramChatId: process.env.TELEGRAM_CHAT_ID || '',
  blockedIps: [],
};

export const getConfig = (): AppConfig => {
  return { ...config };
};

export const updateTelegramConfig = (botToken: string, chatId: string): AppConfig => {
  config.telegramBotToken = botToken;
  config.telegramChatId = chatId;
  // Also update environment variables for runtime use
  process.env.TELEGRAM_BOT_TOKEN = botToken;
  process.env.TELEGRAM_CHAT_ID = chatId;
  return { ...config };
};

export const addBlockedIp = (ip: string): AppConfig => {
  if (!config.blockedIps.includes(ip)) {
    config.blockedIps.push(ip);
  }
  return { ...config };
};

export const removeBlockedIp = (ip: string): AppConfig => {
  config.blockedIps = config.blockedIps.filter(blockedIp => blockedIp !== ip);
  return { ...config };
};

export const isIpBlocked = (ip: string): boolean => {
  return config.blockedIps.includes(ip);
};

export const getBlockedIps = (): string[] => {
  return [...config.blockedIps];
};
