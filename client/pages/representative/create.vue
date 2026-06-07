<template>
  <GenericForm
    :schema="schema"
    :initial-state="initialState"
    create-url="/users/representative"
    update-url="/users"
    redirect-url="/representative"
    fetch-url="/users"
  >
    <TheWrapTheInput v-model="initialState.name" label="الاسم" name="name" />
    <TheWrapTheInput
      v-model="initialState.email"
      label="البريد الإلكتروني"
      name="email"
    />
    <TheWrapTheInput v-model="initialState.phone" label="الهاتف" name="phone" />
    <TheWrapTheInput
      v-model="initialState.password"
      label="كلمة المرور"
      name="password"
      type="password"
    />
    <TheWrapTheInput
      v-model="initialState.passwordConfirm"
      label="تأكيد كلمة المرور"
      name="passwordConfirm"
      type="password"
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
  password: Joi.string().min(8).required().messages({
    "string.empty": "كلمة المرور مطلوبة",
    "string.min": "يجب أن تحتوي كلمة المرور على الأقل على {#limit} أحرف",
    "string.pattern.base":
      "يجب أن تحتوي كلمة المرور على حرف كبير وحرف صغير ورقم على الأقل",
    "any.required": "كلمة المرور مطلوبة",
  }),
  passwordConfirm: Joi.string().valid(Joi.ref("password")).required().messages({
    "string.empty": "تأكيد كلمة المرور مطلوب",
    "any.only": "يجب أن تتطابق كلمة المرور مع تأكيد كلمة المرور",
    "any.required": "تأكيد كلمة المرور مطلوب",
  }),
});

const initialState = reactive({
  name: undefined,
  email: undefined,
  phone: undefined,
  password: undefined,
  passwordConfirm: undefined,
});
</script>

<style lang="scss" scoped>
</style>