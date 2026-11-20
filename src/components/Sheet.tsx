"use client";
import type { ReactNode } from "react";
import { useUi } from "@/ui/ui-context";

// Базова «шторка» знизу екрана. Усі форми (витрата, бюджет, бекап) обгортаються в неї.
export function Sheet({ title, children, variant = "dark" }: { title: string; children: ReactNode; variant?: "dark" | "light" }) {
  const { closeSheet } = useUi();
  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/60 backdrop-blur-sm animate-fade" onClick={closeSheet}>
      <div
        role="dialog"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
        className={`sheet-scroll max-h-[92dvh] w-full max-w-md overflow-y-auto rounded-t-[32px] border-t px-5 pt-3 pb-[calc(1.5rem+env(safe-area-inset-bottom))] animate-sheet ${variant === "light" ? "sheet-scroll-light border-black/5 bg-[#f1f1f1] text-[#252525]" : "sheet-scroll-dark border-line bg-[#17171b] text-white"}`}
      >
        <div className={`mx-auto mb-4 h-1.5 w-10 rounded-full ${variant === "light" ? "bg-black/15" : "bg-white/15"}`} />
        <h2 className="mb-3 text-center text-lg font-semibold">{title}</h2>
        {children}
      </div>
    </div>
  );
}
