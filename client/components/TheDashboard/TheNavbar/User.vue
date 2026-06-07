<template>
  <div>
    <UDropdown
      :items="items"
      :popper="{ placement: 'bottom-start' }"
      :ui="{
        container: 'dark:bg-pro-200 rounded-md ',
        item: {
          base: 'hover:dark:bg-pro-100 hover:bg-zinc-200',
        },
      }"
    >
      <UButton color="white" variant="ghost">
        <template #leading>
          <UAvatar
            :src="fullPath(data?.data.data.photo)"
            chip-color="primary"
            chip-text=""
            chip-position="top-right"
            size="md"
          />
        </template>
      </UButton>
    </UDropdown>
  </div>
</template> 

<script setup>
const { data, signOut } = useAuth();
const localePath = useLocalePath();
const { fullPath } = useUserPhoto();
const { t } = useI18n();

const items = computed(() => [
  [
    {
      label: t("profile"),
      avatar: {
        src: fullPath(data.value?.data.data.photo),
      },
      click: () => {
        navigateTo(localePath("/profile"));
      },
    },
  ],
  [
    {
      label: t("logout"),
      icon: "i-heroicons-arrow-left-on-rectangle",
      click: async () => {
        await signOut({
          callbackUrl: "/login",
          redirect: true,
        });
      },
    },
  ],
]);
</script>

<style lang="scss" scoped>
</style>