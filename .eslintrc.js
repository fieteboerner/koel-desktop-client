module.exports = {
  "root": true,
  "env": {
    "browser": true,
    "es6": true,
    "node": true,
  },
  "plugins": [
    "vue",
  ],
  "extends": [
    "plugin:vue/recommended",
    "eslint:recommended",
    "@vue/typescript"
  ],
  "rules": {
    "semi": [
      "error",
      "never"
    ],
    "quotes": [
      "error",
      "single"
    ],
    "no-console": "error",
    "indent": [
      "error",
      2
    ],
    "key-spacing": [
      "error",
      {
        "beforeColon": false,
        "afterColon": true,
      }
    ],
    "object-curly-spacing": [
      "error",
      "always"
    ],
    "object-property-newline": [
      "error",
      {
        "allowAllPropertiesOnSameLine": false
      }
    ],
    "object-shorthand": ["error", "always"],
    "object-curly-newline": [
      "error",
      {
        "ObjectExpression": {
          "multiline": true,
          "consistent": true,
        },
        "ObjectPattern": {
          "multiline": true
        },
        "ImportDeclaration": {
          "multiline": true
        },
        "ExportDeclaration": {
          "multiline": true,
          "minProperties": 3
        }
      }
    ],
  },
  "parserOptions": {
    "parser": "@typescript-eslint/parser"
  },
  "overrides": [
    {
      "files": [
        "*.vue"
      ],
      "rules": {
        "vue/html-indent": [
          "error",
          2,
          {
            "attribute": 1,
            "baseIndent": 1,
            "closeBracket": 0,
            "alignAttributesVertically": false,
            "ignores": []
          }
        ],
        "vue/html-closing-bracket-spacing": [
          "error",
          {
            "startTag": "never",
            "endTag": "never",
            "selfClosingTag": "always"
          }
        ],
        "vue/component-name-in-template-casing": [
          "error",
          "PascalCase",
          {
            "ignores": ["/^b-/", "/^router-/", "transition"],
            "registeredComponentsOnly": false
          }
        ],
        "vue/max-attributes-per-line": [
          "error",
          {
            "singleline": 3,
            "multiline": {
              "max": 1,
              "allowFirstLine": false
            }
          }
        ],
        "vue/v-bind-style": [
          "error",
          "shorthand"
        ],
        "vue/v-on-style": [
          "error",
          "shorthand"
        ],
      }
    }
  ]
};
