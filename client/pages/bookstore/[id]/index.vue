<template>
  <GenericForm
    :schema="schema"
    :initial-state="initialState"
    create-url="/bookstore"
    update-url="/bookstore"
    redirect-url="/bookstore"
    fetch-url="/bookstore"
  >
    <TheWrapTheInput v-model="initialState.name" label="الاسم" name="name" />
    <TheWrapTheInput
      v-model="initialState.address"
      label="العنوان"
      name="address"
    />
    <TheWrapTheInput v-model="initialState.phone" label="الهاتف" name="phone" />
    <TheWrapTheSearchMenu
      v-model="initialState.representativeIds"
      label="المندوبين"
      name="representativeIds"
      endpoint="/users/representative/all"
      option-attribute="name"
      multiple
    />
  </GenericForm>
</template>

<script setup lang="ts">
import Joi from "joi";

definePageMeta({
  layout: "dashboard",
  middleware: ["auth", "protect"],
});

const schema = Joi.object({
  name: Joi.string().required().messages({
    "string.empty": "الاسم مطلوب",
    "any.required": "الاسم مطلوب",
  }),
  address: Joi.string().required().messages({
    "string.empty": "العنوان مطلوب",
    "any.required": "العنوان مطلوب",
  }),
  phone: Joi.string().messages({
    "string.empty": "الهاتف مطلوب",
    "any.required": "الهاتف مطلوب",
  }),
  representativeIds: Joi.array()
    .items(Joi.string())
    .min(1)
    .max(1)
    .required()
    .messages({
      "array.min": "يجب اختيار مندوب واحد على الأقل",
      "array.max": "يجب اختيار مندوب واحد فقط",
      "array.base": "المندوبين يجب أن يكونوا قائمة",
      "any.required": "المندوبين مطلوبين",
    }),
});

const initialState = reactive({
  name: undefined,
  address: undefined,
  phone: undefined,
  representativeIds: undefined,
});
</script>

<style lang="scss" scoped>
</style>