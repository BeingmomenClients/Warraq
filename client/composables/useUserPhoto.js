export const useUserPhoto = () => {
  const config = useRuntimeConfig();
  const cloudUrl = config.public.imagePath;
  const fullPath = (path) => {
    return `${cloudUrl}/${path}`;
  };

  return {
    fullPath,
  };
};
