<template>
  <div>
    <TheDashboardAuthModulesWrapAuth
      :image="image"
      :page="$t('forgetPassword')"
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

              <UButton to="/login" variant="link" block>
                {{ $t("signInInstead") }}
              </UButton>
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
const toast = useToast();

const fullUrl = useRequestURL();

const { request } = useActionRequest();
const { signIn } = useAuth();
definePageMeta({
  title: "ForgetPassword",
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
});

const state = reactive({
  email: undefined,
});

const clearForm = () => {
  form.value?.clear();

  state.email = undefined;
};

const login = async (event: FormSubmitEvent<any>) => {
  try {
    loading.value = await true;
    const url = "/users/forgotPassword";

    const data = await request(url, {
      method: "POST",
      body: { ...event.data, redirectUrl: fullUrl.origin },
    });

    loading.value = await false;
  } catch (error) {
    loading.value = await false;
  }
};

const colorMode = useColorMode();

const image = computed(() => {
  if (colorMode.value === "dark") {
    return "/forgot-dark.png";
  }
  return "/forgot-light.png";
});
</script>

<style lang="scss" scoped>
</style>