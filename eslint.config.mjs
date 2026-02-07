import nextPlugin from "@next/eslint-plugin-next";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import tseslint from "typescript-eslint";
import importPlugin from "eslint-plugin-import";
import jsxA11yPlugin from "eslint-plugin-jsx-a11y";
import globals from "globals";

/** @type {import('eslint').Linter.Config[]} */
const eslintConfig = [
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
  // Base config for all files
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      "@next/next": nextPlugin,
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
      import: importPlugin,
      "jsx-a11y": jsxA11yPlugin,
    },
    rules: {
      // Next.js recommended rules (based on @next/eslint-plugin-next v16)
      "@next/next/google-font-display": "warn",
      "@next/next/google-font-preconnect": "warn",
      "@next/next/next-script-for-ga": "warn",
      "@next/next/no-async-client-component": "warn",
      "@next/next/no-before-interactive-script-outside-document": "warn",
      "@next/next/no-css-tags": "warn",
      "@next/next/no-head-element": "warn",
      "@next/next/no-html-link-for-pages": "warn",
      "@next/next/no-img-element": "warn",
      "@next/next/no-page-custom-font": "warn",
      "@next/next/no-styled-jsx-in-document": "warn",
      "@next/next/no-sync-scripts": "warn",
      "@next/next/no-title-in-document-head": "warn",
      "@next/next/no-typos": "warn",
      "@next/next/no-unwanted-polyfillio": "warn",
      "@next/next/inline-script-id": "error",
      "@next/next/no-assign-module-variable": "error",
      "@next/next/no-document-import-in-page": "error",
      "@next/next/no-duplicate-head": "error",
      "@next/next/no-head-import-in-document": "error",
      "@next/next/no-script-component-in-head": "error",

      // React rules
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      // Import rules
      "import/no-anonymous-default-export": "warn",

      // JSX A11y rules
      "jsx-a11y/alt-text": "warn",
      "jsx-a11y/aria-props": "warn",
      "jsx-a11y/aria-proptypes": "warn",
      "jsx-a11y/aria-unsupported-elements": "warn",
      "jsx-a11y/role-has-required-aria-props": "warn",
      "jsx-a11y/role-supports-aria-props": "warn",
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
  // TypeScript specific config
  ...tseslint.configs.recommended.map((config) => ({
    ...config,
    files: ["**/*.ts", "**/*.tsx"],
  })),
];

export default eslintConfig;
