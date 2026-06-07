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
          المكتبات
        </h2>
        <UButton
          type="submit"
          size="lg"
          icon="i-heroicons-plus"
          color="primary"
          variant="outline"
          to="/bookstore/create"
        />
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
            :to="`/representative/${user.id}/purchase-invoices`"
          >
            {{ user.name }}
          </UButton>
        </div>
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
definePageMeta({
  layout: "dashboard",
  middleware: ["auth", "protect"],
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
  {
    key: "representatives",
    label: "المندوب",
    sortable: false,
  },
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
        navigateTo(`/bookstore/${row.id}/purchase-invoices`);
      },
    },
  ],
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
  fetchUrl: "/bookstore",
  deleteUrl: "/bookstore",
  editUrl: "/bookstore",
  customItems,
});
</script>