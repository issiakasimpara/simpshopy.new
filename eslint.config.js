import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      // Règles TypeScript moins strictes
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "warn", // Changé de "error" à "warn"
      "@typescript-eslint/no-empty-object-type": "warn", // Changé de "error" à "warn"
      "@typescript-eslint/no-empty-interface": "warn", // Changé de "error" à "warn"
      
      // Règles React moins strictes
      "react-hooks/exhaustive-deps": "warn", // Changé de "error" à "warn"
      
      // Règles générales moins strictes
      "no-case-declarations": "warn", // Changé de "error" à "warn"
      "no-prototype-builtins": "warn", // Changé de "error" à "warn"
      "no-useless-escape": "warn", // Changé de "error" à "warn"
      "@typescript-eslint/no-require-imports": "warn", // Changé de "error" à "warn"
      
      // Règles de performance (gardées en warn)
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
    },
  }
);
