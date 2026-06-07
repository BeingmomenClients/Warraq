<template>
  <div>
    <TheDashboardAuthModulesWrapAuth :image="image" :page="$t('signIn')">
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
              <UFormGroup size="lg" name="email">
                <UInput
                  v-model="state.email"
                  icon="i-heroicons-envelope"
                  :placeholder="$t('email')"
                  :ui="{
                    placeholder:
                      'placeholder-gray-400 dark:placeholder-zinc-400',
                  }"
                />
              </UFormGroup>

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

              <UButton to="/forget-password" variant="link">
                هل نسيت كلمة المرور ؟
              </UButton>

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
                  {{ $t("signIn") }}
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

          <TheDemoModeDemoCredentialsCards :loading="loading" @select="handleDemoSelect" />
        </div>
      </template>
    </TheDashboardAuthModulesWrapAuth>
  </div>
</template>

<script lang="ts" setup>
import Joi from "joi";
import type { FormSubmitEvent } from "#ui/types";
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
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: false,
    })
    .required()
    .messages({
      "string.empty": "البريد الإلكتروني مطلوب",
      "string.email": "يرجى إدخال بريد إلكتروني صحيح",
      "any.required": "البريد الإلكتروني مطلوب",
    }),
  password: Joi.string().required().messages({
    "string.empty": "كلمة المرور مطلوبة",
    "any.required": "كلمة المرور مطلوبة",
  }),
});

const state = reactive({
  email: undefined,
  password: undefined,
});

const clearForm = () => {
  form.value?.clear();

  state.email = undefined;
  state.password = undefined;
};

const login = async (event: FormSubmitEvent<any>) => {
  try {
    loading.value = await true;
    const data = await signIn(
      { ...event.data },
      { callbackUrl: "/" } // Where the user will be redirected after a successful login
    );

    loading.value = await false;
  } catch (error) {
    loading.value = await false;
    const errors = error.response._data.errors.error;

    console.warn("errors", errors);

    errors.forEach((error: any) => {
      toast.add({ title: error, timeout: 4000, color: "red" });
    });
  }
};

const handleDemoSelect = async (account: { email: string; password: string }) => {
  state.email = account.email;
  state.password = account.password;
  try {
    loading.value = true;
    await signIn({ email: account.email, password: account.password }, { callbackUrl: '/' });
  } catch (error: any) {
    loading.value = false;
    toast.add({ title: 'تعذّر الدخول التجريبي', color: 'red', timeout: 4000 });
  }
};

const colorMode = useColorMode();

const image = computed(() => {
  if (colorMode.value === "dark") {
    return "/rxmz67rtfvtkoj0ntd0r.png";
  }
  return "/uovnkzciloe7yc8trexb.png";
});
</script>

<style lang="scss" scoped>
</style>