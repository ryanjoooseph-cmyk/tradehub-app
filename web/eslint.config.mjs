import { defineConfig, globalIgnores } from "eslint/config"
import nextVitals from "eslint-config-next/core-web-vitals"
import nextTs from "eslint-config-next/typescript"

export default defineConfig([
  ...nextVitals,
  ...nextTs,

  // Make sure the Next plugin resolves the Next app inside /web
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    settings: {
      next: { rootDir: "." },
    },
  },

  // Ignore generated output
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "node_modules/**",
  ]),
])
