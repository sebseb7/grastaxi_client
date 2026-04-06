import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'

export default [
  js.configs.recommended,

  {
    files: ['**/*.js', '**/*.jsx'],
    plugins: {
      react
    },
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      },
      globals: {
        ...globals.browser
      }
    },
    settings: {
      react: {
        version: 'detect'
      }
    },
    rules: {
      // Pull in recommended React rules
      ...react.configs.recommended.rules,

      'react/prop-types': 'off',
      
      // Your existing rules
      'no-unused-vars': ['warn', { varsIgnorePattern: '^React$' }],
      'no-undef': 'error',
      eqeqeq: 'warn',
      'no-debugger': 'warn',

      // Optional: Turn this off if you are using React 17+ (new JSX transform)
      // 'react/react-in-jsx-scope': 'off'
    }
  },

  {
    files: ['**/*.test.js', '**/*.spec.js'],
    languageOptions: {
      globals: {
        ...globals.jest
      }
    },
    rules: {
      'no-unused-vars': ['warn', {
        varsIgnorePattern: '^React$',
        argsIgnorePattern: '^_'
      }]
    }
  },
  {
    files: ['scripts/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.node
      }
    }
  }
]