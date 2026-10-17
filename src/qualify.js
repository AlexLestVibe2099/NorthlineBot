/**
 * Оценка «температуры» заявки по сроку и бюджету.
 * @param {string} deadlineKey week|month|explore|custom
 * @param {string} budgetKey 50|150|300|300plus|talk
 */
export function qualifyLead(deadlineKey, budgetKey) {
  const urgent = deadlineKey === 'week';
  const soon = deadlineKey === 'month' || deadlineKey === 'custom';
  const exploring = deadlineKey === 'explore';
  const solidBudget = ['150', '300', '300plus'].includes(budgetKey);
  const midBudget = budgetKey === '50';

  if (urgent && solidBudget) {
    return { key: 'hot', label: '🔥 Горячая' };
  }

  if (
    urgent ||
    (soon && (solidBudget || midBudget)) ||
    (exploring && solidBudget) ||
    (soon && budgetKey === 'talk')
  ) {
    return { key: 'warm', label: '🌤 Тёплая' };
  }

  return { key: 'cool', label: '❄️ Холодная' };
}
