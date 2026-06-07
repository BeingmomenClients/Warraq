export const useToLocaleString = () => {
  const formatValue = (value) => {
    if (value === 0) {
      return value;
    }

    return value.toLocaleString("en-US");
  };
  return {
    formatValue,
  };
};
