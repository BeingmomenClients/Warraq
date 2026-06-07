<template>
  <UCard
    class="w-full"
    :ui="{
      base: '',
      ring: '',
      divide: 'divide-y divide-slate-200 dark:divide-slate-700',
      header: { padding: 'px-4 py-5' },
      body: {
        padding: '',
        base: 'divide-y divide-slate-200 dark:divide-slate-700',
      },
      footer: { padding: 'p-4' },
    }"
  >
    <template #header>
      <div class="flex justify-between">
        <h2
          class="font-semibold text-xl text-slate-900 dark:text-white leading-tight"
        >
          المكتبات الخاصه ب

          <span
            class="before:block before:absolute before:-inset-1 before:-skew-y-3 before:bg-red-500 relative inline-block mx-2"
          >
            <span class="relative text-white">
              {{ userData?.data?.data?.name ?? "Unknown" }}</span
            >
          </span>
        </h2>
      </div>
    </template>

    <div class="flex items-center justify-between gap-3 px-4 py-3">
      <UInput
        v-model="search"
        icon="i-heroicons-magnifying-glass-20-solid"
        :placeholder="`${$t('search')}...`"
        size="lg"
        :ui="{
          placeholder: 'placeholder-text-2xl',
        }"
      />
    </div>

    <UTable
      class="w-full"
      :rows="data?.data || []"
      :columns="columns"
      :loading="pending"
      :sort-button="{
        size: 'xl',
      }"
      :ui="{
        thead: 'dark:bg-gray-950 bg-gray-200',
        td: {
          base: 'whitespace-normal text-xl',
        },
        th: {
          size: 'text-lg',
        },
      }"
    >
      <template #representatives-data="{ row }">
        <div class="grid grid-cols-1">
          <UButton
            v-for="user in row.representatives"
            :key="user._id"
            variant="link"
            to="https://volta.net"
            target="_blank"
          >
            {{ user.name }}
          </UButton>
        </div>
      </template>

      <template #invoices-data="{ row }">
        <UButton
          icon="i-nimbus-invoice"
          size="xl"
          color="primary"
          square
          variant="link"
          :to="`/bookstore/representative/${route.params.user}/${row._id}`"
        />
      </template>

      <template #actions-data="{ row }">
        <UDropdown
          :items="items(row)"
          :ui="{
            container: 'dark:bg-pro-200 rounded-md border',
            item: {
              base: 'hover:dark:bg-pro-100 hover:bg-zinc-200',
            },
          }"
        >
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-ellipsis-horizontal-20-solid"
          />
        </UDropdown>
      </template>
    </UTable>

    <template #footer>
      <div class="flex flex-wrap justify-end items-center">
        <UPagination
          v-model="page"
          :page-count="pageCount"
          :total="pageTotal"
          :ui="{
            wrapper: 'flex items-center gap-1',
            rounded: '!rounded-full min-w-[32px] justify-center',
            default: {
              activeButton: {
                variant: 'outline',
              },
            },
          }"
        />
      </div>
    </template>
  </UCard>
</template>

<script setup lang="ts">
const { data: userData } = useAuth();
const route = useRoute();

definePageMeta({
  layout: "dashboard",
  middleware: ["auth", "protect-representative"],
});

const columns = [
  {
    key: "name",
    label: "الاسم",
    sortable: true,
  },
  {
    key: "address",
    label: "العنوان",
    sortable: false,
  },
  {
    key: "phone",
    label: "الهاتف",
    sortable: false,
  },
  {
    key: "balance",
    label: "الرصيد",
    sortable: false,
  },
  {
    key: "booksCount",
    label: "رصيد الكتب",
    sortable: false,
  },
  // {
  //   key: "invoices",
  //   label: "الفواتير",
  //   sortable: false,
  // },
  {
    key: "actions",
    label: "الإجراءات",
    sortable: false,
  },
];

const customItems = {
  items: (row: any) => [
    {
      label: "فواتير بيع المكتبة",
      icon: "i-ic-outline-playlist-add",
      click: () => {
        navigateTo(
          `/bookstore/representative/${useRoute().params.user}/${row._id}`
        );
      },
    },
    {
      label: "تحصيل مبلغ من المكتبة",
      icon: "i-heroicons-squares-plus",
      click: () => {
        navigateTo(
          `/bookstore/representative/${useRoute().params.user}/${
            row._id
          }/collect-an-amount`
        );
      },
    },
  ],
  replace: true,
};

const {
  search,
  page,
  pageCount,
  data,
  pending,
  pageTotal,
  pageFrom,
  pageTo,
  items,
} = useTableModule({
  fetchUrl: `users/${route.params.user}/bookstore`,
  deleteUrl: "/bookstore",
  editUrl: "/bookstore",
  customItems,
});
</script>