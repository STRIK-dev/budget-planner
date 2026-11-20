import type { BudgetData, Tx } from "./types";

export function allTransactions(d: BudgetData): Tx[] {
  const e: Tx[] = d.exp.map((x) => ({
    kind: "expense", id: x.id, amount: x.amount, title: x.name || x.cat, cat: x.cat, date: x.date,
  }));
  const t: Tx[] = d.top.map((x) => ({
    kind: "topup", id: x.id, amount: x.amount, title: x.desc || "Додані кошти", date: x.date,
  }));
  return [...e, ...t].sort((a, b) => b.date.localeCompare(a.date));
}
