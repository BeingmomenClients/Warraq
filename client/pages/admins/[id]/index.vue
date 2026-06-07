<template>
  <GenericForm
    :schema="schema"
    :initial-state="initialState"
    create-url="/users/admin"
    update-url="/users"
    redirect-url="/admins"
    fetch-url="/users"
  >
    <TheWrapTheInput v-model="initialState.name" label="الاسم" name="name" />
    <TheWrapTheInput
      v-model="initialState.email"
      label="البريد الإلكتروني"
      name="email"
    />
    <TheWrapTheInput v-model="initialState.phone" label="الهاتف" name="phone" />
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
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required()
    .messages({
      "string.empty": "البريد الإلكتروني مطلوب",
      "string.email": "يرجى إدخال عنوان بريد إلكتروني صالح",
      "any.required": "البريد الإلكتروني مطلوب",
    }),
  phone: Joi.string().required().messages({
    "string.empty": "الهاتف مطلوب",
    "any.required": "الهاتف مطلوب",
  }),
});

const initialState = reactive({
  name: undefined,
  email: undefined,
  phone: undefined,
});
</script>

<style lang="scss" scoped>
</style>