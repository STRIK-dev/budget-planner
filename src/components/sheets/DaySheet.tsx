"use client";
import { Sheet } from "../Sheet";
import { TransactionRow } from "../TransactionRow";
import { useBudget } from "@/store/BudgetProvider";
import { useUi } from "@/ui/ui-context";
import { allTransactions } from "@/lib/transactions";
import { fmtDay } from "@/lib/dates";
import { dayRows } from "@/lib/budget";
import { money } from "@/lib/format";

// Транзакції одного дня + швидке додавання витрати на цю дату (в т.ч. на майбутнє)
export function DaySheet({ date }: { date: string }) {
  const { data, today } = useBudget();
  const { openSheet } = useUi();
  const list = allTransactions(data).filter((t) => t.date === date);
  const row = dayRows(data, today).find((r) => r.date === date);
  return (
    <Sheet title={fmtDay(date, { weekday: "long", day: "numeric", month: "long" })} variant="light">
      {row && <div className="mb-3 grid grid-cols-2 gap-2 rounded-[22px] bg-white p-4">
        <div><p className="text-xs text-[#888]">Витрачено</p><p className="mt-1 font-bold tabular-nums">{money(row.spent)} <span className="text-xs font-medium text-[#888]">{data.cur}</span></p></div>
        <div className="text-right"><p className="text-xs text-[#888]">Доступно за день</p><p className="mt-1 font-bold tabular-nums">{money(row.available)} <span className="text-xs font-medium text-[#888]">{data.cur}</span></p><p className={`mt-1 text-[11px] tabular-nums ${row.balance < 0 ? "text-[#c65353]" : "text-[#43845c]"}`}>Баланс {row.balance >= 0 ? "+" : ""}{money(row.balance)}</p></div>
      </div>}
      <div className="rounded-[22px] bg-white px-4">
        {list.length ? list.map((t) => <TransactionRow key={t.kind + t.id} tx={t} variant="light" />) : <p className="py-6 text-center text-sm text-[#888]">Цього дня транзакцій немає.</p>}
      </div>
      <button className="mt-3 h-13 w-full rounded-2xl bg-[#242426] font-semibold text-white" onClick={() => openSheet({ type: "expense", date })}>Додати витрату на цей день</button>
    </Sheet>
  );
}
