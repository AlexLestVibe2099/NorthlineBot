import { Markup } from 'telegraf';

export const startKeyboard = () =>
  Markup.inlineKeyboard([
    [Markup.button.callback('Оставить заявку', 'lead:start')],
    [Markup.button.callback('Что мы делаем', 'lead:about')],
    [Markup.button.callback('Сроки и формат', 'lead:timing')],
  ]);

export const aboutKeyboard = () =>
  Markup.inlineKeyboard([
    [Markup.button.callback('Лендинги и сайты', 'about:landing')],
    [Markup.button.callback('Telegram-боты', 'about:bot')],
    [Markup.button.callback('Интеграции', 'about:auto')],
    [Markup.button.callback('Оставить заявку', 'lead:start')],
    [Markup.button.callback('« Назад', 'lead:menu')],
  ]);

export const backToMenuKeyboard = () =>
  Markup.inlineKeyboard([
    [Markup.button.callback('Оставить заявку', 'lead:start')],
    [Markup.button.callback('« Назад в меню', 'lead:menu')],
  ]);

export const serviceKeyboard = () =>
  Markup.inlineKeyboard([
    [Markup.button.callback('Лендинг / сайт', 'svc:landing')],
    [Markup.button.callback('Telegram-бот', 'svc:bot')],
    [Markup.button.callback('Автоматизация / интеграции', 'svc:auto')],
    [Markup.button.callback('Комплекс (сайт + бот)', 'svc:combo')],
    [Markup.button.callback('Другое', 'svc:other')],
  ]);

export const deadlineKeyboard = () =>
  Markup.inlineKeyboard([
    [Markup.button.callback('На этой неделе', 'dl:week')],
    [Markup.button.callback('В течение месяца', 'dl:month')],
    [Markup.button.callback('Пока прицениваюсь', 'dl:explore')],
    [Markup.button.callback('Свой вариант', 'dl:custom')],
  ]);

export const budgetKeyboard = () =>
  Markup.inlineKeyboard([
    [Markup.button.callback('до 50 000 ₽', 'bd:50')],
    [Markup.button.callback('50–150 000 ₽', 'bd:150')],
    [Markup.button.callback('150–300 000 ₽', 'bd:300')],
    [Markup.button.callback('от 300 000 ₽', 'bd:300plus')],
    [Markup.button.callback('Обсудим', 'bd:talk')],
  ]);

export const SERVICE_LABELS = {
  landing: 'Лендинг / сайт',
  bot: 'Telegram-бот',
  auto: 'Автоматизация / интеграции',
  combo: 'Комплекс (сайт + бот)',
  other: 'Другое',
};

export const DEADLINE_LABELS = {
  week: 'На этой неделе',
  month: 'В течение месяца',
  explore: 'Пока прицениваюсь',
  custom: 'Свой вариант',
};

export const BUDGET_LABELS = {
  '50': 'до 50 000 ₽',
  '150': '50–150 000 ₽',
  '300': '150–300 000 ₽',
  '300plus': 'от 300 000 ₽',
  talk: 'Обсудим',
};
