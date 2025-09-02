import js from '@eslint/js';
import json from "@eslint/json";
import prettier from 'eslint-plugin-prettier';

export default [
  // Ignore specific directories and files first
  {
    ignores: [
      "node_modules/**",
      "dist/**",
      "build/**",
      "coverage/**",
      "test-results/**",
      "playwright-report/**",
      "blob-report/**",
      ".husky/**",
      ".git/**",
      "package.json",
      "pnpm-lock.yaml"
    ]
  },
  
  // Use ESLint recommended configs
  js.configs.recommended,
  
  // Main configuration for JavaScript, TypeScript, and React files
  {
    files: ["**/*.{js,ts,jsx,tsx}"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        console: "readonly",
        process: "readonly",
        Buffer: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
        global: "readonly",
        module: "readonly",
        require: "readonly",
        exports: "readonly",
        // Browser globals for Playwright tests
        localStorage: "readonly",
        sessionStorage: "readonly",
        window: "readonly",
        document: "readonly",
        navigator: "readonly",
        location: "readonly"
      }
    },
    plugins: { prettier },
    rules: {
      // Prettier integration
      'prettier/prettier': 'error',
      
      // Basic JavaScript/TypeScript rules
      "no-unused-vars": "warn",
      "no-console": "off",
      "prefer-const": "error",
      "no-var": "error",
      "eqeqeq": "error",
      "curly": "error",
      "semi": "error",
      "quotes": ["error", "single"],
      "indent": ["error", 2],
      "comma-dangle": ["error", "never"],
      "no-trailing-spaces": "error",
      "eol-last": "error"
    }
  },
  
  // JSON files configuration
  { 
    files: ["**/*.json"], 
    plugins: { json }, 
    extends: ["json/recommended"] 
  }
];
