<template>
  <GenericForm
    :schema="schema"
    :initial-state="initialState"
    create-url="/book"
    update-url="/book"
    redirect-url="/books"
    fetch-url="/book"
  >
    <TheWrapTheInput v-model="initialState.title" label="الاسم" name="title" />
    <TheWrapTheInput
      v-model="initialState.author"
      label="المؤلف"
      name="author"
    />
    <TheWrapTheInput
      v-model="initialState.purchasePrice"
      label="سعر الشراء"
      name="purchasePrice"
      type="number"
    />
    <TheWrapTheInput
      v-model="initialState.price"
      label="سعر البيع"
      name="price"
      type="number"
    />
    <TheWrapTheInput
      v-model="initialState.availableQuantity"
      label="الكمية المتاحة"
      name="availableQuantity"
      type="number"
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
  title: Joi.string().required().messages({
    "string.empty": "الاسم مطلوب",
    "any.required": "الاسم مطلوب",
  }),
  author: Joi.string().required().messages({
    "string.empty": "المؤلف مطلوب",
    "any.required": "المؤلف مطلوب",
  }),
  purchasePrice: Joi.number().required().messages({
    "number.base": "السعر يجب ان يكون رقمًا",
    "number.empty": "سعر الشراء مطلوب",
    "any.required": "سعر الشراء مطلوب",
  }),
  price: Joi.number().required().messages({
    "number.base": "السعر يجب ان يكون رقمًا",
    "number.empty": "سعر البيع مطلوب",
    "any.required": "سعر البيع مطلوب",
  }),
  availableQuantity: Joi.number().messages({
    "number.base": "الكمية المتاحة يجب أن تكون رقمًا",
    "number.empty": "الكمية المتاحة مطلوبة",
    "any.required": "الكمية المتاحة مطلوبة",
  }),
});

const initialState = reactive({
  title: undefined,
  author: undefined,
  purchasePrice: undefined,
  price: undefined,
  availableQuantity: undefined,
});
</script>

<style lang="scss" scoped>
</style>