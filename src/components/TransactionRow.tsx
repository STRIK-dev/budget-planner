"use client";
import type { Tx } from "@/lib/types";
import { fmtDay } from "@/lib/dates";
import { money } from "@/lib/format";
import { useBudget } from "@/store/BudgetProvider";
import { useUi } from "@/ui/ui-context";

export function TransactionRow({ tx, variant = "dark" }: { tx: Tx; variant?: "dark" | "light" }) {
  const { data } = useBudget();
  const { openSheet } = useUi();
  const plus = tx.kind === "topup";
  const icon = plus ? "💰" : data.cats.find((c) => c.n === tx.cat)?.i ?? "✨";
  return (
    <button
      type="button"
      onClick={() => openSheet(plus ? { type: "topup", id: tx.id } : { type: "expense", id: tx.id })}
      className={`flex w-full items-center gap-3 border-b py-3 text-left last:border-0 active:opacity-70 ${variant === "light" ? "border-black/5 text-[#252525]" : "border-line"}`}
    >
      <span className={`grid size-11 place-items-center rounded-2xl text-xl ${variant === "light" ? "bg-[#e4e4e4]" : "bg-card2"}`}>{icon}</span>
      <span className="min-w-0 flex-1">
        <b className="block truncate font-semibold">{tx.title}</b>
        <span className={`text-xs ${variant === "light" ? "text-[#777]" : "text-mute"}`}>
          {fmtDay(tx.date)}
          {tx.cat ? ` · ${tx.cat}` : ""}
        </span>
      </span>
      <b className={`tabular-nums ${plus ? (variant === "light" ? "text-emerald-700" : "text-good") : ""}`}>
        {plus ? "+" : "−"}
        {money(tx.amount)}
      </b>
    </button>
  );
}
