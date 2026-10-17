import dotenv from 'dotenv';

dotenv.config({ override: true });

const botToken = process.env.BOT_TOKEN?.trim();
const botUsername = process.env.BOT_USERNAME?.trim().replace(/^@/, '') || '';

if (!botToken) {
  console.error('[config] Задайте BOT_TOKEN в файле .env (см. .env.example)');
  process.exit(1);
}

export const config = {
  botToken,
  botUsername,
};
