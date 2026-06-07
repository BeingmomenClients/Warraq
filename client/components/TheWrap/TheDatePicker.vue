<template>
  <UFormGroup :size="size" :label="label" :name="name">
    <UPopover
      class="ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 rounded-md py-1"
      :popper="{ placement: 'bottom-start' }"
    >
      <UButton
        icon="i-heroicons-calendar-days-20-solid"
        :label="useFormatDate(value)"
      />

      <template #panel="{ close }">
        <DatePicker v-model="value" is-required @close="close" />
      </template>
    </UPopover>
  </UFormGroup>
</template>

<script setup>
const props = defineProps({
  modelValue: [String, Number, Date],
  label: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    default: "xl",
  },
  variant: {
    type: String,
    default: "outline",
  },
  inputSize: {
    type: String,
    default: "lg",
  },
  type: {
    type: String,
    default: "text",
  },
});

const emit = defineEmits(["update:modelValue", "input"]);

const value = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit("update:modelValue", useFormatDate(value));
    emit("input", value);
  },
});
</script>

<style lang="scss" scoped>
</style>
