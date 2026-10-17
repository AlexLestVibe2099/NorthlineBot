import { Scenes } from 'telegraf';
import {
  BUDGET_LABELS,
  DEADLINE_LABELS,
  SERVICE_LABELS,
  budgetKeyboard,
  deadlineKeyboard,
  serviceKeyboard,
  startKeyboard,
} from './keyboards.js';
import { formatClientSummary, logLeadCard } from './lead.js';

const ABOUT_TEXT = [
  'Northline — digital-студия для бизнеса.',
  'Делаем лендинги и сайты, Telegram-ботов и простые интеграции под заявки и процессы.',
  '',
  'Нажмите «Оставить заявку» — ответите на несколько вопросов, менеджер получит готовую карточку.',
].join('\n');

function emptyLead() {
  return {
    service: '',
    task: '',
    deadline: '',
    budget: '',
    contact: '',
    name: '',
  };
}

export const leadWizard = new Scenes.WizardScene(
  'northline-lead',
  async (ctx) => {
    ctx.wizard.state.lead = emptyLead();
    await ctx.reply(
      [
        'Привет! Я помогу оставить заявку в Northline.',
        'Ответьте на несколько вопросов — менеджер получит готовую карточку.',
      ].join('\n'),
      startKeyboard()
    );
    return ctx.wizard.next();
  },
  async (ctx) => {
    if (ctx.callbackQuery?.data === 'lead:about') {
      await ctx.answerCbQuery();
      await ctx.reply(ABOUT_TEXT, startKeyboard());
      return;
    }
    if (ctx.callbackQuery?.data !== 'lead:start') {
      if (ctx.callbackQuery) await ctx.answerCbQuery();
      await ctx.reply('Нажмите «Оставить заявку», чтобы продолжить.', startKeyboard());
      return;
    }
    await ctx.answerCbQuery();
    await ctx.reply('Какая услуга нужна?', serviceKeyboard());
    return ctx.wizard.next();
  },
  async (ctx) => {
    const data = ctx.callbackQuery?.data;
    if (!data?.startsWith('svc:')) {
      if (ctx.callbackQuery) await ctx.answerCbQuery();
      await ctx.reply('Выберите услугу кнопкой ниже.', serviceKeyboard());
      return;
    }
    await ctx.answerCbQuery();
    const key = data.slice(4);
    ctx.wizard.state.lead.service = SERVICE_LABELS[key] || key;
    await ctx.reply('Кратко: что нужно сделать? Напишите одним сообщением.');
    return ctx.wizard.next();
  },
  async (ctx) => {
    const text = ctx.message?.text?.trim();
    if (!text || text.startsWith('/')) {
      await ctx.reply('Опишите задачу текстом — пару предложений достаточно.');
      return;
    }
    ctx.wizard.state.lead.task = text;
    await ctx.reply('Когда хотите запуститься?', deadlineKeyboard());
    return ctx.wizard.next();
  },
  async (ctx) => {
    if (ctx.wizard.state.awaitingCustomDeadline) {
      const text = ctx.message?.text?.trim();
      if (!text || text.startsWith('/')) {
        await ctx.reply('Напишите срок текстом, например: «к концу апреля».');
        return;
      }
      ctx.wizard.state.lead.deadline = text;
      ctx.wizard.state.awaitingCustomDeadline = false;
      await ctx.reply('Какой бюджет рассматриваете?', budgetKeyboard());
      return ctx.wizard.next();
    }

    const data = ctx.callbackQuery?.data;
    if (!data?.startsWith('dl:')) {
      if (ctx.callbackQuery) await ctx.answerCbQuery();
      await ctx.reply('Выберите срок кнопкой ниже.', deadlineKeyboard());
      return;
    }
    await ctx.answerCbQuery();
    const key = data.slice(3);
    if (key === 'custom') {
      ctx.wizard.state.awaitingCustomDeadline = true;
      await ctx.reply('Напишите свой срок текстом.');
      return;
    }
    ctx.wizard.state.lead.deadline = DEADLINE_LABELS[key] || key;
    await ctx.reply('Какой бюджет рассматриваете?', budgetKeyboard());
    return ctx.wizard.next();
  },
  async (ctx) => {
    const data = ctx.callbackQuery?.data;
    if (!data?.startsWith('bd:')) {
      if (ctx.callbackQuery) await ctx.answerCbQuery();
      await ctx.reply('Выберите бюджет кнопкой ниже.', budgetKeyboard());
      return;
    }
    await ctx.answerCbQuery();
    const key = data.slice(3);
    ctx.wizard.state.lead.budget = BUDGET_LABELS[key] || key;
    await ctx.reply('Как с вами связаться? Telegram @username или телефон.');
    return ctx.wizard.next();
  },
  async (ctx) => {
    const text = ctx.message?.text?.trim();
    if (!text || text.startsWith('/')) {
      await ctx.reply('Укажите контакт: @username или номер телефона.');
      return;
    }
    ctx.wizard.state.lead.contact = text;
    await ctx.reply('Как к вам обращаться? Напишите имя.');
    return ctx.wizard.next();
  },
  async (ctx) => {
    const text = ctx.message?.text?.trim();
    if (!text || text.startsWith('/')) {
      await ctx.reply('Напишите, как к вам обращаться.');
      return;
    }
    ctx.wizard.state.lead.name = text;
    const lead = ctx.wizard.state.lead;

    logLeadCard(lead, {
      telegramId: ctx.from?.id,
      telegramUsername: ctx.from?.username,
    });

    await ctx.reply(formatClientSummary(lead));
    await ctx.reply('Чтобы отправить ещё одну заявку — /start');
    return ctx.scene.leave();
  }
);

leadWizard.command('cancel', async (ctx) => {
  await ctx.reply('Заявку отменил. Чтобы начать заново — /start');
  return ctx.scene.leave();
});
