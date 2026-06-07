export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const { data } = useAuth();

  // globalThis.$fetch = $fetch.create({
  //   baseURL: config.public.baseURL
  // })

  useState('baseURL', () => config.public.baseURL)
  // useState('userData', () => data.value?.data.data)
})