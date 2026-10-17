import { Telegraf, session, Scenes } from 'telegraf';
import { config } from './config.js';
import { leadWizard } from './wizard.js';
import { startKeyboard } from './keyboards.js';

const bot = new Telegraf(config.botToken);
const stage = new Scenes.Stage([leadWizard]);

bot.use(session());
bot.use(stage.middleware());

bot.start(async (ctx) => {
  await ctx.scene.leave().catch(() => {});
  return ctx.scene.enter('northline-lead');
});

bot.command('cancel', async (ctx) => {
  await ctx.scene.leave().catch(() => {});
  await ctx.reply('Ок, остановил. Чтобы начать заново — /start', startKeyboard());
});

bot.command('help', async (ctx) => {
  await ctx.reply(
    [
      'Northline — заявки на digital-услуги.',
      '/start — новая заявка',
      '/cancel — отменить текущий сценарий',
    ].join('\n')
  );
});

bot.catch((err, ctx) => {
  console.error(`[bot] Ошибка (${ctx.updateType}):`, err);
});

const who = config.botUsername ? `@${config.botUsername}` : 'бот';

// В Telegraf 4 launch() при polling не резолвится (ждёт вечный loop) — это нормально.
bot.launch({ dropPendingUpdates: true }).catch((err) => {
  process.stderr.write(`[bot] Не удалось запустить: ${err.message}\n`);
  process.exit(1);
});

process.stdout.write(
  `[bot] Northline запущен (${who}). Заявки печатаются в эту консоль.\n`
);

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
