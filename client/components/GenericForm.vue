<!-- components/GenericForm.vue -->
<template>
  <UCard>
    <!-- :validate="customValidate" -->
    <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
      <slot></slot>

      <div class="flex justify-end">
        <UButton
          class="text-xl"
          type="submit"
          size="md"
          :icon="
            useDir() === 'rtl'
              ? 'i-heroicons-arrow-left-20-solid'
              : 'i-heroicons-arrow-right-20-solid'
          "
          color="primary"
          variant="outline"
          :loading="loading"
          :trailing="useDir() === 'rtl'"
          @click="$emit('validate', { ...state })"
        >
          {{ $t("save") }}
        </UButton>
      </div>
    </UForm>
  </UCard>
</template>

<script setup lang="ts">
import type { FormError } from "#ui/types";

const props = defineProps({
  schema: {
    type: Object,
    required: true,
  },
  initialState: {
    type: Object,
    required: true,
  },
  createUrl: {
    type: String,
    required: true,
  },
  updateUrl: {
    type: String,
    required: true,
  },
  redirectUrl: {
    type: String,
    required: true,
  },
  fetchUrl: {
    type: String,
    default: "",
  },
  customValidate: {
    type: Function as PropType<(state: any) => Promise<FormError<string>[]>>,
    default: () => async () => [],
  },
});

const { state, loading, isEditMode, fetchData, onSubmit } =
  useFormModule(props);

fetchData();

const emit = defineEmits(["validate"]);
</script>