// eslint.config.js
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create compatibility helper for legacy ESLint configs
const compat = new FlatCompat({
  baseDirectory: __dirname,
});

/** @type {import("eslint").Linter.FlatConfig[]} */
const eslintConfig = [
  // Extend Next.js and TypeScript ESLint rules
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // Additional custom rules (optional)
  {
    rules: {
      "react-hooks/rules-of-hooks": "error", // Ensure hooks follow rules
      "react-hooks/exhaustive-deps": "warn", // Warn about missing deps in useEffect
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }], // Warn unused variables
    },
  },
];

export default eslintConfig;
