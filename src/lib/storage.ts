import type { BudgetData, Category } from "./types";
import { addDays, todayISO } from "./dates";

export const STORAGE_KEY = "bt";

export const defaultCategories: Category[] = [
  { n: "Їжа", i: "🍽️" },
  { n: "Транспорт", i: "🚌" },
  { n: "Розваги", i: "🎬" },
  { n: "Покупки", i: "🛍️" },
  { n: "Інше", i: "✨" },
];

export function defaultData(): BudgetData {
  const t = todayISO();
  return { name: "", cur: "CHF", total: 159, start: t, end: addDays(t, 29), cats: defaultCategories, exp: [], top: [] };
}

// Перевіряє, що об'єкт схожий на наші дані (захист від битого бекапу)
function sanitize(raw: unknown): BudgetData | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Partial<BudgetData>;
  if (!Array.isArray(o.exp) || !Array.isArray(o.top) || typeof o.start !== "string" || typeof o.end !== "string") return null;
  return { ...defaultData(), ...o, total: Number(o.total) || 0 } as BudgetData;
}

export function loadData(): BudgetData {
  try {
    const j = localStorage.getItem(STORAGE_KEY);
    if (j) {
      const d = sanitize(JSON.parse(j));
      if (d) return d;
    }
  } catch {}
  return defaultData();
}

export function saveData(d: BudgetData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(d));
  } catch {}
}

export function parseBackup(text: string): BudgetData | null {
  try {
    return sanitize(JSON.parse(text.trim()));
  } catch {
    return null;
  }
}
