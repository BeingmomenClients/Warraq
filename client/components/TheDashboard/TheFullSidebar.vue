<template>
  <aside
    class="sidebar dark:bg-gray-900 bg-white shadow-ms ps-3 max-[1024px]:fixed"
    :class="[
      sidebar ? 'lg:w-64' : 'lg:w-20',
      useDir() === 'ltr'
        ? 'max-[1024px]:-translate-x-[16rem]'
        : 'max-[1024px]:translate-x-[16rem]',
    ]"
  >
    <div class="flex items-center cursor-pointer pt-2">
      <img :src="logo" width="70" height="70" alt="logo" />
      <NuxtLink
        class="cursor-pointer logo-text whitespace-nowrap"
        :to="localePath('/')"
      >
        <h1 class="font-bold text-3xl cursor-pointer">{{ appName }}</h1>
      </NuxtLink>
    </div>
    <UVerticalNavigation
      @click="$emit('closeSidebar')"
      :links="sidebarList"
      :ui="{
        wrapper: 'space-y-2 menu-list py-5 pe-2',
        base: 'font-bold menu-link  py-2 rounded-lg flex gap-5 group block lg:leading-6 text-[1rem] flex items-center',
        padding: 'px-4',
        rounded: '',
        label: 'capitalize text-xl',
        font: '',
        ring: '',
        active:
          'before:bg-primary-500 text-slate-50 dark:text-slate-450 font-semibold',
        inactive: '',
        icon: {
          base: 'w-7 h-7',
          inactive: '',
          active: 'text-slate-50 dark:text-slate-450',
        },
      }"
    />
  </aside>
</template>

<script setup>
const sidebar = useToggleSidebar();
const localePath = useLocalePath();
const { data } = useAuth();

const { t } = useI18n();

const config = useRuntimeConfig();

const logo = computed(() => config.public.logo);
const appName = computed(() => config.public.appName);

const emit = defineEmits(["closeSidebar"]);

const links = computed(() => [
  {
    label: t("home"),
    icon: "i-heroicons-home",
    to: localePath("/"),
  },
  {
    label: "المسئولين",
    icon: "i-ic-outline-admin-panel-settings",
    to: "/admins",
  },
  {
    label: "المندوبين",
    icon: "i-ic-outline-person-add-alt",
    to: "/representative",
  },
  {
    label: "المكتبات",
    icon: "i-heroicons-building-library",
    to: "/bookstore",
  },
  {
    label: "الكتب",
    icon: "i-heroicons-book-open",
    to: "/books",
  },
]);

const sidebarList = computed(() => {
  if (
    data?.value?.data.data.role === "admin" ||
    data?.value?.data.data.role === "dev"
  ) {
    return [
      {
        label: t("home"),
        icon: "i-heroicons-home",
        to: localePath("/"),
      },
      {
        label: "المسئولين",
        icon: "i-ic-outline-admin-panel-settings",
        to: "/admins",
      },
      {
        label: "المندوبين",
        icon: "i-ic-outline-person-add-alt",
        to: "/representative",
      },
      {
        label: "المكتبات",
        icon: "i-heroicons-building-library",
        to: "/bookstore",
      },
      {
        label: "الكتب",
        icon: "i-heroicons-book-open",
        to: "/books",
      },
      {
        label: "فواتير البيع",
        icon: "i-ic-outline-file-open",
        to: "/purchase-invoices",
      },
    ];
  } else if (data?.value?.data.data.role === "representative") {
    return [
      {
        label: t("home"),
        icon: "i-heroicons-home",
        to: localePath("/"),
      },
      {
        label: "المكتبات",
        icon: "i-heroicons-building-library",
        to: `/bookstore/representative/${data.value.data.data._id}`,
      },
      {
        label: "الكتب",
        icon: "i-heroicons-book-open",
        to: "/all-books",
      },
      {
        label: "فواتير البيع",
        icon: "i-ic-outline-file-open",
        to: `/purchase-invoices/representative/${data.value.data.data._id}`,
      },
    ];
  }
});
</script>

<style lang="scss" scoped>
.sidebar {
  transition: all 0.2s ease-in-out;
  // transform: translate(-250px);
}
</style>


