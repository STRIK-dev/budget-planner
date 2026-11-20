import type { BudgetData } from "./types";
import { addDays, diffDays } from "./dates";

const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0);

/**
 * ГОЛОВНА ЛОГІКА: денний ліміт накопичується з початку періоду, залишок і дефіцит переносяться.
 * - daily = (базовий бюджет + додані кошти) / кількість днів періоду
 * - доступно сьогодні = денні ліміти від початку періоду - витрати до сьогодні
 * - невитрачений залишок і дефіцит переносяться на наступні дні
 */
export function summarize(d: BudgetData, today: string) {
  const days = Math.max(1, diffDays(d.start, d.end) + 1);
  const expenses = d.exp.filter((e) => e.date >= d.start && e.date <= d.end);
  const topUps = d.top.filter((t) => t.date >= d.start && t.date <= d.end);
  const total = d.total + sum(topUps.map((t) => t.amount));
  const daily = total / days;
  const idx = Math.min(Math.max(diffDays(d.start, today), 0), days - 1);
  const inPeriod = today >= d.start && today <= d.end;
  const before = sum(expenses.filter((e) => e.date < today).map((e) => e.amount));
  const spentToday = sum(expenses.filter((e) => e.date === today).map((e) => e.amount));
  const available = daily * (idx + 1) - before;
  const carry = available - daily;
  const spendable = inPeriod ? available : 0;
  const spent = sum(expenses.map((e) => e.amount));
  const from = today > d.start ? today : d.start;
  return {
    days,
    total,
    daily,
    idx,
    inPeriod,
    spentToday,
    available, // накопичений баланс на початок дня до сьогоднішніх витрат
    remaining: spendable - spentToday, // скільки ще можна витратити сьогодні
    carry, // перенесено з попередніх днів
    spent,
    remainingTotal: total - spent,
    daysLeft: Math.max(0, diffDays(from, d.end) + 1),
  };
}

export type DayRow = { date: string; spent: number; balance: number; available: number };

// Усі дні періоду з накопичувальним балансом (для майбутніх днів — прогноз)
export function dayRows(d: BudgetData, today: string): DayRow[] {
  const { days, daily } = summarize(d, today);
  let balance = 0;
  return Array.from({ length: days }, (_, i) => {
    const date = addDays(d.start, i);
    const spent = sum(d.exp.filter((e) => e.date === date).map((e) => e.amount));
    const available = balance + daily;
    balance += daily - spent;
    return { date, spent, balance, available };
  });
}

export function byCategory(d: BudgetData): [string, number][] {
  const m: Record<string, number> = {};
  d.exp.filter((e) => e.date >= d.start && e.date <= d.end).forEach((e) => (m[e.cat] = (m[e.cat] ?? 0) + e.amount));
  return Object.entries(m).sort((a, b) => b[1] - a[1]);
}

export const spentOn = (d: BudgetData, date: string) =>
  sum(d.exp.filter((e) => e.date === date).map((e) => e.amount));
