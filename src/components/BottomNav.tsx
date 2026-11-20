"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChartIcon, GearIcon, HomeIcon } from "./Icons";

const tabs = [
  { href: "/", label: "Головна", Icon: HomeIcon, active: (p: string) => p === "/" || p.startsWith("/history") || p.startsWith("/days") },
  { href: "/stats/", label: "Статистика", Icon: ChartIcon, active: (p: string) => p.startsWith("/stats") },
  { href: "/settings/", label: "Налаштування", Icon: GearIcon, active: (p: string) => p.startsWith("/settings") },
];

export function BottomNav() {
  const path = usePathname();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 flex justify-center px-3 pb-[calc(0.6rem+env(safe-area-inset-bottom))]">
      <div className="flex w-full max-w-md gap-1 rounded-full border border-black/5 bg-white/95 p-1.5 shadow-xl shadow-black/15 backdrop-blur-xl">
        {tabs.map(({ href, label, Icon, active }) => (
          <Link
            key={href}
            href={href}
            className={`flex h-14 flex-1 flex-col items-center justify-center gap-0.5 rounded-[22px] text-[11px] transition ${
              active(path) ? "bg-[#242426] text-white" : "text-[#777]"
            }`}
          >
            <Icon />
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
