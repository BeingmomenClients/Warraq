<template>
  <div
    class="dark:bg-gray-800 bg-slate-200 full-layout min-h-screen flex gap-6"
    :class="[toggleSidebar, positionSidebar]"
  >
    <div class="overlay absolute" @click="closeSidebar"></div>

    <TheDashboardTheFullSidebar data-tour="sidebar" @closeSidebar="closeSidebar" />
    <div class="grow">
      <div class="container mx-auto pe-5 ps-5 sm:ps-0">
        <TheDashboardTheNavbar />
        <div data-tour="stats">
          <slot />
        </div>
      </div>
    </div>

    <ClientOnly>
      <TheDemoModeDemoHelpButton />
    </ClientOnly>
  </div>
</template>

<script setup>
const { data } = useAuth();
const { maybeAutoStart } = useTour();

const sidebar = useToggleSidebar();
const fixedSidebar = useFixedSidebar();

const closeSidebar = () => {
  fixedSidebar.value = true;
};

const toggleSidebar = computed(() =>
  sidebar.value ? "full-sidebar" : "small-sidebar"
);

const positionSidebar = computed(() =>
  fixedSidebar.value ? "static-sidebar" : "fixed-sidebar"
);

onMounted(() => {
  const role = data.value?.data?.data?.role;
  if (role) maybeAutoStart(role);
});
</script>

<style lang="scss" scoped>
</style>