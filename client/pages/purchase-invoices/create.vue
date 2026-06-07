<template>
  <GenericForm
    :schema="schema"
    :initial-state="initialState"
    create-url="/purchase-invoices"
    update-url="/purchase-invoices"
    :redirect-url="`/purchase-invoices/representative/${userData?.data?.data?._id}`"
    fetch-url="/purchase-invoices"
    @validate="validate"
  >
    <TheWrapTheSelect
      v-model="initialState.bookstoreId"
      label="المكتبات"
      name="bookstoreId"
      :list="bookstoresData"
    />
    <TheWrapTheSelect
      v-model="initialState.paymentType"
      label="نوع الدفع"
      name="paymentType"
      :list="[
        { name: 'نقدي', _id: 'cash' },
        { name: 'آجل', _id: 'credit' },
      ]"
    />
    <TheWrapTheInput
      v-if="initialState.paymentType === 'credit'"
      v-model="initialState.paidAmount"
      label="المبلغ المدفوع"
      name="paidAmount"
    />

    <UCard>
      <div
        v-for="(book, i) in initialState.bookIds"
        :key="book.bookId"
        class="grid grid-cols-5 gap-6 mb-5"
      >
        <TheWrapTheSelect
          v-model="book.bookId"
          label="الكتب"
          name="bookIds"
          option-attribute="title"
          :list="data"
          :error-message="errorsForm[i]?.bookId.message"
          @input="handleBookSelection(i), validate(initialState)"
        />
        <!-- @input="validate(initialState)" -->

        <TheWrapTheInput
          v-model="book.price"
          name="bookIds"
          label="السعر"
          type="number"
          :error-message="errorsForm[i]?.price.message"
          @input="
            updateTotal(i, book.maxCount, book.minPrice), validate(initialState)
          "
        />
        <TheWrapTheInput
          v-model="book.count"
          label="الكمية"
          name="bookIds"
          type="number"
          :error-message="errorsForm[i]?.count.message"
          @input="
            updateTotal(i, book.maxCount, book.minPrice), validate(initialState)
          "
        />
        <TheWrapTheInput
          v-model="book.total"
          label="الإجمالي"
          name="bookIds"
          type="number"
          :error-message="errorsForm[i]?.total.message"
          @input="validate(initialState)"
          disabled
        />
        <div class="flex justify-start items-end gap-6">
          <UButton
            icon="i-heroicons-trash-20-solid"
            size="3xl"
            color="primary"
            square
            variant="link"
            :disabled="i == 0"
            @click="removeLink(i)"
          />
          <UButton
            v-if="i == initialState.bookIds.length - 1"
            icon="i-heroicons-plus"
            size="3xl"
            color="green"
            square
            variant="link"
            @click="addLink"
          />
        </div>
      </div>
    </UCard>
  </GenericForm>
</template>

<script setup lang="ts">
import Joi from "joi";
const { data: userData } = useAuth();
import type { FormError } from "#ui/types";

const errorsForm = ref([]);

const { fetchEvent, data } = useActionRequest();

await fetchEvent("/book/all");

const bookstoresData = computed(() => {
  return userData.value?.data?.data?.bookstores ?? [];
});

definePageMeta({
  layout: "dashboard",
  middleware: ["auth", "protect-representative"],
});

const schema = Joi.object({
  bookstoreId: Joi.string().required().messages({
    "string.empty": "المكتبة مطلوبة",
    "any.required": "المكتبة مطلوبة",
  }),
  paymentType: Joi.string().required().messages({
    "string.empty": "نوع الدفع مطلوب",
    "any.required": "نوع الدفع مطلوب",
    "string.base": "نوع الدفع يجب أن يكون نصًا",
  }),
  paidAmount: Joi.when("paymentType", {
    is: "credit",
    then: Joi.number().required().messages({
      "number.base": "المبلغ المدفوع يجب أن يكون رقمًا",
      "number.empty": "المبلغ المدفوع مطلوب",
      "any.required": "المبلغ المدفوع مطلوب",
    }),

    otherwise: Joi.number().allow(null).optional(),
  }),
  bookIds: Joi.array()
    .items(
      Joi.object({
        bookId: Joi.string().required().min(1).messages({
          "string.empty": "الكتاب مطلوب",
          "any.required": "الكتاب مطلوب",
          "string.min": "الكتاب لا يمكن أن يكون فارغًا",
        }),
        price: Joi.number().required().min(Joi.ref("minPrice")).messages({
          "number.base": "السعر يجب أن يكون رقمًا",
          "number.empty": "السعر مطلوب",
          "any.required": "السعر مطلوب",
          "number.min": "السعر يجب أن يكون أكبر من صفر",
        }),
        count: Joi.number()
          .required()
          .min(1)
          .max(Joi.ref("maxCount"))
          .messages({
            "number.base": "الكمية يجب أن تكون رقمًا",
            "number.empty": "الكمية مطلوبة",
            "any.required": "الكمية مطلوبة",
            "number.min": "الكمية يجب أن تكون على الأقل 1",
            "number.max": "الكمية لا يمكن أن تتجاوز الحد الأقصى المتاح",
          }),
        total: Joi.number().required().min(0.01).messages({
          "number.base": "الإجمالي يجب أن يكون رقمًا",
          "number.empty": "الإجمالي مطلوب",
          "any.required": "الإجمالي مطلوب",
          "number.min": "الإجمالي يجب أن يكون أكبر من صفر",
        }),
        maxCount: Joi.number().optional(),
        minPrice: Joi.number().optional(),
      })
    )
    .min(1)
    .required()
    .messages({
      "array.min": "يجب إضافة كتاب واحد على الأقل",
      "any.required": "يجب إضافة كتاب واحد على الأقل",
    }),
});

const initialState = reactive({
  bookstoreId: undefined,
  bookIds: [
    {
      bookId: undefined,
      price: 0,
      count: 1,
      total: 0,
      maxCount: 1,
      minPrice: 1,
    },
  ],
  paymentType: undefined,
  paidAmount: undefined,
});

const handleBookSelection = (index: number) => {
  const selectedBook = data.value.find(
    (book: any) => book._id === initialState.bookIds[index].bookId
  );

  if (selectedBook) {
    initialState.bookIds[index].price = selectedBook.price || 0;
    updateTotal(index, selectedBook.availableQuantity, selectedBook.price);
  }
};
const updateTotal = (index: number, max: number, min: number) => {
  const book = initialState.bookIds[index];
  book.maxCount = max;
  book.total = book.price * book.count;
  book.minPrice = min;
};

function deepClone(value: any) {
  // Handle non-objects (primitives)
  if (value === null || typeof value !== "object") {
    return value;
  }

  // Handle Arrays
  if (Array.isArray(value)) {
    return value.map((item) => deepClone(item));
  }

  // Handle Objects
  const clone = {};
  for (const key in value) {
    if (value.hasOwnProperty(key)) {
      clone[key] = deepClone(value[key]);
    }
  }

  return clone;
}

const validate = (state: any): FormError[] => {
  const errors: FormError[] = [];

  const { error } = schema.validate(state, { abortEarly: false });

  // console.warn("error", error);

  const clonedState = deepClone(state);

  clonedState.bookIds.forEach((book: any, i: number) => {
    errors[i] = book;
    for (const key in book) {
      if (key === "bookId" && !book[key]) {
        errors[i][key] = { error: true, message: "الكتاب مطلوب" };
      }
      if (key === "price" && !book[key]) {
        errors[i][key] = { error: true, message: "السعر مطلوب" };
      }
      if (key === "count" && !book[key]) {
        errors[i][key] = { error: true, message: "الكمية مطلوبة" };
      }
      if (key === "total" && !book[key]) {
        errors[i][key] = { error: true, message: "الإجمالي مطلوب" };
      }
    }

    if (book.bookId && book.count > book.maxCount) {
      errors[i].count = {
        error: true,
        message: `الكمية لا يمكن أن تتجاوز الحد الأقصى المتاح ${book.maxCount}`,
      };
    }

    if (book.bookId && book.price < book.minPrice) {
      errors[i].price = {
        error: true,
        message: `يجب ان لا يكون  السعر اقل من ${book.minPrice}`,
      };
    }
  });

  errorsForm.value = errors;

  return errors;
};

const addLink = () => {
  initialState.bookIds.push({
    bookId: undefined,
    price: 0,
    count: 1,
    total: 0,
    maxCount: 1,
    minPrice: 1,
  });
};

const removeLink = (i: number) => {
  if (initialState.bookIds.length > 1) {
    initialState.bookIds.splice(i, 1);
    errorsForm.value.splice(i, 1);
  }
};
</script>

<style lang="scss" scoped>
</style>