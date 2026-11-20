# Бюджет — особистий трекер витрат (Next.js + TypeScript + Tailwind)

Фіксований денний бюджет з перенесенням залишку й перевитрат. Дані зберігаються лише в браузері (localStorage, ключ `bt`).

## Запуск
```bash
npm install
npm run dev        # http://localhost:3000
npm run typecheck  # перевірка типів
npm run build      # статичний сайт у папці out/
```

## Публікація на GitHub Pages
1. Залий проєкт у репозиторій (гілка `main`).
2. Settings -> Pages -> Source: **GitHub Actions**.
3. Кожен push у `main` сам збирає і публікує сайт (`.github/workflows/deploy.yml`).
4. Адреса: `https://<нік>.github.io/<назва-репо>/`. Відкрий її в Safari -> «Поділитися» -> «На екран Додому».

Не змінюй назву репозиторію чи нік після початку користування: дані прив'язані до адреси.
Для репозиторію `<нік>.github.io` постав у workflow `NEXT_PUBLIC_BASE_PATH: ""`.

## Структура
```
src/
  app/            маршрути (/, /stats, /settings, /history, /days), layout, globals.css (тема Tailwind)
  components/
    screens/      екрани: Home, Days, History, Stats, Settings
    sheets/       шторки-форми: витрата, поповнення, день, бекап/відновлення
    BottomNav, Sheet, TransactionRow, BarChart, Icons, RegisterSW
  lib/
    budget.ts     ГОЛОВНА ЛОГІКА денного бюджету (чисті функції)
    dates.ts, format.ts, storage.ts, transactions.ts, types.ts, config.ts
  store/          BudgetProvider: дані + збереження в localStorage
  ui/             UiProvider: відкрита шторка і тости
public/           manifest, service worker (sw.js), іконки
```

## Де що міняти
- Правила розрахунку: `src/lib/budget.ts`
- Кольори й тема: `@theme` у `src/app/globals.css`
- Тексти інтерфейсу: у компонентах (українською)
- Валюти: `src/lib/config.ts`; категорії за замовчуванням: `src/lib/storage.ts`
