<template>
  <div>
    <TheDashboardAuthModulesWrapAuth
      :image="image"
      page="إعادة تعيين كلمة المرور"
      :text="false"
    >
      <template #inputs>
        <div>
          <UForm
            ref="form"
            :schema="schema"
            :state="state"
            class="relative z-10"
            @submit="login"
          >
            <div class="flex flex-col gap-6">
              <UFormGroup size="lg" name="password">
                <UInput
                  v-model="state.password"
                  icon="i-heroicons-lock-closed"
                  type="password"
                  :placeholder="$t('password')"
                  :ui="{
                    placeholder:
                      'placeholder-gray-400 dark:placeholder-zinc-400',
                  }"
                />
              </UFormGroup>
              <UFormGroup size="lg" name="passwordConfirm">
                <UInput
                  v-model="state.passwordConfirm"
                  icon="i-heroicons-lock-closed"
                  type="password"
                  placeholder="تأكيد كلمة المرور"
                  :ui="{
                    placeholder:
                      'placeholder-gray-400 dark:placeholder-zinc-400',
                  }"
                />
              </UFormGroup>

              <div class="grid grid-cols-6 gap-2">
                <UButton
                  variant="solid"
                  trailing
                  class="col-span-5 text-center"
                  block
                  type="submit"
                  :loading="loading"
                  :ui="{
                    rounded: 'rounded-md ',
                  }"
                >
                  {{ $t("send") }}
                </UButton>

                <UButton
                  @click="clearForm"
                  variant="outline"
                  trailing
                  class="col-span-1"
                  :ui="{
                    rounded: 'rounded-md ',
                  }"
                >
                  {{ $t("clear") }}
                </UButton>
              </div>
            </div>
          </UForm>
        </div>
      </template>
    </TheDashboardAuthModulesWrapAuth>
  </div>
</template>

<script lang="ts" setup>
import Joi from "joi";
import type { FormSubmitEvent } from "#ui/types";
const { request } = useActionRequest();
const { params } = useRoute();
const toast = useToast();
const { signIn } = useAuth();
definePageMeta({
  title: "Login",
  layout: "auth",
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: "/", // Where the user should be redirected if not l
  },
});

const form = ref();
const loading = ref(false);

const schema = Joi.object({
  password: Joi.string().required().min(8).messages({
    "string.empty": "كلمة المرور مطلوبة",
    "any.required": "كلمة المرور مطلوبة",
    "string.min": "كلمة المرور يجب أن تكون على الأقل 8 أحرف",
    "string.pattern.base":
      "كلمة المرور يجب أن تحتوي على حروف كبيرة وصغيرة وأرقام ورموز خاصة",
  }),
  passwordConfirm: Joi.string().required().valid(Joi.ref("password")).messages({
    "string.empty": "تأكيد كلمة المرور مطلوب",
    "any.required": "تأكيد كلمة المرور مطلوب",
    "any.only": "كلمة المرور غير متطابقة",
  }),
});

const state = reactive({
  password: undefined,
  passwordConfirm: undefined,
});

const clearForm = () => {
  form.value?.clear();

  state.password = undefined;
  state.passwordConfirm = undefined;
};

const login = async (event: FormSubmitEvent<any>) => {
  try {
    const url = `/users/resetPassword/${params.token}`;

    const data = await request(url, {
      method: "PATCH",
      body: event.data,
    });

    console.warn("data", data);

    if (data.status) {
      navigateTo("/login");
    }
    loading.value = await false;
  } catch (error) {
    loading.value = await false;
  }
};

const colorMode = useColorMode();

const image = computed(() => {
  if (colorMode.value === "dark") {
    return "/reset-dark.png";
  }
  return "/reset-light.png";
});
</script>

<style lang="scss" scoped>
</style>