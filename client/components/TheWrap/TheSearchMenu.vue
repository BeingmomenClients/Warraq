  <template>
  <UFormGroup :size="size" :label="label" :name="name" :hint="hint">
    <USelectMenu
      :key="name"
      :icon="icon"
      :size="inputSize"
      v-model="value"
      :searchable="search"
      :multiple="multiple"
      :placeholder="$t('select')"
      :option-attribute="optionAttribute"
      :value-attribute="valueAttribute"
      :searchablePlaceholder="$t('search')"
      :ui="{
        placeholder: 'text-base font-bold',
      }"
    >
      <template v-if="multiple" #label>
        <span v-if="value && value.length" class="truncate">
          {{ getSelectedNames(value) }}
        </span>
        <span v-else>{{ $t("select") }}</span>
      </template>
    </USelectMenu>
  </UFormGroup>
</template>

  <script setup>
const props = defineProps({
  modelValue: {
    type: [String, Number, Object, Array],
    default: () => [],
  },
  icon: {
    type: String,
    required: false,
  },
  endpoint: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: false,
  },
  name: {
    type: String,
    required: false,
  },
  hint: {
    type: String,
    default: null,
  },
  optionAttribute: {
    type: String,
    default: "name",
  },
  valueAttribute: {
    type: String,
    default: "_id",
  },
  placeholder: {
    type: String,
    default: "Select",
  },
  by: {
    type: String,
    default: "id",
  },
  multiple: {
    type: Boolean,
    default: false,
  },
  size: {
    type: String,
    default: "xl",
  },
  inputSize: {
    type: String,
    default: "lg",
  },
});

const baseURL = useState("baseURL");
const { token } = useAuth();

const dataList = ref([]);
const emit = defineEmits(["update:modelValue", "input"]);
const search = async (q) => {
  const data = await $fetch(`${baseURL.value}${props.endpoint}`, {
    params: {
      search: q,
    },
    headers: {
      Authorization: `${token.value}`,
    },
  });

  dataList.value = data;

  return data;
};

const value = computed({
  get() {
    return props.multiple
      ? Array.isArray(props.modelValue)
        ? props.modelValue
        : []
      : props.modelValue;
  },

  set(value) {
    emit("update:modelValue", value);
    emit("input", value);
  },
});

const getSelectedNames = (selectedIds) => {
  return selectedIds
    .map((id) => {
      const item = dataList.value.find(
        (item) => item[props.valueAttribute] === id
      );
      return item ? item[props.optionAttribute] : "";
    })
    .filter(Boolean)
    .join(", ");
};
</script>

  <style lang="scss" scoped>
</style>