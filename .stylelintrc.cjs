module.exports = {
  extends: ['stylelint-config-standard'],
  customSyntax: 'postcss-html',
  overrides: [
    {
      files: ['*.vue', '**/*.vue'],
      customSyntax: 'postcss-html',
    },
  ],
  rules: {
    // 允许未知的 @-规则(例如 @tailwind, @apply 等)
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['tailwind', 'apply', 'variants', 'responsive', 'screen', 'layer'],
      },
    ],

    // 允许使用 v-deep 等 Vue 特定的伪类
    'selector-pseudo-element-no-unknown': [
      true,
      {
        ignorePseudoElements: ['v-deep', 'v-slotted', 'v-global'],
      },
    ],
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['deep', 'slotted', 'global'],
      },
    ],

    // 禁用一些可能与 Tailwind 冲突的规则
    'function-no-unknown': [
      true,
      {
        ignoreFunctions: ['theme', 'screen'],
      },
    ],

    // 其他规则
    'no-descending-specificity': null,
    'no-empty-source': null,
  },
}
