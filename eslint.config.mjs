import { fixupConfigRules, fixupPluginRules } from '@eslint/compat'
import { FlatCompat } from '@eslint/eslintrc'
import pluginJs from '@eslint/js'
import checkFile from 'eslint-plugin-check-file'
import importPlugin from 'eslint-plugin-import'
import prettier from 'eslint-plugin-prettier'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { configs } from 'typescript-eslint'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: pluginJs.configs.recommended,
  allConfig: pluginJs.configs.all,
})

export default [
  {
    ignores: ['./*.{js,mjs,ts,mts}', '**/node_modules', '**/dist'],
  },

  ...configs.recommended,

  ...fixupConfigRules(
    compat.extends('plugin:import/typescript', 'plugin:prettier/recommended')
  ),
  {
    plugins: {
      'check-file': checkFile,
      import: fixupPluginRules(importPlugin),
      prettier: fixupPluginRules(prettier),
    },

    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },

    settings: {
      'import/resolver': {
        typescript: {},
      },
    },

    rules: {
      'import/prefer-default-export': 0,
      'no-underscore-dangle': 0,
      'jsx-a11y/no-static-element-interactions': 0,
      'no-plusplus': 0,
      'no-useless-escape': 0,
      'jsx-a11y/click-events-have-key-events': 0,
      'jsx-a11y/label-has-associated-control': 0,
      '@typescript-eslint/explicit-module-boundary-types': 0,
      'no-void': 0,
      'symbol-description': 0,
      'consistent-return': 0,

      'prettier/prettier': 1,

      '@typescript-eslint/no-unused-vars': [
        1,
        {
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],

      'no-param-reassign': 2,
      '@typescript-eslint/no-floating-promises': 2,
      'prefer-arrow-callback': [2, { allowNamedFunctions: false }],
      'func-style': [2, 'declaration', { allowArrowFunctions: false }],

      '@typescript-eslint/naming-convention': [
        2,
        {
          selector: ['typeLike', 'interface'],
          leadingUnderscore: 'allowSingleOrDouble',
          trailingUnderscore: 'allowSingleOrDouble',
          format: ['PascalCase'],
        },
        {
          selector: 'parameter',
          leadingUnderscore: 'allowSingleOrDouble',
          trailingUnderscore: 'allowSingleOrDouble',
          format: ['camelCase'],
        },
        {
          selector: 'variable',
          leadingUnderscore: 'allowSingleOrDouble',
          trailingUnderscore: 'allowSingleOrDouble',
          format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
        },
      ],

      'check-file/folder-naming-convention': [2, { '*/**': 'KEBAB_CASE' }],
      'check-file/filename-naming-convention': [
        2,
        { '**/*.*': 'KEBAB_CASE' },
        { ignoreMiddleExtensions: true },
      ],
    },
  },

  {
    files: ['**/*.test.ts'],
    rules: {
      '@typescript-eslint/no-unsafe-call': 0,
      '@typescript-eslint/no-unsafe-assignment': 0,
      '@typescript-eslint/no-unsafe-member-access': 0,
      'import/no-extraneous-dependencies': 0,
      '@typescript-eslint/no-require-imports': 0,
      'import/no-anonymous-default-export': 0,
    },
  },
]
