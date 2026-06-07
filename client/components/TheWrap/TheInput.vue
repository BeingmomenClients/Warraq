<template>
  <UFormGroup
    :size="size"
    :label="label"
    :name="name"
    :hint="hint"
    :error="errorMessage"
  >
    <UInput
      :disabled="disabled"
      :variant="variant"
      :size="inputSize"
      :type="type"
      v-model="value"
    />

    <template v-if="hintLink" #hint>
      <UButton :to="hintLinkPath" variant="link" target="_blank">
        {{ hintLinkText }}
      </UButton>
    </template>
    <template v-else-if="hint" #hint>
      <UButton variant="link" target="_blank">
        {{ hint }}
      </UButton>
    </template>
    <template v-else #hint>
      <UButton variant="link" target="_blank" class="h-8"> </UButton>
    </template>

    <template v-if="!!errorMessage" #error="{}">
      <span>{{ errorMessage }}</span>
    </template>
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
    required: false,
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
  hint: {
    type: String,
    default: "",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  hintLink: {
    type: Boolean,
    default: false,
  },
  hintLinkText: {
    type: String,
  },
  hintLinkPath: {
    type: String,
  },
  errorMessage: {
    type: String,
  },
});

const emit = defineEmits(["update:modelValue"]);

const value = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit("update:modelValue", value);
  },
});
</script>

<style lang="scss" scoped>
</style>
