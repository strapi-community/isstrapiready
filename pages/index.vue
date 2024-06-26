<template>
  <div class="flex flex-col">
    <TheHeader :versions="version.attributes.latest" />

    <section class="container px-6 mt-10 sm:px-8 md:px-10 xl:px-32">
      <ReleaseAlert
        v-if="version.attributes.isReleased"
        :name="version.attributes.name"
        :link="version.attributes.announce"
        class="mb-10"
      />
      <h2 class="mb-3 text-3xl font-bold">Overview</h2>
      <div
        class="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-6 justify-items-center"
      >
        <AdvancementCard
          v-for="{ id, attributes } in advancements.data"
          :key="id"
          :percent="attributes.percent"
          :type="attributes.type"
          :title="attributes.title"
          class="w-full md:max-w-sm"
        />
        <AdvancementCard
          :percent="pluginAdvancement"
          type="plugins"
          title="Listed Plugins"
          class="w-full md:max-w-sm"
        />
      </div>
    </section>

    <section class="container px-6 sm:px-8 md:px-10 xl:px-32 mt-14">
      <div class="flex">
        <h2 class="text-3xl font-bold">Plugins & Providers</h2>
      </div>
      <div class="mb-5">
        <!-- search -->
        <div class="flex flex-col md:flex-row">
          <div class="relative h-10 my-3 rounded text-blueGray-600">
            <input
              id="search"
              v-model="search"
              type="text"
              name="search"
              class="w-full h-10 py-1 pl-4 pr-8 text-sm placeholder-gray-600 transition-colors rounded  dark:bg-purple-900 dark:text-white dark:placeholder-white outline-search search-shadow md:w-60"
              placeholder="Search"
            />

            <div class="absolute inset-y-0 right-0 flex items-center pr-3">
              <CloseIcon
                v-show="search.length > 0"
                @click.native="search = ''"
                class="w-4 h-4 cursor-pointer dark:text-white"
              />
              <SearchIcon
                v-show="search.length === 0"
                class="w-4 h-4 pointer-events-none dark:text-white"
              />
            </div>
          </div>

          <!-- filter -->
          <div class="flex flex-wrap justify-between w-full">
            <div class="flex flex-col sm:flex-row sm:space-x-2 md:ml-4">
              <!-- status -->
              <div class="relative my-auto cursor-pointer group">
                <button
                  @click="
                    visible.filter.status = !visible.filter.status;
                    visible.sort = false;
                    visible.filter.types = false;
                  "
                  class="
                    hover:bg-gray-100
                    transition-colors
                    flex
                    px-3
                    py-2.5
                    text-sm
                    bg-white
                    dark:bg-purple-900 dark:text-white
                    rounded
                    text-blueGray-500
                    search-shadow
                    w-max
                  "
                >
                  Status
                  <ChevronIcon
                    :class="{
                      'text-blueGray-500 dark:text-purple-400':
                        visible.filter.status,
                      'text-green-300': !visible.filter.status,
                    }"
                    class="w-5 h-5 my-auto ml-2 transition-colors rotate-180 fill-current stroke-current "
                  />
                </button>
                <transition name="fade">
                  <ul
                    v-if="visible.filter.status"
                    role="listbox"
                    class="absolute left-0 z-10 p-2 text-sm bg-white rounded shadow-md  dark:bg-purple-900 top-12 whitespace-nowrap"
                  >
                    <li
                      role="option"
                      class="
                        flex
                        px-2
                        py-2
                        dark:hover:bg-purple-600 dark:hover:text-white
                        cursor-pointer
                        hover:bg-[#f5f8ff]
                        rounded
                      "
                      v-for="filter in STATUS"
                      :key="filter.name"
                      @click="setFilter(filter)"
                    >
                      <input
                        class="my-auto filter-checkbox"
                        type="checkbox"
                        name="type"
                        :checked="filterStatusBy.indexOf(filter) !== -1"
                      />
                      <label
                        :class="`px-2 py-1 text-xs cursor-pointer font-semibold uppercase transition-colors tracking-widest rounded ${filterColor(
                          filter.value
                        )} `"
                      >
                        {{ filter.name }}
                      </label>
                    </li>
                  </ul>
                </transition>
              </div>

              <!-- types -->
              <div
                class="relative w-full my-auto mt-2 cursor-pointer  group sm:mt-auto"
              >
                <button
                  @click="
                    visible.filter.types = !visible.filter.types;
                    visible.sort = false;
                    visible.filter.status = false;
                  "
                  class="
                    hover:bg-gray-100
                    transition-colors
                    flex
                    px-3
                    py-2.5
                    text-sm
                    bg-white
                    dark:bg-purple-900 dark:text-white
                    rounded
                    text-blueGray-500
                    search-shadow
                    w-max
                  "
                >
                  Types
                  <span class="truncate md:max-w-[2rem] lg:max-w-none">
                    : {{ filterTypesBy.name }}
                  </span>
                  <ChevronIcon
                    :class="{
                      'text-blueGray-500 dark:text-purple-400':
                        visible.filter.types,
                      'text-green-300': !visible.filter.types,
                    }"
                    class="w-5 h-5 my-auto ml-2 transition-colors rotate-180 fill-current stroke-current "
                  />
                </button>
                <transition name="fade">
                  <ul
                    v-if="visible.filter.types"
                    role="listbox"
                    class="absolute left-0 z-10 p-2 text-sm bg-white rounded shadow-md  dark:bg-purple-900 top-12 whitespace-nowrap"
                  >
                    <li
                      v-for="type in TYPES"
                      :key="type.name"
                      @click="setFilterTypesBy(type)"
                      role="option"
                      class="
                        px-6
                        py-2
                        transition-colors
                        cursor-pointer
                        dark:hover:bg-purple-600 dark:hover:text-white
                        hover:bg-[#f5f8ff] hover:text-blueGray-500
                        rounded
                      "
                      :class="{
                        'bg-[#f5f8ff] dark:bg-purple-600':
                          type.name === filterTypesBy.name,
                      }"
                    >
                      {{ type.name }}
                    </li>
                  </ul>
                </transition>
              </div>
            </div>

            <!-- sort -->
            <div
              class="relative justify-end order-2 inline-block ml-auto text-sm cursor-pointer  md:my-auto"
            >
              <button
                @click="
                  visible.sort = !visible.sort;
                  visible.filter.status = false;
                  visible.filter.types = false;
                "
                @blur="visible.sort = false"
                class="
                  hover:bg-gray-100
                  flex
                  px-3
                  py-2.5
                  transition-colors
                  bg-white
                  dark:bg-purple-900 dark:text-white
                  rounded
                  text-blueGray-500
                  search-shadow
                  group-hover:text-purple-500
                  w-max
                "
              >
                Sort by: {{ sortBy.name }}
                <ChevronIcon
                  :class="{
                    'text-blueGray-500 dark:text-purple-400': visible.sort,
                    'text-green-300': !visible.sort,
                  }"
                  class="w-5 h-5 my-auto ml-2 transition-colors rotate-180 fill-current stroke-current "
                />
              </button>
              <transition name="fade">
                <ul
                  v-if="visible.sort"
                  role="listbox"
                  class="absolute left-0 right-0 z-10 p-2 text-gray-700 bg-white rounded shadow-md  dark:bg-purple-900 dark:text-white top-12 whitespace-nowrap"
                >
                  <li
                    v-for="sort in SORTS"
                    :key="sort.name"
                    @click="setSortBy(sort)"
                    role="option"
                    class="
                      px-6
                      py-2
                      transition-colors
                      cursor-pointer
                      dark:hover:bg-purple-600 dark:hover:text-white
                      hover:bg-[#f5f8ff] hover:text-blueGray-500
                      rounded
                    "
                    :class="{
                      'bg-[#f5f8ff] dark:bg-purple-600':
                        sort.name === sortBy.name,
                    }"
                  >
                    {{ sort.name }}
                  </li>
                </ul>
              </transition>
            </div>
          </div>
        </div>

        <!-- filter list -->
        <div class="flex mt-2 mb-5 text-sm md:text-base">
          <div class="contents" v-if="filterStatusBy.length > 0">
            <p class="flex-none mt-2 mb-auto sm:my-auto sm:mt-auto">
              {{ filterStatusBy.length }}
              {{ filterStatusBy.length > 1 ? "filters" : "filter" }}
            </p>
            <span
              class="
                h-5
                mx-4
                mb-auto
                mt-2
                sm:my-auto sm:mt-auto
                border-l-[1px] border-solid border-blueGray-400
              "
            />
          </div>

          <div class="flex flex-wrap space-x-2 gap-y-2">
            <p
              v-for="(filter, index) in filterStatusBy"
              :key="filter.name"
              :class="`flex p-2 my-auto font-semibold uppercase transition-colors text-xs tracking-widest rounded ${filterColor(
                filter.value
              )} `"
            >
              {{ filter.name }}
              <CloseIcon
                class="w-3 h-3 my-auto ml-2 text-gray-700 cursor-pointer"
                @click.native="filterStatusBy.splice(index, 1)"
              />
            </p>
          </div>
        </div>
      </div>
      <div class="grid gap-y-4 md:grid-cols-2 md:gap-x-4 lg:grid-cols-3">
        <RequestPlugin />
        <PluginCard
          v-for="{ id, attributes } in filteredPlugins"
          :key="id"
          :name="attributes.name"
          :author="attributes.author"
          :link="attributes.link"
          :status="attributes.status"
        />
      </div>
    </section>
    <TheFooter />
  </div>
</template>

<script>
import axios from "axios";
import _ from "lodash";
import data from '../data.json';
const STATUS = [
  {
    name: "unknown",
    key: "status",
    value: "unknown",
  },
  {
    name: "wip",
    key: "status",
    value: "wip",
  },
  {
    name: "ready",
    key: "status",
    value: "ready",
  },
  {
    name: "unsupported",
    key: "status",
    value: "unsupported",
  },
];

const TYPES = [
  {
    name: "All",
    key: "isProvider",
    value: null,
  },
  {
    name: "Plugins",
    key: "isProvider",
    value: false,
  },
  {
    name: "Providers",
    key: "isProvider",
    value: true,
  },
];

const SORTS = [
  {
    name: "Most recent",
    order: "desc",
    key: "attributes.publishedAt",
  },
  {
    name: "A - Z",
    order: "asc",
    key: "attributes.name",
  },
  {
    name: "Z - A",
    order: "desc",
    key: "attributes.name",
  },
];
export default {
  async asyncData({ payload, app }) {
    if (payload) return { ...payload };
    else {
      return data;
    }
  },
  data() {
    return {
      search: "",
      SORTS,
      sortBy: SORTS[0],
      STATUS,
      filterStatusBy: [],
      TYPES,
      filterTypesBy: TYPES[0],
      visible: {
        filter: {
          status: false,
          types: false,
        },
        sort: false,
      },
    };
  },
  head() {
    const title = "Is Strapi 5 Ready?";
    const description =
      "Discover the advancement of Strapi 5 and the list of compatible plugins!";

    return {
      title,
      meta: [
        { hid: "description", name: "description", content: description },
        { hid: "og:site_name", property: "og:site_name", content: title },
        {
          hid: "og:description",
          property: "og:description",
          content: description,
        },
        // Twitter Card
        { hid: "twitter:title", name: "twitter:title", content: title },
        {
          hid: "twitter:description",
          name: "twitter:description",
          content: description,
        },
        { hid: "twitter:image:alt", name: "twitter:image:alt", content: title },
      ],
    };
  },
  computed: {
    filteredPlugins() {
      // filter (NAME OR AUTHOR) AND (NO FILTER OR PLUGIN IN FILTER)
      let plugins = this.plugins.data.filter(
        (plugin) =>
          (plugin.attributes.name.includes(this.search.toLowerCase()) ||
            plugin.attributes.author
              .toLowerCase()
              .includes(this.search.toLowerCase())) &&
          (this.filterStatusBy.length === 0 ||
            this.filterStatusBy.some(
              (filter) => filter.value === plugin.attributes[filter.key]
            )) &&
          (this.filterTypesBy.value === null ||
            plugin.attributes.isProvider === this.filterTypesBy.value)
      );
      plugins = _.orderBy(plugins, [this.sortBy.key], [this.sortBy.order]);
      return plugins;
    },
    pluginAdvancement() {
      const count = this.plugins.data.reduce(
        (count, plugin) =>
          plugin.attributes.status === "ready" ? ++count : count,
        0
      );

      return Math.round(
        (count / this.plugins.meta.pagination.total || 0) * 100
      );
    },
  },
  methods: {
    filterColor(value) {
      switch (value) {
        case "unknown":
          return "bg-gray-200 text-gray-700";
        case "wip":
          return "bg-orange-100 text-orange-500";
        case "ready":
          return "text-green-500 bg-green-100";
        case "unsupported":
          return "text-red-500 bg-red-100";
      }
    },
    setFilter(filter) {
      if (this.filterStatusBy.includes(filter)) {
        const index = this.filterStatusBy.indexOf(filter);
        this.filterStatusBy.splice(index, 1);
      } else {
        this.filterStatusBy.push(filter);
      }
    },
    setSortBy(sort) {
      this.sortBy = sort;
      this.$nextTick(() => {
        this.visible.sort = false;
      });
    },
    setFilterTypesBy(type) {
      this.filterTypesBy = type;
      this.$nextTick(() => {
        this.visible.filter.types = false;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.outline-search {
  outline-color: #1d1b84 !important;
}

.fade-enter-active,
.fade-leave-active {
  @apply transition-opacity;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.search-shadow {
  box-shadow: 0px 1px 4px rgba(26, 26, 67, 0.1);
}
.dark .filter {
  &-checkbox {
    &:checked {
      background-color: #ad78ff;
    }
  }
}

.filter {
  &-checkbox {
    @apply w-[18px] h-[18px] border border-gray-400 rounded-md appearance-none cursor-pointer my-auto mr-3;
    &:checked {
      background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M5.707 7.293a1 1 0 0 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0l4-4a1 1 0 0 0-1.414-1.414L7 8.586 5.707 7.293z'/%3e%3c/svg%3e");
      border-color: transparent;
      background-color: #1d1b84;
      background-size: 100% 100%;
      background-position: 50%;
      background-repeat: no-repeat;
    }
    &-label {
      @apply text-sm font-light cursor-pointer;
    }
  }
}
</style>
