"use client";
import { useRef, useState } from "react";
import { Sheet } from "../Sheet";
import { useBudget } from "@/store/BudgetProvider";
import { useUi } from "@/ui/ui-context";
import { parseBackup } from "@/lib/storage";

export function BackupSheet() {
  const { data } = useBudget();
  const { toast } = useUi();
  const ref = useRef<HTMLTextAreaElement>(null);
  const text = JSON.stringify(data);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      toast("Скопійовано");
    } catch {
      ref.current?.select();
      toast("Затисни текст і обери «Скопіювати»");
    }
  };

  return (
    <Sheet title="Резервна копія" variant="light">
      <p className="mx-1 mb-3 text-sm text-[#777]">Скопіюй цей текст і збережи в Нотатках або надішли собі. Його можна вставити в «Відновити».</p>
      <textarea ref={ref} readOnly rows={8} value={text} className="w-full rounded-2xl border border-black/5 bg-white p-4 text-xs text-[#444] outline-none focus:border-black/20" />
      <button className="mt-3 h-13 w-full rounded-2xl bg-[#242426] font-semibold text-white" onClick={copy}>Скопіювати</button>
      {typeof navigator !== "undefined" && "share" in navigator && (
        <button className="mt-2 h-12 w-full rounded-2xl bg-white font-semibold text-[#333]" onClick={() => navigator.share({ title: "Бекап бюджету", text }).catch(() => {})}>
          Поділитися
        </button>
      )}
    </Sheet>
  );
}

export function RestoreSheet() {
  const { replace } = useBudget();
  const { closeSheet, toast } = useUi();
  const [text, setText] = useState("");

  const restore = () => {
    const d = parseBackup(text);
    if (!d) return toast("Це не схоже на резервну копію");
    replace(d);
    closeSheet();
    toast("Дані відновлено");
  };

  return (
    <Sheet title="Відновити з копії" variant="light">
      <p className="mx-1 mb-3 text-sm text-[#777]">Встав текст резервної копії. Він замінить дані на цьому пристрої.</p>
      <textarea rows={8} value={text} onChange={(e) => setText(e.target.value)} placeholder="Встав копію сюди" className="w-full rounded-2xl border border-black/5 bg-white p-4 text-xs text-[#444] outline-none placeholder:text-[#999] focus:border-black/20" />
      <button className="mt-3 h-13 w-full rounded-2xl bg-[#242426] font-semibold text-white" onClick={restore}>Відновити дані</button>
    </Sheet>
  );
}
