import { Scenes } from 'telegraf';
import { ABOUT_DETAILS, ABOUT_TEXT, TIMING_TEXT } from './content.js';
import {
  BUDGET_LABELS,
  DEADLINE_LABELS,
  SERVICE_LABELS,
  aboutKeyboard,
  backToMenuKeyboard,
  budgetKeyboard,
  deadlineKeyboard,
  serviceKeyboard,
  startKeyboard,
} from './keyboards.js';
import { formatClientSummary, logLeadCard, notifyManagers } from './lead.js';
import { qualifyLead } from './qualify.js';

function emptyLead() {
  return {
    service: '',
    task: '',
    deadline: '',
    deadlineKey: '',
    budget: '',
    budgetKey: '',
    contact: '',
    name: '',
    heat: null,
  };
}

async function handleMenuCallbacks(ctx) {
  const data = ctx.callbackQuery?.data;
  if (!data) return false;

  if (data === 'lead:menu') {
    await ctx.answerCbQuery();
    await ctx.reply(
      'Чем помочь? Можно узнать о студии или сразу оставить заявку.',
      startKeyboard()
    );
    return true;
  }

  if (data === 'lead:about') {
    await ctx.answerCbQuery();
    await ctx.reply(ABOUT_TEXT, aboutKeyboard());
    return true;
  }

  if (data === 'lead:timing') {
    await ctx.answerCbQuery();
    await ctx.reply(TIMING_TEXT, backToMenuKeyboard());
    return true;
  }

  if (data.startsWith('about:')) {
    await ctx.answerCbQuery();
    const key = data.slice(6);
    const text = ABOUT_DETAILS[key];
    if (text) {
      await ctx.reply(text, aboutKeyboard());
    } else {
      await ctx.reply(ABOUT_TEXT, aboutKeyboard());
    }
    return true;
  }

  if (data === 'lead:start') {
    await ctx.answerCbQuery();
    ctx.wizard.state.lead = emptyLead();
    ctx.wizard.state.awaitingCustomDeadline = false;
    // Шаг выбора услуги (индекс 2)
    ctx.wizard.selectStep(2);
    await ctx.reply('Какая услуга нужна?', serviceKeyboard());
    return true;
  }

  return false;
}

export const leadWizard = new Scenes.WizardScene(
  'northline-lead',
  async (ctx) => {
    ctx.wizard.state.lead = emptyLead();
    await ctx.reply(
      [
        'Привет! Я помогу оставить заявку в Northline.',
        'Можно сначала посмотреть, чем занимаемся и как работаем — или сразу заполнить заявку.',
      ].join('\n'),
      startKeyboard()
    );
    return ctx.wizard.next();
  },
  async (ctx) => {
    if (await handleMenuCallbacks(ctx)) return;

    if (ctx.callbackQuery) await ctx.answerCbQuery();
    await ctx.reply('Выберите пункт меню или нажмите «Оставить заявку».', startKeyboard());
  },
  async (ctx) => {
    if (await handleMenuCallbacks(ctx)) return;

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
      ctx.wizard.state.lead.deadlineKey = 'custom';
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
    ctx.wizard.state.lead.deadlineKey = key;
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
    ctx.wizard.state.lead.budgetKey = key;
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
    const lead = ctx.wizard.state.lead;
    lead.name = text;
    lead.heat = qualifyLead(lead.deadlineKey, lead.budgetKey);

    const meta = {
      telegramId: ctx.from?.id,
      telegramUsername: ctx.from?.username,
    };

    logLeadCard(lead, meta);
    await notifyManagers(ctx.telegram, lead, meta);

    await ctx.reply(formatClientSummary(lead));
    await ctx.reply('Чтобы отправить ещё одну заявку — /start');
    return ctx.scene.leave();
  }
);

leadWizard.command('cancel', async (ctx) => {
  await ctx.reply('Заявку отменил. Чтобы начать заново — /start');
  return ctx.scene.leave();
});
