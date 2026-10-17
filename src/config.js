import dotenv from 'dotenv';

dotenv.config({ override: true });

const botToken = process.env.BOT_TOKEN?.trim();
const botUsername = process.env.BOT_USERNAME?.trim().replace(/^@/, '') || '';

/** Один или несколько chat_id через запятую. Пример: 123456789 или 111,222 */
const managerChatIds = (process.env.MANAGER_CHAT_IDS || process.env.MANAGER_CHAT_ID || '')
  .split(/[,;\s]+/)
  .map((id) => id.trim())
  .filter(Boolean);

if (!botToken) {
  console.error('[config] Задайте BOT_TOKEN в файле .env (см. .env.example)');
  process.exit(1);
}

export const config = {
  botToken,
  botUsername,
  managerChatIds,
};
