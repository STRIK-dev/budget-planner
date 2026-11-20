"use client";
import { createContext, useContext } from "react";

export type SheetState =
  | { type: "expense"; id?: string; date?: string }
  | { type: "topup"; id?: string }
  | { type: "day"; date: string }
  | { type: "backup" }
  | { type: "restore" };

type UiCtx = {
  openSheet: (s: SheetState) => void;
  closeSheet: () => void;
  toast: (message: string) => void;
};

export const UiContext = createContext<UiCtx | null>(null);

export function useUi() {
  const c = useContext(UiContext);
  if (!c) throw new Error("useUi має використовуватись всередині UiProvider");
  return c;
}
