// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  ssr: false,
  devtools: { enabled: true },
  modules: ['@nuxt/icon', '@nuxt/ui', '@nuxtjs/supabase', '@vueuse/nuxt', 'nuxt-charts'],
  css: ['~/assets/css/main.css'],
  app: {
    baseURL: '/books-app/',
  },
  icon: {
    clientBundle: {
      icons: [
        'lucide:book-open', 'lucide:chevron-down', 'lucide:house', 'lucide:settings', 'lucide:shield-user', 'lucide:shopping-cart', 'lucide:users', 'lucide:image-plus',
        'lucide:ellipsis-vertical', 'lucide:chevrons-left', 'lucide:chevron-right', 'lucide:file-text', 'lucide:swatch-book', 'lucide:cog', 'lucide:chevron-up', 'lucide:x',
        'lucide:user', 'lucide:log-out', 'lucide:search', 'lucide:notebook-pen', 'lucide:chevron-left', 'lucide:chevrons-right', 'lucide:building-2', 'lucide:calendar-cog',
        'lucide:badge-check', 'lucide:notebook-text', 'lucide:trash-2', 'lucide:handshake', 'lucide:clipboard-pen-line', 'lucide:check-check', 'lucide:list', 'lucide:cog',
        'lucide:bell', 'lucide:book-heart', 'lucide:arrow-left', 'lucide:arrow-right', 'lucide:arrow-up-from-line', 'lucide:circle-x', 'lucide:audio-lines', 'lucide:send-horizontal',
        'lucide:log-in', 'lucide:book-plus', 'lucide:book-check', 'lucide:book-x', 'lucide:book-lock', 'lucide:book-up', 'lucide:book-minus', 'lucide:book-heart',
        'lucide:chart-no-axes-combined', 'lucide:qr-code', 'lucide:refresh-ccw', 'lucide:star'
      ]
    }
  },
  supabase: {
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_KEY,
    redirectOptions: {
      login: '/login',
      callback: '/login',
      exclude: ['/signup', '/', '/book/**', '/explore/**'],
    }
  },
  runtimeConfig: {
    public: {
      appUrl: process.env.APP_URL || 'https://cuongdinhngo.github.io'
    }
  },
})