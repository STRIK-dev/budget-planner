"use client";
import { useCallback, useMemo, useState, type ReactNode } from "react";
import { UiContext, type SheetState } from "./ui-context";
import { ExpenseSheet } from "@/components/sheets/ExpenseSheet";
import { TopUpSheet } from "@/components/sheets/TopUpSheet";
import { DaySheet } from "@/components/sheets/DaySheet";
import { BackupSheet, RestoreSheet } from "@/components/sheets/BackupSheets";

// Тримає стан відкритого «шторки» (bottom sheet) і тости для всього застосунку
export function UiProvider({ children }: { children: ReactNode }) {
  const [sheet, setSheet] = useState<SheetState | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const toast = useCallback((m: string) => {
    setMessage(m);
    setTimeout(() => setMessage(null), 2200);
  }, []);
  const value = useMemo(() => ({ openSheet: setSheet, closeSheet: () => setSheet(null), toast }), [toast]);

  return (
    <UiContext.Provider value={value}>
      {children}
      {sheet?.type === "expense" && <ExpenseSheet key={sheet.id ?? "new"} id={sheet.id} date={sheet.date} />}
      {sheet?.type === "topup" && <TopUpSheet key={sheet.id ?? "new"} id={sheet.id} />}
      {sheet?.type === "day" && <DaySheet date={sheet.date} />}
      {sheet?.type === "backup" && <BackupSheet />}
      {sheet?.type === "restore" && <RestoreSheet />}
      {message && <div className="toast">{message}</div>}
    </UiContext.Provider>
  );
}
