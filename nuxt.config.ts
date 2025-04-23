// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },
  modules: ['@nuxt/icon', '@nuxt/ui', '@nuxtjs/supabase', '@vueuse/nuxt'],
  css: ['~/assets/css/main.css'],
  app: {
    baseURL: '/books-app/',
  },
  icon: {
    strategy: 'static'
  },
  // icon: {
  //   serverBundle: {
  //     collections: ['lucide']
  //   },
  //   clientBundle: {
  //     icons: [
  //       'lucide:book-open', 'lucide:chevron-down', 'lucide:house', 'lucide:settings', 'lucide:shield-user', 'lucide:shopping-cart', 'lucide:users', 'lucide:image-plus',
  //       'lucide:ellipsis-vertical', 'lucide:chevrons-left', 'lucide:chevron-right', 'lucide:file-text', 'lucide:swatch-book', 'lucide:cog', 'lucide:chevron-up',
  //       'lucide:user', 'lucide:log-out', 'lucide:search', 'lucide:notebook-pen', 'lucide:chevron-left', 'lucide:chevrons-right', 'lucide:building-2'
  //     ]
  //   }
  // },
  nitro: {
    prerender: {
      routes: ['/api/_nuxt_icon/lucide.json']
    }
  },
  supabase: {
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_KEY,
    redirectOptions: {
      login: '/login',
      callback: '/login',
      exclude: ['/signup'],
    }
  },
  runtimeConfig: {
    public: {
      beAppUrl: process.env.BE_APP_URL,
      apiPath: process.env.API_PATH,
      photoPath: process.env.PHOTO_PATH,
    }
  },
})