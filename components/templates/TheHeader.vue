<template>
  <header
    class="container flex flex-col px-6 pt-8  sm:px-8 xl:px-32 xl:pt-14 md:flex-row"
  >
    <div>
      <div class="flex">
        <nuxt-link to="/">
          <h1 class="mr-4 text-3xl font-bold sm:text-4xl lg:text-5xl">
            Is
            <span class="text-purple-500 dark:text-purple-400">Strapi 5</span>
            ready?
          </h1>
        </nuxt-link>
        <span
          class="px-2 py-1 mt-2 mb-auto ml-auto text-xs font-bold text-purple-500 bg-purple-100 rounded  sm:mb-auto sm:mt-auto sm:my-auto whitespace-nowrap"
        >
          v{{ versions }}
        </span>
      </div>
      <h2
        class="mt-3 text-purple-900 transition-colors  sm:text-xl dark:text-gray-100"
      >
        The future of Strapi is almost here
      </h2>
    </div>

    <div class="flex items-center mt-2 space-x-2 md:mt-0 md:ml-auto">
      <a
        class="w-6 h-6 transition-all transform cursor-pointer  hover:scale-110 hover:text-strapi-purple-dark"
        href="https://github.com/strapi-community/isstrapiready"
        target="_blank"
        rel="noopener noreferrer"
      >
        <GithubIcon />
      </a>
      <div
        class="w-8 h-8 transition-all transform cursor-pointer  hover:text-strapi-purple hover:scale-110"
        @click="toggleDark()"
      >
        <template v-if="isDark">
          <MoonIcon class="w-7 h-7" />
        </template>
        <template v-else>
          <SunIcon class="w-8 h-8" />
        </template>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  props: {
    versions: {
      type: String,
      default: "",
    },
  },
  methods: {
    toggleDark() {
      this.$colorMode.preference =
        this.$colorMode.preference === "dark" ? "light" : "dark";
    },
  },
  computed: {
    isDark() {
      return this.$colorMode.preference === "dark";
    },
  },
};
</script>

<style></style>
