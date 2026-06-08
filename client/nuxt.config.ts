// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  app: {
    head: {
      title: process.env.BROWSER_TITLE,
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
      meta: [
        {
          name: "description",
          content:
            "ورّاق — نظام إدارة توزيع الكتب بالجملة والمحاسبة: فواتير بيع، تحصيلات، أرصدة المكتبات والمندوبين، ومتابعة الديون.",
        },
        {
          name: "keywords",
          content:
            "وراق, Warraq, توزيع كتب, إدارة مكتبات, ERP كتب, فواتير بيع, تحصيلات, Book Distribution, Bookstore Management",
        },
        { name: "author", content: "Abdelmo’men Elshatory" },
      ],
      htmlAttrs: {
        class: "",
        lang: "ar",
        dir: "rtl",
      },
      script: [],
      link: [
        {
          rel: "icon",
          type: "image/svg",
          href: process.env.LOGO,
        },
        {
          rel: "preconnect",
          href: "https://fonts.googleapis.com",
        },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossorigin: "",
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Zain:wght@300;400;700;800;900&display=swap",
        },
      ],
    },
    pageTransition: { name: "page", mode: "out-in" },
  },

  nitro: {
    compressPublicAssets: true,
    prerender: {
      // TODO: Add this when you want build
      routes: [],
      crawlLinks: false,
    },
  },

  devtools: {
    enabled: true,

    timeline: {
      enabled: true,
    },
  },

  modules: [
    "@nuxtjs/i18n",
    "@vueuse/nuxt",
    "@nuxt/image",
    "@primevue/nuxt-module",
    "@nuxt/ui",
    "@nuxt/eslint",
    "@pinia/nuxt",
    "@sidebase/nuxt-auth",
  ],

  primevue: {
    components: {
      prefix: "Prime",
      include: ["Editor"],
    },
    composables: {
      exclude: "*",
    },
  },

  image: {},

  auth: {
    baseURL: process.env.BASE_URL,
    provider: {
      type: "local",
      endpoints: {
        signIn: { path: "/users/login", method: "post" },
        signOut: { path: "/logout", method: "post" },
        signUp: { path: "/users/signup", method: "post" },
        getSession: { path: "/users/me", method: "get" },
      },
      pages: {
        login: "/login",
      },
      token: {
        signInResponseTokenPointer: "/token",
        maxAgeInSeconds: 18000,
      },
      sessionDataType: {},
    },
  },

  devServer: {
    port: process.env.PORT,
  },

  css: ["~/assets/scss/main.scss"],

  imports: {
    dirs: ["stores", "composables/**"],
  },

  ui: {},

  colorMode: {
    preference: "light",
  },

  i18n: {
    lazy: true,
    langDir: "locales",
    locales: [
      {
        code: "en",
        name: "English",
        file: "en.json",
      },
      {
        code: "ar",
        name: "Arabic",
        file: "ar.json",
      },
    ],
    defaultLocale: "ar",
  },

  // postcss: {
  //   plugins: {
  //     tailwindcss: {},
  //     autoprefixer: {},
  //     cssnano:
  //       process.env.NODE_ENV === "production"
  //         ? { preset: ["default", { discardComments: { removeAll: true } }] }
  //         : false, // disable cssnano when not in production
  //   },
  // },

  runtimeConfig: {
    public: {
      logo: process.env.LOGO,
      appName: process.env.APP_TITLE,
      imagePath: process.env.IMAGE_PATH,
      baseURL: process.env.BASE_URL,
    },
  },

  compatibilityDate: "2024-09-14",
});
