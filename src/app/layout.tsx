import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { BASE } from "@/lib/config";
import { BudgetProvider } from "@/store/BudgetProvider";
import { UiProvider } from "@/ui/UiProvider";
import { BottomNav } from "@/components/BottomNav";
import { RegisterSW } from "@/components/RegisterSW";

const manrope = Manrope({ subsets: ["latin", "cyrillic"], variable: "--font-manrope" });

export const metadata: Metadata = {
  title: "Бюджет",
  appleWebApp: { capable: true, title: "Бюджет", statusBarStyle: "black-translucent" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#101013",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk" className={manrope.variable}>
      <head>
        <link rel="manifest" href={`${BASE}/manifest.webmanifest`} />
        <link rel="icon" type="image/svg+xml" href={`${BASE}/icon.svg`} />
        <link rel="apple-touch-icon" href={`${BASE}/apple-touch-icon.png`} />
      </head>
      <body>
        <BudgetProvider>
          <UiProvider>
            <main className="mx-auto w-full max-w-md px-5 pt-4 pb-36">{children}</main>
            <BottomNav />
          </UiProvider>
        </BudgetProvider>
        <RegisterSW />
      </body>
    </html>
  );
}
