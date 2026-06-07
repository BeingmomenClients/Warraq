<template>
  <div class="space-y-10">
    <UCard>
      <div class="grid grid-cols-3 gap-10">
        <TheWrapTheStatsCard
          icon="i-hugeicons-signature"
          title="الاسم"
          :value="userData.name"
        />
        <TheWrapTheStatsCard
          icon="i-material-symbols-mail-rounded"
          title="البريد الإلكتروني"
          :value="userData.email"
        />
        <TheWrapTheStatsCard
          icon="i-eos-icons-role-binding"
          title="الدور"
          :value="$t(userData.role)"
        />
      </div>
    </UCard>
    <!-- <UCard>
      <div class="flex justify-evenly">
        <UAvatar size="3xl" :src="fullPath(userData.photo)" alt="Avatar" />
        <TheWrapTheFile name="image" label="Upload Image" v-model="image" />
      </div>
    </UCard> -->

    <UCard>
      <UTabs
        :items="items"
        class="w-full"
        :ui="{
          list: {
            tab: {
              background: '',
              active: 'bg-gray dark:bg-gray-900',
              inactive: 'bg-white dark:bg-gray-800 text-white dark:text-white',
            },
          },
        }"
      >
        <template #account="{ item }">
          <UCard>
            <template #header>
              <p
                class="text-base font-semibold leading-6 text-gray-900 dark:text-white"
              >
                {{ item.label }}
              </p>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                قم بإجراء التغييرات على حسابك هنا. انقر فوق "حفظ" عند الانتهاء.
              </p>
            </template>
            <UForm
              :schema="schema"
              :state="accountForm"
              class="space-y-4"
              @submit="onSubmitAccount"
            >
              <UFormGroup label="الاسم" name="name" class="mb-3">
                <UInput v-model="accountForm.name" />
              </UFormGroup>
              <UFormGroup label="البريد الإلكتروني" name="email">
                <UInput v-model="accountForm.email" />
              </UFormGroup>

              <UButton type="submit" color="black" :loading="loading">
                حفظ التغييرات
              </UButton>
            </UForm>
          </UCard>
        </template>

        <template #password="{ item }">
          <UCard>
            <template #header>
              <h3
                class="text-base font-semibold leading-6 text-gray-900 dark:text-white"
              >
                {{ item.label }}
              </h3>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                قم بتغيير كلمة المرور الخاصة بك هنا. بعد الحفظ، سيتم تسجيل
                خروجك.
              </p>
            </template>

            <UForm
              :schema="passwordSchema"
              :state="passwordForm"
              class="space-y-4"
              @submit="onSubmitPassword"
            >
              <UFormGroup
                label="كلمة المرور الحالية"
                name="passwordCurrent"
                required
                class="mb-3"
              >
                <UInput
                  v-model="passwordForm.passwordCurrent"
                  type="password"
                />
              </UFormGroup>

              <UFormGroup
                label="كلمة المرور الجديدة"
                name="password"
                required
                class="mb-3"
              >
                <UInput v-model="passwordForm.password" type="password" />
              </UFormGroup>
              <UFormGroup
                label="تأكيد كلمة المرور الجديدة"
                name="passwordConfirm"
                required
              >
                <UInput
                  v-model="passwordForm.passwordConfirm"
                  type="password"
                />
              </UFormGroup>

              <UButton type="submit" color="black" :loading="loading">
                حفظ التغييرات
              </UButton>
            </UForm>
          </UCard>
        </template>
      </UTabs>
    </UCard>
  </div>
</template>

<script setup>
import Joi from "joi";
const toast = useToast();
const { request } = useActionRequest();

const { fullPath } = useUserPhoto();

definePageMeta({
  layout: "dashboard",
  middleware: "auth",
});

const { data, getSession, signOut } = useAuth();
const image = ref(null);

const userData = computed(() => {
  return data.value.data.data;
});

watch(
  () => image.value,
  async (newValue, oldValue) => {
    if (newValue) {
      await $fetch("/api/users/updateMe", {
        method: "PATCH",
        body: {
          photo: newValue,
        },
      });
      await getSession();
    }
  }
);

const loading = ref(false);

const items = [
  {
    slot: "account",
    label: "الحساب",
  },
  {
    slot: "password",
    label: "كلمة المرور",
  },
];

const schema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required(),
});

const passwordSchema = Joi.object({
  passwordCurrent: Joi.string().min(8).required().messages({
    "string.empty": "كلمة المرور الحالية مطلوبة",
    "string.min": "يجب أن تتكون كلمة المرور الحالية من {#limit} أحرف على الأقل",
    "string.pattern.base":
      "يجب أن تحتوي كلمة المرور الحالية على حرف كبير وحرف صغير ورقم واحد على الأقل",
    "any.required": "كلمة المرور الحالية مطلوبة",
  }),
  password: Joi.string().min(8).required().messages({
    "string.empty": "كلمة المرور مطلوبة",
    "string.min": "يجب أن تتكون كلمة المرور من {#limit} أحرف على الأقل",
    "string.pattern.base":
      "يجب أن تحتوي كلمة المرور على حرف كبير وحرف صغير ورقم واحد على الأقل",
    "any.required": "كلمة المرور مطلوبة",
  }),
  passwordConfirm: Joi.string().valid(Joi.ref("password")).required().messages({
    "string.empty": "تأكيد كلمة المرور مطلوب",
    "any.only": "كلمة المرور وتأكيد كلمة المرور يجب أن يتطابقا",
    "any.required": "تأكيد كلمة المرور مطلوب",
  }),
});
const accountForm = reactive({
  name: userData.value.name,
  email: userData.value.email,
});

const passwordForm = reactive({
  passwordCurrent: undefined,
  password: undefined,
  passwordConfirm: undefined,
});

async function onSubmitAccount() {
  try {
    loading.value = true;

    const url = "/users/updateMe";

    const { status } = await request(url, {
      method: "PATCH",
      body: accountForm,
    });

    if (status) {
      loading.value = false;
      getSession();
    }
  } catch (error) {
    toast.add({
      title: error.response._data.message,
      timeout: 3000,
      color: "red",
    });
  }
}

async function onSubmitPassword() {
  try {
    loading.value = true;

    const url = "/users/updateMyPassword";

    const { status } = await request(url, {
      method: "PATCH",
      body: passwordForm,
    });

    if (status) {
      loading.value = false;
      signOut({ callbackUrl: "/login" });
    }
  } catch (error) {
    toast.add({
      title: error.response._data.message,
      timeout: 3000,
      color: "red",
    });
  }
}
</script>

<style lang="scss" scoped>
</style>