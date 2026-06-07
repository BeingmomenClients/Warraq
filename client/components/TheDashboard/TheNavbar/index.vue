<template>
  <nav
    as="nav"
    class="navbar dark:bg-gray-900 bg-white shadow-ms rounded-bl-lg rounded-br-lg mb-4 py-1 px-4 flex justify-between"
  >
    <UButton
      icon="i-ic-outline-menu"
      size="xl"
      variant="link"
      @click="toggleSidebar"
    />

    <div class="flex gap-4">
      <TheBaseTheDarkMode />
      <TheDashboardTheNavbarUser />
    </div>
  </nav>
</template>

<script setup>
import { useWindowSize } from "@vueuse/core";
const sidebar = useToggleSidebar();
const fixedSidebar = useFixedSidebar();
const { width } = useWindowSize();

const toggleSidebar = () => {
  if (width.value > 1024) {
    sidebar.value = !sidebar.value;
  } else {
    fixedSidebar.value = !fixedSidebar.value;
  }
};

watchEffect(() => {
  if (width.value > 1024) {
    fixedSidebar.value = true;
  }
});
</script>