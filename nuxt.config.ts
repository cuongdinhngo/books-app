// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },
  modules: ['@nuxt/icon', '@nuxt/ui', '@nuxtjs/supabase', '@vueuse/nuxt'],
  css: ['~/assets/css/main.css'],
  app: {
    baseURL: '/books-app/',
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