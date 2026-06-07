import { useDark } from "@vueuse/core";
import { computed } from "vue";

const isDark = useDark();
export const useMode = () => {
  const mode = computed(() => isDark.value);
  return mode
}
