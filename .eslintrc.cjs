module.exports = {
  extends: ['mantine',  "prettier", "eslint:recommended",
    "plugin:@typescript-eslint/recommended"],
  plugins: [ "prettier", "@typescript-eslint"],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
  },
  rules: {
    'react/react-in-jsx-scope': 'off',
    'import/extensions': 'off',
    "@typescript-eslint/no-throw-literal": "off", 
    "@typescript-eslint/no-explicit-any":"off",
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_", "varsIgnorePattern": "^_" }],

    "prettier/prettier": [
      "error",
      {
          "printWidth": 80,
          "trailingComma": "es5",
          "semi": true,
          "endOfLine": "auto",
          "no-mixed-spaces-and-tabs": [
              "error",
              "smart-tabs"
          ],
          "no-unused-vars": [
              "error"
          ]
      }
  ]

  },
};
