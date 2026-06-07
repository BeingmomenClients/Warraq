<template>
  <UFormGroup
    :size="size"
    :label="label"
    :name="name"
    :hint="hint"
    :error="errorMessage"
  >
    <USelectMenu
      :key="name"
      :placeholder="$t('select')"
      :variant="variant"
      :size="inputSize"
      :options="list"
      v-model="value"
      :option-attribute="optionAttribute"
      :value-attribute="valueAttribute"
      @change="$emit('input')"
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
  </UFormGroup>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: [String, Number, Object],
  },
  list: {
    type: Array,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  optionAttribute: {
    type: String,
    default: "name",
  },
  valueAttribute: {
    type: String,
    default: "_id",
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

const emit = defineEmits(["update:modelValue", "input"]);

const value = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit("update:modelValue", value);
  },
});
</script>

<style lang="scss">
</style>
