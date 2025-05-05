import { fixupConfigRules, fixupPluginRules } from "@eslint/compat";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import prettier from "eslint-plugin-prettier";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [...fixupConfigRules(compat.extends(
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
    "plugin:import/recommended",
    "plugin:import/typescript",
)), {
    files: ["**/*.ts, **/*.tsx"],
    plugins: {
        "@typescript-eslint": fixupPluginRules(typescriptEslint),
        prettier: fixupPluginRules(prettier),
    },

    languageOptions: {
        globals: {
            ...globals.browser,
        },

        parser: tsParser,
        ecmaVersion: "latest",
        sourceType: "module",
    },

    settings: {
        "import/parsers": {
            "@typescript-eslint/parser": [".ts", ".tsx"],
        },

        "import/resolver": {
            typescript: {
                alwaysTryTypes: true,
                project: "./tsconfig.json",
            },
        },
    },

    rules: {
        "eol-last": ["error", "always"],
        "linebreak-style": ["error", "unix"],

        "no-multiple-empty-lines": ["error", {
            max: 1,
        }],

        "object-curly-spacing": ["error", "always"],

        "prettier/prettier": ["error", {
            singleQuote: true,
        }],

        semi: ["error", "always"],

        quotes: ["error", "single", {
            avoidEscape: true,
        }],

        "@typescript-eslint/no-empty-function": ["off", "always"],
        "@typescript-eslint/no-unused-vars": "error",

        "import/order": ["error", {
            groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
        }],

        "@typescript-eslint/no-var-requires": "warn",
        "@typescript-eslint/no-non-null-assertion": ["off", "always"],
    },
}];