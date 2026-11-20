"use client";
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { BudgetData, Expense, TopUp } from "@/lib/types";
import { defaultData, loadData, saveData } from "@/lib/storage";
import { todayISO } from "@/lib/dates";

type Ctx = {
  data: BudgetData;
  today: string;
  upsertExpense: (e: Expense) => void;
  removeExpense: (id: string) => void;
  upsertTopUp: (t: TopUp) => void;
  removeTopUp: (id: string) => void;
  patch: (p: Partial<BudgetData>) => void;
  replace: (d: BudgetData) => void;
  reset: () => void;
};

const BudgetCtx = createContext<Ctx | null>(null);

const upsert = <T extends { id: string }>(list: T[], x: T) =>
  list.some((i) => i.id === x.id) ? list.map((i) => (i.id === x.id ? x : i)) : [...list, x];

export function BudgetProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<BudgetData | null>(null);
  const [today, setToday] = useState(todayISO);

  // localStorage доступний лише в браузері, тому читаємо після монтування
  useEffect(() => setData(loadData()), []);
  useEffect(() => {
    if (data) saveData(data);
  }, [data]);
  // Якщо додаток був відкритий через північ — оновити «сьогодні»
  useEffect(() => {
    const f = () => setToday(todayISO());
    document.addEventListener("visibilitychange", f);
    return () => document.removeEventListener("visibilitychange", f);
  }, []);

  const value = useMemo<Ctx | null>(() => {
    if (!data) return null;
    const set = (fn: (d: BudgetData) => BudgetData) => setData((d) => (d ? fn(d) : d));
    return {
      data,
      today,
      upsertExpense: (e) => set((d) => ({ ...d, exp: upsert(d.exp, e) })),
      removeExpense: (id) => set((d) => ({ ...d, exp: d.exp.filter((x) => x.id !== id) })),
      upsertTopUp: (t) => set((d) => ({ ...d, top: upsert(d.top, t) })),
      removeTopUp: (id) => set((d) => ({ ...d, top: d.top.filter((x) => x.id !== id) })),
      patch: (p) => set((d) => ({ ...d, ...p })),
      replace: (d) => setData(d),
      reset: () => setData(defaultData()),
    };
  }, [data, today]);

  if (!value) return <div className="min-h-dvh" />;
  return <BudgetCtx.Provider value={value}>{children}</BudgetCtx.Provider>;
}

export function useBudget() {
  const c = useContext(BudgetCtx);
  if (!c) throw new Error("useBudget має використовуватись всередині BudgetProvider");
  return c;
}
