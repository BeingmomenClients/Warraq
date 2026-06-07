<template>
  <div class="space-y-10">
    <UCard>
      <div class="grid grid-cols-4 gap-10">
        <TheWrapTheStatsCard
          icon="i-ic-round-numbers"
          title="رقم الفاتورة"
          :value="data?.data?.data?.serialNumber"
        />
        <TheWrapTheStatsCard
          icon="i-heroicons-calendar-days-16-solid"
          title="تاريخ الفاتورة"
          :value="useFormatDate(data?.data?.data.createdAt)"
        />
        <TheWrapTheStatsCard
          icon="i-ic-outline-person-add-alt"
          title="المندوب"
          :value="data?.data?.data?.representative?.name"
        />
        <TheWrapTheStatsCard
          icon="i-heroicons-building-library"
          title="المكتبة"
          :value="data?.data?.data?.bookstore?.name"
        />

        <TheWrapTheStatsCard
          icon="i-ic-outline-compare-arrows"
          title="حالة البيع"
          :value="$t(data?.data?.data?.paymentType)"
        />
        <TheWrapTheStatsCard
          icon="i-heroicons-numbered-list"
          title="عدد الكتب"
          :value="data?.data?.data?.orderBooksCount"
        />
        <TheWrapTheStatsCard
          icon="i-ic-outline-attach-money"
          title="سعر الفاتورة"
          :value="data?.data?.data?.totalPrice"
        />
        <TheWrapTheStatsCard
          icon="i-ic-outline-paid"
          title="المبلغ المدفوع"
          :value="data?.data?.data?.paidAmount"
        />
        <TheWrapTheStatsCard
          icon="i-ic-outline-payments"
          title="المبلغ المتبقي"
          :value="data?.data?.data?.remainingAmount"
        />
      </div>
    </UCard>
    <UCard>
      <h2 class="text-4xl font-bold mb-10">الكتب</h2>
      <div class="grid grid-cols-2 gap-10">
        <UCard
          v-for="book in data?.data?.data?.bookIds"
          :key="book._id"
          class="ring-1 ring-primary dark:ring-primary bg-gray-100/75 dark:bg-gray-800/75"
        >
          <UIcon name="i-heroicons-book-open" class="w-8 h-8 text-primary" />
          <p class="text-gray-900 dark:text-white font-semibold text-2xl mt-3">
            عنوان الكتاب :
            <span class="text-3xl text-gray-500 dark:text-gray-400">
              {{ book.book[0].title }}
            </span>
          </p>
          <p class="text-gray-900 dark:text-white font-semibold text-2xl mt-3">
            الكمية :
            <span class="text-3xl text-gray-500 dark:text-gray-400">
              {{ book.count }}
            </span>
          </p>
          <p class="text-gray-900 dark:text-white font-semibold text-2xl mt-3">
            سعر الكتاب :
            <span class="text-3xl text-gray-500 dark:text-gray-400">
              {{ book.price }}
            </span>
          </p>
          <p class="text-gray-900 dark:text-white font-semibold text-2xl mt-3">
            الاجمالي :
            <span class="text-3xl text-gray-500 dark:text-gray-400">
              {{ book.price * book.count }}
            </span>
          </p>
        </UCard>
      </div>
    </UCard>
  </div>
</template>

<script setup>
definePageMeta({
  layout: "dashboard",
  middleware: ["auth", "protect"],
});

const route = useRoute();

const { fetchEvent, data } = useActionRequest();

await fetchEvent(`/purchase-invoices/${route.params.id}`);
</script>

<style lang="scss" scoped>
</style>