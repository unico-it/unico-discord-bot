// @ts-check

import stylistic from "@stylistic/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

export default [
  {
    ignores: ["**/*.config.*", "node_modules/**/*", "dist/**/*", ".git/", ".vscode/", ".github/", ".idea/", ".zed"],
  },
  {
    files: ["**/*.{js,ts,jsx,tsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parser: tsParser,
    },
    plugins: {
      "@stylistic": stylistic,
    },
    rules: {
      "@stylistic/quotes": ["warn", "single"],
      "@stylistic/semi": ["error", "always"],
      "@stylistic/indent": ["error", "tab"],
      "@stylistic/comma-dangle": ["error", "only-multiline"],
      "@stylistic/array-bracket-spacing": ["error", "never"],
      "@stylistic/object-curly-spacing": ["error", "always"],
      "@stylistic/space-before-function-paren": [
        "error",
        {
          anonymous: "never",
          named: "never",
          asyncArrow: "always",
        },
      ],
      "@stylistic/type-annotation-spacing": "error",
      "@stylistic/member-delimiter-style": "error",
      "prefer-const": "error",
    },
  },
];
