/* Strict ESLint config with security + a11y for Next.js */
module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "security", "jsx-a11y"],
  extends: [
    "next/core-web-vitals",
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:security/recommended",
    "plugin:jsx-a11y/recommended"
  ],
  settings: { react: { version: "detect" } },
  rules: {
    "react/no-danger": "error",
    "react/jsx-no-target-blank": ["error", { allowReferrer: false }],
    "jsx-a11y/anchor-has-content": "error",
    "security/detect-object-injection": "off",
    "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
    "no-console": ["warn", { allow: ["warn", "error"] }]
  },
  overrides: [{ files: ["**/*.js"], rules: { "@typescript-eslint/no-var-requires": "off" } }]
};
