import type { FormSubmitEvent } from "#ui/types"

export function useFormModule(options: {
  schema: any
  initialState: Record<string, any>
  createUrl: string
  updateUrl: string
  redirectUrl: string
  fetchUrl?: string
}) {
  const { request, fetchEvent, data } = useActionRequest()
  const route = useRoute()
  const router = useRouter()



  const state = options.initialState


  const loading = ref(false)
  const isEditMode = computed(() => !!route.params.id)

  const fetchData = async () => {
    if (isEditMode.value && options.fetchUrl) {
      await fetchEvent(`${options.fetchUrl}/${route.params.id}`)

      for (const key in state) {
        if (Object.prototype.hasOwnProperty.call(state, key) && key in data.value?.data?.data) {
          state[key] = data.value.data.data[key];
        }
      }
    }
  }

  const onSubmit = async (event: FormSubmitEvent<any>) => {
    try {

      loading.value = true
      const url = isEditMode.value
        ? `${options.updateUrl}/${route.params.id}`
        : options.createUrl
      const method = isEditMode.value ? 'PATCH' : 'POST'

      const responseData = await request(url, {
        method,
        body: event.data,
      })

      if (responseData) {

        await router.push(options.redirectUrl)
      }
    } catch (error) {

    } finally {
      loading.value = false
    }
  }

  return {
    state,
    loading,
    isEditMode,
    fetchData,
    onSubmit
  }
}