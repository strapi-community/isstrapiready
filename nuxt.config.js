export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: true,

  server: {
    host: "0.0.0.0",
  },

  // Target: https://go.nuxtjs.dev/config-target
  target: "static",

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: "Is Strapi V4 Ready?",
    htmlAttrs: {
      lang: "en",
    },
    bodyAttrs: {
      class: [
        "bg-gray-50 dark:bg-gray-900 text-gray-500 font-body dark:text-white transition-colors min-h-screen",
      ],
    },
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "" },
      { name: "format-detection", content: "telephone=no" },
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ["~/assets/css/poppins.css", "~/assets/css/main.css"],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: [
    "~/components/templates",
    "~/components/atoms",
    "~/components/atoms/icons",
    "~/components/molecules",
    "~/components/organisms",
  ],

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    "@nuxtjs/color-mode",
    // https://go.nuxtjs.dev/tailwindcss
    "@nuxtjs/tailwindcss",
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [],

  colorMode: {
    preference: "light",
    classSuffix: "",
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},
};
