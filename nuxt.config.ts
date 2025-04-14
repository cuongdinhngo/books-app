// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },
  modules: ['@nuxt/icon', '@nuxt/ui', '@nuxtjs/supabase', '@vueuse/nuxt'],
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    public: {
      beAppUrl: process.env.BE_APP_URL,
      apiPath: process.env.API_PATH,
      photoPath: process.env.PHOTO_PATH,
    }
  },
})