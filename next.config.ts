import type { NextConfig } from "next";

// На GitHub Pages сайт живе за адресою /назва-репозиторію,
// тому basePath приходить зі змінної середовища (див. .github/workflows/deploy.yml).
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const config: NextConfig = {
  output: "export", // статичний сайт у папці out/
  trailingSlash: true,
  basePath,
  images: { unoptimized: true },
};

export default config;
