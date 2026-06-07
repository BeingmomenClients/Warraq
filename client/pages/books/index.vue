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
          الكتب
        </h2>
        <UButton
          type="submit"
          size="lg"
          icon="i-heroicons-plus"
          color="primary"
          variant="outline"
          to="/books/create"
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
      <template #totalProfit-data="{ row }">
        <div>{{ row.totalRevenue - row.totalSales * row.purchasePrice }}</div>
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
    key: "title",
    label: "الاسم",
    sortable: true,
  },
  {
    key: "author",
    label: "المؤلف",
    sortable: false,
  },
  {
    key: "purchasePrice",
    label: "سعر الشراء",
    sortable: false,
  },
  {
    key: "price",
    label: "سعر البيع",
    sortable: false,
  },
  {
    key: "availableQuantity",
    label: "الكمية المتاحة",
    sortable: false,
  },
  {
    key: "totalSales",
    label: "عدد الكتب المباعة",
    sortable: false,
  },
  {
    key: "totalRevenue",
    label: "إجمالي الإيراد",
    sortable: false,
  },
  {
    key: "totalProfit",
    label: "إجمالي الربح",
    sortable: false,
  },
  {
    key: "actions",
    label: "الإجراءات",
    sortable: false,
  },
];

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
  fetchUrl: "/book",
  deleteUrl: "/book",
  editUrl: "/books",
});
</script>