<template>
  <div>
    <TheStatsAdminStats v-if="statsComponent === 'TheStatsAdminStats'" />
    <TheStatsRepresentativeStats v-else />
  </div>
</template>

<script setup>
definePageMeta({
  layout: "dashboard",
  middleware: "auth",
});

const { data } = useAuth();

const statsComponent = computed(() => {
  return data.value?.data.data.role === "admin" ||
    data.value?.data.data.role === "dev"
    ? "TheStatsAdminStats"
    : "TheStatsRepresentativeStats";
});
</script>

<style lang="scss" scoped>
</style>