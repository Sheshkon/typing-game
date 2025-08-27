import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import importPlugin from 'eslint-plugin-import';
import pluginVue from 'eslint-plugin-vue';
import globals from 'globals';

export default defineConfig([
    {
        files: ['**/*.{js,mjs,cjs,vue}'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: globals.browser
        },
        plugins: {
            vue: pluginVue,
            import: importPlugin
        },
        extends: [
            js.configs.recommended,
            ...pluginVue.configs['flat/essential']
        ],
        rules: {
            quotes: ['error', 'single', { avoidEscape: true }],
            semi: ['error', 'always'],
            'vue/html-quotes': ['error', 'single'],
            'vue/multi-word-component-names': 'off',

            'eol-last': ['error', 'always'],

            'sort-imports': ['error', {
                ignoreCase: true,
                ignoreDeclarationSort: true,
                ignoreMemberSort: false
            }],

            'import/order': ['error', {
                groups: [
                    'builtin',
                    'external',
                    'internal',
                    'parent',
                    'sibling',
                    'index'
                ],
                pathGroups: [
                    { pattern: '@/**', group: 'internal' }
                ],
                pathGroupsExcludedImportTypes: ['builtin'],
                'newlines-between': 'always',
                alphabetize: {
                    order: 'asc',
                    caseInsensitive: true
                }
            }]
        }
    }
]);
