// @ts-check

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config({
	extends: [eslint.configs.recommended, tseslint.configs.recommended, tseslint.configs.stylistic],
	rules: {
		"no-unused-vars": "off",
		"@typescript-eslint/no-unused-vars": [
			"warn",
			{ argsIgnorePattern: "^_", varsIgnorePattern: "^_", caughtErrorsIgnorePattern: "^_" },
		],
		quotes: ["warn", "single"],
		semi: ["error", "always"],
		eqeqeq: ["error", "always"],
		"@typescript-eslint/explicit-function-return-type": "error",
		"@typescript-eslint/no-explicit-any": "off",
		"@typescript-eslint/consistent-type-imports": ["error", { prefer: "type-imports" }],
		"@typescript-eslint/ban-ts-comment": "off",
	},
	ignores: ["**/*.config.*", "node_modules/**/*", "dist/**/*", ".git/", ".vscode/", ".github/", ".idea/", ".zed"],
});
