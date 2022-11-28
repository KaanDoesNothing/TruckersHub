export default defineNuxtConfig({
  modules: ["@nuxtjs/tailwindcss", "@pinia/nuxt"],
  runtimeConfig: {
    public: {
      CDN: process.env.CDN,
      API: process.env.API,
      SOCKET_API: process.env.SOCKET_API
    }
  }
});
