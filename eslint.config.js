import globals from "globals";
import pluginJs from "@eslint/js";
import pkg from "@eslint/js";
import eslintPluginUnicorn from "eslint-plugin-unicorn";
import eslintPluginImport from "eslint-plugin-import";

/** @type {import('eslint').Linter.Config[]} */
export default [
  // Recommended configuration from the `@eslint/js` plugin
  pluginJs.configs.recommended,
  pkg.recommended || pluginJs.configs.recommended, // Also include eslint's recommended rules
  // Custom configuration for Node.js
  {
    files: ["**/*.js"], // Target JavaScript files
    languageOptions: {
      globals: globals.node, // Add Node.js globals instead of browser
      ecmaVersion: "latest", // Use the latest ECMAScript version
      sourceType: "module", // Support ES Modules (if applicable)
    },
    // parser: "@babel/eslint-parser", // Use Babel parser
    // parserOptions: {
    //     ecmaVersion: "latest",
    //     sourceType: "module",
    //   requireConfigFile: false, // Allows usage without a Babel config file
    // },
    plugins: {
      unicorn: eslintPluginUnicorn, // Define plugins as an object
      import: eslintPluginImport, // Add eslint-plugin-import
    },
    rules: {
      // Add custom rules here
      "no-unused-vars": "warn",
      "no-console": "off", // Allow console logs for debugging purposes
      strict: ["error", "global"], // Enforce strict mode

      // Naming conventions
      camelcase: [
        "error",
        { properties: "always", ignoreDestructuring: false },
      ],
      // "func-names": ["error", "as-needed"],
      "func-names": ["off"],
      // "max-lines-per-function": ["warn", 50],
      "no-mixed-requires": "error",

      // Unicorn-specific rules
      "unicorn/filename-case": [
        "error",
        {
          cases: {
            camelCase: true, // Enforce camelCase for file names
            pascalCase: true, // You can allow PascalCase for classes or other files
          },
        },
      ],

      // Import Assertions rule
      // "import/assertions": ["error", { json: "always" }], // Enforce JSON imports with assertions

      // Route naming (enforce lowercase for routes)
      "unicorn/prefer-lowercase": "off",
    },
    ignores: [
      "node_modules/", // Ignore node_modules directory
      "dist/", // Ignore dist directory
      "build/", // Ignore build directory
      ".env", // Ignore .env files
      "coverage/", // Ignore coverage directory
      ".vscode/", // Ignore VSCode settings
      "*.log", // Ignore log files
      "*.min.js", // Ignore minified JS files
      "package-lock.json", // Ignore package lock files
      "pnpm-lock.yaml", // Ignore pnpm lock file
      "yarn.lock", // Ignore yarn lock file
    ],
  },
];
