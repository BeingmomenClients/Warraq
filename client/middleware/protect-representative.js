export default defineNuxtRouteMiddleware((to, from) => {
  const { data } = useAuth();

  if (
    data.value.data.data.role === "admin" ||
    data.value.data.data.role === "dev"
  ) {
    return navigateTo("/");
  } else {
  }
});
