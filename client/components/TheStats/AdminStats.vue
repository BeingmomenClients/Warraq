<template>
  <div class="space-y-10">
    <UCard v-if="false">
      <template #header>
        <div class="flex justify-between">
          <h2
            class="font-semibold text-3xl text-slate-900 dark:text-white leading-tight"
          >
            فلتر الإحصائيات
          </h2>
        </div>
      </template>

      <UForm
        id="filter"
        :state="state"
        class="grid grid-cols-2 gap-10"
        @submit="onSubmit"
      >
        <TheWrapTheDatePicker
          v-model="state.dateFrom"
          label="تاريخ من"
          name="title"
        />
        <TheWrapTheDatePicker
          v-model="state.dateTo"
          label="تاريخ إلى"
          name="title"
        />
      </UForm>

      <div class="mt-10 flex justify-end">
        <UButton
          type="submit"
          form="filter"
          class="text-2xl px-5"
          :loading="loading"
          variant="solid"
        >
          بحث
        </UButton>
      </div>
    </UCard>
    <UCard>
      <template #header>
        <div class="flex justify-between">
          <h2
            class="font-semibold text-3xl text-slate-900 dark:text-white leading-tight"
          >
            الإحصائيات المالية
          </h2>
        </div>
      </template>

      <div class="grid grid-cols-3 gap-10">
        <TheWrapTheStatsCard
          icon="i-ic-round-numbers"
          title="إجمالي المبلغ المحصل"
          :value="formatValue(data?.data.totalCollected)"
        />
        <TheWrapTheStatsCard
          icon="i-ic-round-numbers"
          title="إجمالي ديون المناديب"
          :value="
            formatValue(data?.data.totalSales - data?.data.totalCollected)
          "
        />
        <TheWrapTheStatsCard
          icon="i-ic-round-numbers"
          title="إجمالي ديون المكاتب"
          :value="formatValue(data?.data.totalBookstoreBalance * -1)"
        />
        <TheWrapTheStatsCard
          icon="i-ic-round-numbers"
          title="الايراد الإجمالي"
          :value="formatValue(data?.data.totalSales)"
        />
        <TheWrapTheStatsCard
          icon="i-ic-round-numbers"
          title="المكسب الصافي"
          :value="formatValue(data?.data.totalSales - data?.data.totalCost)"
        />

        <!-- <TheWrapTheStatsCard
          icon="i-ic-round-numbers"
          title="إجمالي الديون المستحقة"
          :value="data?.data.totalAmountToCollect"
        />

        <TheWrapTheStatsCard
          icon="i-ic-round-numbers"
          title="إجمالي المبالغ المحصلة"
          :value="data?.data.totalSales - data?.data.totalAmountToCollect"
        /> -->
      </div>
    </UCard>
    <UCard v-if="false">
      <template #header>
        <div class="flex justify-between">
          <h2
            class="font-semibold text-xl text-slate-900 dark:text-white leading-tight"
          >
            الإحصائيات العامة
          </h2>
        </div>
      </template>

      <div class="grid grid-cols-4 gap-10">
        <TheWrapTheStatsCard
          icon="i-ic-round-numbers"
          title="إجمالي فواتير البيع"
          :value="data?.data.totalInvoices"
        />
        <TheWrapTheStatsCard
          icon="i-ic-round-numbers"
          title="إجمالي المكتبات"
          :value="data?.data.totalBookstores"
        />
        <TheWrapTheStatsCard
          icon="i-ic-round-numbers"
          title="إجمالي الكتب"
          :value="data?.data.totalBooks"
        />
        <TheWrapTheStatsCard
          icon="i-ic-round-numbers"
          title="إجمالي المندوبين"
          :value="data?.data.totalRepresentatives"
        />
      </div>
    </UCard>

    <UCard v-if="false">
      <template #header>
        <div class="flex justify-between">
          <h2
            class="font-semibold text-xl text-slate-900 dark:text-white leading-tight"
          >
            الكتب الأكثر مبيعاً
          </h2>
        </div>
      </template>

      <div class="grid grid-cols-3 gap-10">
        <TheWrapTheStatsCard
          v-for="(book, index) in data?.data.topSellingBooks"
          :key="book._id"
          :icon="`i-tabler-circle-number-${index + 1}`"
          :title="book.title"
          :value="book.totalSold"
        />
      </div>
    </UCard>

    <UCard v-if="false">
      <template #header>
        <div class="flex justify-between">
          <h2
            class="font-semibold text-xl text-slate-900 dark:text-white leading-tight"
          >
            المكتبات الأكثر مبيعاً
          </h2>
        </div>
      </template>

      <div class="grid grid-cols-3 gap-10">
        <TheWrapTheStatsCard
          v-for="(book, index) in data?.data.topBookstores"
          :key="index"
          :icon="`i-tabler-circle-number-${index + 1}`"
          :title="book.name"
          :value="book.booksCount"
        />
      </div>
    </UCard>

    <UCard v-if="false">
      <template #header>
        <div class="flex justify-between">
          <h2
            class="font-semibold text-xl text-slate-900 dark:text-white leading-tight"
          >
            المندوبين الأكثر مبيعاً
          </h2>
        </div>
      </template>

      <div class="grid grid-cols-3 gap-10">
        <TheWrapTheStatsCard
          v-for="(book, index) in data?.data.topRepresentatives"
          :key="index"
          :icon="`i-tabler-circle-number-${index + 1}`"
          :title="book.name"
          :value="book.totalSales"
        />
      </div>
    </UCard>
  </div>
</template>

<script setup>
const { fetchEvent, data } = useActionRequest();
await fetchEvent(`/statistics`);

const { formatValue } = useToLocaleString();

const state = reactive({
  dateFrom: undefined,
  dateTo: undefined,
});

const loading = ref(false);

async function onSubmit(event) {
  // Do something with event.data

  loading.value = true;

  await fetchEvent(`/statistics`, {
    dateFrom: event.data.dateFrom,
    dateTo: event.data.dateTo,
  });

  loading.value = false;

  console.log(event.data);
}
</script>

<style lang="scss" scoped>
</style>