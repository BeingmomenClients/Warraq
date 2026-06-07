<template>
  <UFormGroup :size="size" :label="label" :name="name">
    <UTextarea
      :variant="variant"
      :size="inputSize"
      :value="modelValue"
      :rows="rows"
      @input="(event) => emit('update:modelValue', event.target.value)"
    />
  </UFormGroup>
</template>

<script setup>
const props = defineProps({
  modelValue: [String, Number],
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
  rows: {
    type: Number,
    default: 7,
  },
});

const emit = defineEmits(["update:modelValue"]);
</script>

<style lang="scss" scoped>
</style>
