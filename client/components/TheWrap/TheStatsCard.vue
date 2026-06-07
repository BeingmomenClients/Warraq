<template>
  <div>
    <UCard
      class="ring-1 ring-primary dark:ring-primary bg-gray-100/75 dark:bg-gray-800/75"
    >
      <UIcon :name="icon" class="w-8 h-8 text-primary" />
      <p class="text-gray-900 dark:text-white font-semibold text-2xl mt-3">
        {{ title }}
      </p>
      <p class="text-3xl text-gray-500 dark:text-gray-400 mt-5 mb-0">
        {{ value }}
      </p>
    </UCard>
  </div>
</template>

<script setup>
const props = defineProps({
  icon: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  value: {
    type: [String, Number],
    required: true,
  },
});
</script>

<style lang="scss" scoped>
</style>