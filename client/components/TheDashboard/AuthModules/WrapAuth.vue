<template>
  <div class="flex min-h-screen dark:bg-slate-950">
    <div class="hidden flex-[0_0_66.6666666667%] lg:flex">
      <div class="m-8 flex-1 me-0 bg-slate-100 dark:bg-slate-900 rounded-2xl">
        <div class="h-full flex justify-center items-center">
          <div class="max-w-[441px]">
            <img :src="image" loading="lazy" alt="logo" />
          </div>
        </div>
      </div>
    </div>
    <div class="flex-1 lg:flex-[0_0_33.3333333333%]">
      <div
        class="flex min-h-full flex-1 flex-col justify-center items-center py-12 m-auto max-w-[350px]"
      >
        <div
          class="flex flex-col items-center sm:mx-auto sm:w-full sm:max-w-sm"
        >
          <img :src="logo" width="70" height="70" alt="logo" />

          <h2
            class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight"
          >
            {{ page }} <span v-if="text"> {{ $t("toYourAccount") }} </span>
          </h2>
          <!-- <TheBaseTheDarkMode /> -->
        </div>

        <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <div class="space-y-6">
            <slot name="inputs" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  image: {
    type: String,
    required: true,
  },
  page: {
    type: String,
    required: true,
  },
  text: {
    type: Boolean,
    default: true,
  },
});

const config = useRuntimeConfig();

const logo = computed(() => config.public.logo);
</script>

<style lang="scss">
</style>