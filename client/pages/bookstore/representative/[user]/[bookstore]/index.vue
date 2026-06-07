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
          فواتير بيع مكتبة
          <span
            class="before:block before:absolute before:-inset-1 before:-skew-y-3 before:bg-red-500 relative inline-block mx-2"
          >
            <span class="relative text-white">{{ bookstoreName }}</span>
          </span>

          الخاصة ب
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
      <template #paymentStatus-data="{ row }">
        <UButton
          v-if="row.paymentStatus === 'paid'"
          icon="i-heroicons-check"
          size="2xs"
          color="emerald"
          variant="outline"
          :ui="{ rounded: 'rounded-full' }"
          square
        />

        <UButton
          v-else
          icon="i-heroicons-arrow-path"
          size="2xs"
          color="orange"
          variant="outline"
          :ui="{ rounded: 'rounded-full' }"
          square
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
      <div class="flex flex-wrap justify-between items-center">
        <div class="flex flex-wrap justify-between items-center gap-5">
          <div>{{ resultsCount }}</div>
          <div>من</div>
          <div>{{ pageTotal }}</div>
        </div>
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
    key: "serialNumber",
    label: "رقم الفاتورة",
    sortable: true,
  },
  // {
  //   key: "representative.name",
  //   label: "المندوب",
  //   sortable: false,
  // },
  // {
  //   key: "bookstore.name",
  //   label: "المكتبة",
  //   sortable: false,
  // },
  {
    key: "orderBooksCount",
    label: "الكمية المطلوبة",
    sortable: false,
  },
  {
    key: "totalPrice",
    label: "السعر الكلي",
    sortable: false,
  },
  {
    key: "paidAmount",
    label: "المدفوع",
    sortable: false,
  },
  {
    key: "paymentStatus",
    label: "حالة الدفع",
    sortable: false,
  },
];

const bookstoreName = computed(() => {
  return userData.value?.data?.data?.bookstores.find(
    (bookstore: { id: string | string[] }) =>
      bookstore.id === route.params.bookstore
  ).name;
});

const {
  search,
  page,
  pageCount,
  resultsCount,
  data,
  pending,
  pageTotal,
  pageFrom,
  pageTo,
  items,
} = useTableModule({
  fetchUrl: `/purchase-invoices`,
  deleteUrl: "/purchase-invoices",
  editUrl: "/purchase-invoices",
  filters: {
    representativeId: route.params.user,
    bookstoreId: route.params.bookstore,
  },
});
</script>