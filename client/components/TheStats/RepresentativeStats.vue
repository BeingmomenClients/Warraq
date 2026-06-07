<template>
  <div class="space-y-10">
    <UCard>
      <template #header>
        <div class="flex justify-between">
          <h2
            class="font-semibold text-xl text-slate-900 dark:text-white leading-tight"
          >
            بيانات المندوب
          </h2>
        </div>
      </template>

      <div class="grid grid-cols-2 gap-10">
        <TheWrapTheStatsCard
          icon="i-ic-round-numbers"
          title="الاسم"
          :value="data?.data.representative.name"
        />

        <TheWrapTheStatsCard
          icon="i-ic-round-numbers"
          title="إجمالي الدين"
          :value="data?.data.representative.balance * -1"
        />
      </div>
    </UCard>
    <UCard>
      <template #header>
        <div class="flex justify-between">
          <h2
            class="font-semibold text-xl text-slate-900 dark:text-white leading-tight"
          >
            الإحصائيات المالية للمكتبات
          </h2>
        </div>
      </template>

      <div class="grid grid-cols-3 gap-10">
        <TheWrapTheStatsCard
          icon="i-ic-round-numbers"
          title="إجمالي المبيعات"
          :value="data?.data.totalSales"
        />

        <TheWrapTheStatsCard
          icon="i-ic-round-numbers"
          title="إجمالي الديون المستحقة"
          :value="data?.data.bookstoreStats.totalAmountToCollect"
        />

        <TheWrapTheStatsCard
          icon="i-ic-round-numbers"
          title="إجمالي المبالغ المحصلة"
          :value="
            data?.data.totalSales -
            data?.data.bookstoreStats.totalAmountToCollect
          "
        />
      </div>
    </UCard>

    <UCard>
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

    <UCard>
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
          v-for="(book, index) in data?.data.managedBookstores"
          :key="index"
          :icon="`i-tabler-circle-number-${index + 1}`"
          :title="book.name"
          :value="book.booksCount"
        />
      </div>
    </UCard>
  </div>
</template>

<script setup>
const { data: user } = useAuth();

const { fetchEvent, data } = useActionRequest();
await fetchEvent(`/statistics/${user.value?.data.data._id}`);
</script>

<style lang="scss" scoped>
</style>