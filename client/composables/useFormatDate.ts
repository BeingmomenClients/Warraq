import { useDateFormat } from "@vueuse/core";
export const useFormatDate = (text: any, format = "YYYY-MM-DD") => {
  const formatted = useDateFormat(text, format);
  return formatted.value;
}
