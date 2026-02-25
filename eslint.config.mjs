import { createConfigForNuxt } from '@nuxt/eslint-config'

export default createConfigForNuxt().append({
  rules: {
    'vue/html-self-closing': 'off',
  },
})
