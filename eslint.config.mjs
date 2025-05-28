import { defineConfig } from "eslint/config";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import unusedImports from "eslint-plugin-unused-imports";
import simpleImportSort from "eslint-plugin-simple-import-sort";
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

export default defineConfig([{
    extends: compat.extends("next/core-web-vitals", "plugin:prettier/recommended"),

    rules: {
        "prettier/prettier": ["error", {
            singleQuote: true,
            endOfLine: "auto",
        }],
    },
}, {
    files: ["**/*.ts", "**/*.tsx", "**/*.mts"],
    extends: compat.extends("next/core-web-vitals", "plugin:prettier/recommended"),

    plugins: {
        "@typescript-eslint": typescriptEslint,
        "unused-imports": unusedImports,
        "simple-import-sort": simpleImportSort,
    },

    languageOptions: {
        parser: tsParser,
        ecmaVersion: 5,
        sourceType: "script",

        parserOptions: {
            project: "./tsconfig.json",
        },
    },

    rules: {
        "prettier/prettier": ["error", {
            singleQuote: true,
            endOfLine: "auto",
        }],

        "import/extensions": "off",
        "react/function-component-definition": "off",
        "react/destructuring-assignment": "off",
        "react/require-default-props": "off",
        "react/jsx-props-no-spreading": "off",
        "react/no-array-index-key": "off",
        "@typescript-eslint/comma-dangle": "off",
        "@typescript-eslint/consistent-type-imports": "error",
        "no-restricted-syntax": ["error", "ForInStatement", "LabeledStatement", "WithStatement"],
        "import/prefer-default-export": "off",
        "simple-import-sort/imports": "error",
        "simple-import-sort/exports": "error",
        "import/order": "off",
        "@typescript-eslint/no-unused-vars": "off",
        "unused-imports/no-unused-imports": "error",

        "unused-imports/no-unused-vars": ["error", {
            argsIgnorePattern: "^_",
        }],

        "@typescript-eslint/no-explicit-any": "warn",
        "react/button-has-type": "off",
        "@typescript-eslint/no-use-before-define": "off",
        "no-underscore-dangle": "off",
        "no-plusplus": "off",
        "jsx-a11y/control-has-associated-label": "off",
    },
}]);