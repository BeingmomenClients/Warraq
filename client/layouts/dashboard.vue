<template>
  <div
    class="dark:bg-gray-800 bg-slate-200 full-layout min-h-screen flex gap-6"
    :class="[toggleSidebar, positionSidebar]"
  >
    <div class="overlay absolute" @click="closeSidebar"/>

    <TheDashboardTheFullSidebar data-tour="sidebar" @close-sidebar="closeSidebar" />
    <div class="grow">
      <div class="container mx-auto pe-5 ps-5 sm:ps-0">
        <TheDashboardTheNavbar />
        <div data-tour="stats">
          <slot />
        </div>
      </div>
    </div>

    <ClientOnly>
      <TheDemoModeDemoHelpButton v-if="demoMode" />
    </ClientOnly>
  </div>
</template>

<script setup>
const { data } = useAuth();
const { maybeAutoStart } = useTour();
const demoMode = useDemoMode();

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

const userRole = computed(() => data.value?.data?.data?.role);

// watch بدل onMounted عشان الجلسة ممكن تكون لسه بتتحمّل وقت الـ mount،
// ساعتها الدور بيطلع undefined والجولة ماتشتغلش أبداً.
watch(
  userRole,
  (role) => {
    if (demoMode && role) maybeAutoStart(role);
  },
  { immediate: true }
);
</script>

<style lang="scss" scoped>
</style>