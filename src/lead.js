/** Печать карточки заявки в консоль (уведомления в Telegram — позже). */
export function logLeadCard(lead, meta = {}) {
  const lines = [
    '',
    '========== Новая заявка · Northline ==========',
    `Время:   ${new Date().toLocaleString('ru-RU')}`,
    meta.telegramId ? `TG id:   ${meta.telegramId}` : null,
    meta.telegramUsername ? `TG user: @${meta.telegramUsername}` : null,
    `Имя:     ${lead.name || '—'}`,
    `Услуга:  ${lead.service || '—'}`,
    `Задача:  ${lead.task || '—'}`,
    `Срок:    ${lead.deadline || '—'}`,
    `Бюджет:  ${lead.budget || '—'}`,
    `Контакт: ${lead.contact || '—'}`,
    '==============================================',
    '',
  ].filter((line) => line !== null);

  console.log(lines.join('\n'));
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
