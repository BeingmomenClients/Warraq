<template>
  <UFormGroup :size="size" :label="label" :name="name" :hint="hint">
    <Editor
      v-model="value"
      :ptOptions="{
        mergeProps: true,
      }"
      :pt="{
        root: {
          class:
            'ring rounded-md ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400',
        },
        header: {
          class: 'hhhhhhhhh',
        },
        toolbar: { class: 'border-0 hidden' },
        content: { class: 'border-0' },
      }"
      editorStyle="height: 620px"
      :modules="{
        toolbar: toolbarOptions,
      }"
      @selection-change="handleMethod($event)"
    />
  </UFormGroup>
</template>

<script setup>
const handleMethod = (item) => {
  console.log("editor", item);
};

import Editor from "primevue/editor";
const props = defineProps({
  modelValue: [String, Number],
  label: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    default: "xl",
  },
  variant: {
    type: String,
    default: "outline",
  },
  inputSize: {
    type: String,
    default: "lg",
  },
  type: {
    type: String,
    default: "text",
  },
  hint: {
    type: String,
    default: "",
  },
  hintLink: {
    type: Boolean,
    default: false,
  },
  hintLinkText: {
    type: String,
  },
  hintLinkPath: {
    type: String,
  },
});

const emit = defineEmits(["update:modelValue", "input"]);

const value = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit("update:modelValue", value);
    emit("input", value);
  },
});

const toolbarOptions = [
  ["bold", "italic", "underline", "strike"], // toggled buttons
  ["blockquote", "code-block"],
  ["link", "image", "video", "formula"],

  [{ header: 1 }, { header: 2 }], // custom button values
  [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
  [{ script: "sub" }, { script: "super" }], // superscript/subscript
  [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
  [{ direction: "rtl" }], // text direction

  [{ size: ["small", false, "large", "huge"] }], // custom dropdown
  [{ header: [1, 2, 3, 4, 5, 6, false] }],

  [{ color: [] }, { background: [] }], // dropdown with defaults from theme
  [{ font: [] }],
  [{ align: [] }],

  ["clean"], // remove formatting button
];
</script>

<style lang="scss">
</style>