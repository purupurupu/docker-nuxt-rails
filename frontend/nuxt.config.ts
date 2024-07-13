export default defineNuxtConfig({
  modules: ["@nuxtjs/tailwindcss"],
  // colorMode: {
  //   classSuffix: "",
  // },
  tailwindcss: {
    cssPath: "~/assets/css/tailwind.css",
    configPath: "tailwind.config.js",
  },
});
