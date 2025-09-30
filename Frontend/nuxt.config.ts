import tailwindcss from "@tailwindcss/vite";

export default {
  modules: ["@nuxtjs/color-mode", "motion-v/nuxt", "@vueuse/nuxt", "@nuxt/icon", "@nuxt/fonts"],

  imports: {
    imports: [
      {
        from: "tailwind-variants",
        name: "tv",
      },
      {
        from: "tailwind-variants",
        name: "VariantProps",
        type: true,
      },
    ],
  },

  colorMode: {
    storageKey: "Frontend-color-mode",
    classSuffix: "",
  },

  icon: {
    clientBundle: {
      scan: true,
      sizeLimitKb: 0,
    },

    mode: "svg",
    class: "shrink-0",
    fetchTimeout: 2000,
    serverBundle: "local",
  },

  css: ["~/assets/css/tailwind.css"],

  vite: {
    plugins: [tailwindcss()],
  },
};
