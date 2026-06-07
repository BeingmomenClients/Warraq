<template>
  <div class="space-y-10">
    <UCard>
      <template #header>
        <div class="flex justify-between">
          <h2
            class="font-semibold text-xl text-slate-900 dark:text-white leading-tight"
          >
            بيانات المكتبة
          </h2>
        </div>
      </template>
      <div class="grid grid-cols-2 gap-10">
        <TheWrapTheStatsCard
          icon="i-heroicons-building-library"
          title="المكتبة"
          :value="bookstoreData.data.data.name"
        />
        <TheWrapTheStatsCard
          icon="i-ic-outline-attach-money"
          title="المبلغ المتبقي عليه"
          :value="bookstoreData.data.data.balance * -1"
        />
      </div>
    </UCard>

    <UCard>
      <template #header>
        <div class="flex justify-between">
          <h2
            class="font-semibold text-xl text-slate-900 dark:text-white leading-tight"
          >
            تحصيل مبلغ من المكتبة
          </h2>
        </div>
      </template>

      <UForm
        :schema="schema"
        :state="initialState"
        class="space-y-4"
        @submit="onSubmit"
      >
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TheWrapTheInput
            v-model="initialState.amount"
            label="المبلغ"
            name="amount"
            type="number"
          />
          <TheWrapTheInput
            v-model="initialState.note"
            label="ملاحظة"
            name="note"
          />
        </div>

        <div class="flex justify-end">
          <UButton
            class="text-xl"
            type="submit"
            size="md"
            :icon="
              useDir() === 'rtl'
                ? 'i-heroicons-arrow-left-20-solid'
                : 'i-heroicons-arrow-right-20-solid'
            "
            color="primary"
            variant="outline"
            :loading="loading"
            :trailing="useDir() === 'rtl'"
            @click="$emit('validate', { ...state })"
          >
            {{ $t("save") }}
          </UButton>
        </div>
      </UForm>
    </UCard>

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
        <template #createdAt-data="{ row }">
          <span>{{ useFormatDate(row.createdAt) }}</span>
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
  </div>
</template>

<script setup lang="ts">
import Joi from "joi";
import type { FormSubmitEvent } from "#ui/types";
definePageMeta({
  layout: "dashboard",
  middleware: ["auth", "protect-representative"],
});

const { request, fetchEvent, data: bookstoreData } = useActionRequest();

const fetchUser = async () => {
  await fetchEvent(`/bookstore/${useRoute().params.bookstore}`);
};

await fetchUser();

const loading = ref(false);
const { t } = useI18n();

const columns = [
  {
    key: "amount",
    label: "المبلغ المدفوع",
    sortable: false,
  },
  {
    key: "createdAt",
    label: "التاريخ",
    sortable: true,
  },
  {
    key: "note",
    label: "ملاحظة",
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
      label: t("delete"),
      icon: "i-heroicons-trash-20-solid",
      click: async () => {
        await deleteRow(row._id, fetchUser);
      },
    },
  ],
  replace: true,
};

const schema = Joi.object({
  amount: Joi.number().required().min(0.01).messages({
    "number.base": "المبلغ يجب أن يكون رقم",
    "number.empty": "المبلغ مطلوب",
    "any.required": "المبلغ مطلوب",
    "number.min": "المبلغ يجب أن يكون أكبر من صفر",
  }),
  note: Joi.string().required().messages({
    "string.empty": "الملاحظة مطلوبة",
    "any.required": "الملاحظة مطلوبة",
  }),
  bookstoreId: Joi.string().allow(null, ""),
});

const initialState = reactive({
  amount: undefined,
  note: undefined,
  bookstoreId: useRoute().params.bookstore,
});

const onSubmit = async (event: FormSubmitEvent<any>) => {
  try {
    loading.value = true;
    const responseData = await request("/collect-bookstore", {
      method: "POST",
      body: event.data,
    });

    if (responseData) {
      await refresh();
      await fetchUser();
      initialState.amount = undefined;
      initialState.note = undefined;
      initialState.bookstoreId = useRoute().params.bookstore;
    }
  } catch (error) {
  } finally {
    loading.value = false;
  }
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
  refresh,
  deleteRow,
} = useTableModule({
  fetchUrl: `/bookstore/${useRoute().params.bookstore}/collect-bookstore`,
  deleteUrl: "/collect-bookstore",
  editUrl: "/collect-bookstore",
  customItems,
});
</script>