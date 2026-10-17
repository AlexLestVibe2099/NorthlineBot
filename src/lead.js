import { config } from './config.js';

export function formatLeadLines(lead, meta = {}) {
  return [
    `Время:   ${new Date().toLocaleString('ru-RU')}`,
    meta.telegramId ? `TG id:   ${meta.telegramId}` : null,
    meta.telegramUsername ? `TG user: @${meta.telegramUsername}` : null,
    `Имя:     ${lead.name || '—'}`,
    `Услуга:  ${lead.service || '—'}`,
    `Задача:  ${lead.task || '—'}`,
    `Срок:    ${lead.deadline || '—'}`,
    `Бюджет:  ${lead.budget || '—'}`,
    `Контакт: ${lead.contact || '—'}`,
  ].filter((line) => line !== null);
}

/** Печать карточки заявки в консоль. */
export function logLeadCard(lead, meta = {}) {
  const lines = [
    '',
    '========== Новая заявка · Northline ==========',
    ...formatLeadLines(lead, meta),
    '==============================================',
    '',
  ];
  console.log(lines.join('\n'));
}

export function formatManagerCard(lead, meta = {}) {
  return [
    '🆕 Новая заявка · Northline',
    '',
    ...formatLeadLines(lead, meta),
  ].join('\n');
}

export function formatClientSummary(lead) {
  return [
    'Заявка принята. Менеджер Northline скоро свяжется с вами.',
    '',
    `Услуга: ${lead.service}`,
    `Срок: ${lead.deadline}`,
    `Бюджет: ${lead.budget}`,
    `Контакт: ${lead.contact}`,
  ].join('\n');
}

/**
 * Отправляет карточку менеджерам из MANAGER_CHAT_IDS.
 * Чтобы сменить получателя — поменяйте id в .env и перезапустите бота.
 */
export async function notifyManagers(telegram, lead, meta = {}) {
  const ids = config.managerChatIds;
  if (!ids.length) {
    console.warn(
      '[lead] MANAGER_CHAT_IDS не задан — уведомление только в консоль. Узнайте свой id командой /myid в боте.'
    );
    return;
  }

  const text = formatManagerCard(lead, meta);

  for (const chatId of ids) {
    try {
      await telegram.sendMessage(chatId, text);
      console.log(`[lead] Уведомление отправлено менеджеру ${chatId}`);
    } catch (err) {
      console.error(
        `[lead] Не удалось отправить менеджеру ${chatId}: ${err.message}. ` +
          'Менеджер должен хотя бы раз нажать /start у этого бота.'
      );
    }
  }
}
