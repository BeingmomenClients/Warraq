export function useTableModule(options: {
  fetchUrl: string
  deleteUrl: string
  editUrl: string
  filters?: Record<string, any>
  customItems?: {
    items: (row: any) => Array<{ label: string; icon: string; click: () => void }>
    position?: number
    replace?: boolean
  }
}) {

  const { t } = useI18n()
  const toast = useToast()
  const { request } = useActionRequest()
  const { token } = useAuth()
  const baseURL = useState('baseURL')

  const search = ref('')
  const page = ref(1)
  const pageCount = ref(10)
  const filters = ref(options.filters || {})

  const { data, pending, refresh, error } = useLazyAsyncData(
    options.fetchUrl,
    () => $fetch(options.fetchUrl, {
      baseURL: baseURL.value as string | undefined,
      headers: {
        Authorization: `${token.value}`
      },
      query: {
        page: page.value,
        search: search.value,
        limit: pageCount.value,
        ...filters.value,
      }
    }),
    {
      default: () => [],
      watch: [page, search, pageCount, filters]
    }
  )

  const pageTotal = computed(() => (data.value as { total?: number })?.total || 1)
  const resultsCount = computed(() => (data.value as { total?: number })?.results || 1)
  const pageFrom = computed(() => (page.value - 1) * pageCount.value + 1)
  const pageTo = computed(() => Math.min(page.value * pageCount.value, pageTotal.value))

  const editRow = (id: string) => {
    navigateTo(`${options.editUrl}/${id}`)
  }

  const deleteRow = async (id: string, callback?: () => void) => {
    try {
      await toast.add({
        id: 'delete',
        title: 'تأكيد بالحذف ...',
        color: 'red',
        description: 'هل أنت متأكد من حذف هذا العنصر؟',
        icon: 'i-ic-outline-warning',
        timeout: 6000,
        actions: [
          {
            label: 'لا',
            size: 'md',
            color: 'red',
            click: () => { }
          },
          {
            label: 'تأكيد',
            size: 'md',
            color: 'green',
            click: async () => {
              await request(`${options.deleteUrl}/${id}`, {
                method: 'DELETE',
                refresh
              })
              if (callback) {
                callback()
              }
            }
          }],
        ui: {
          actions: 'justify-end'
        }
      })

    } catch (error) {
      // toast.add({ title: t('error_occurred'), timeout: 3000, color: 'red' })
    }
  }

  const items = (row: any) => {
    if (options.customItems && options.customItems.replace) {
      return options.customItems.items(row).map(item => [item]);
    }

    const defaultItems = [
      [{
        label: t('edit'),
        icon: 'i-heroicons-pencil-square-20-solid',
        click: () => editRow(row._id)
      }],
      [{
        label: t('delete'),
        icon: 'i-heroicons-trash-20-solid',
        click: () => deleteRow(row._id)
      }]
    ];

    if (options.customItems) {
      const customItems = options.customItems.items(row).map(item => [item]);
      const position = options.customItems.position ?? 0;

      defaultItems.splice(position, 0, ...customItems);
    }

    return defaultItems;
  }

  watch(error, (newError) => {

    if (newError) {
      console.warn('newError', newError);
      const errorMessage = newError.data.errors?.error?.[0] || newError.message || t('error_occurred');
      toast.add({
        description: errorMessage,
        timeout: 3000,
        color: 'red'
      });
    }
  })

  return {
    search,
    page,
    pageCount,
    resultsCount,
    data,
    pending,
    pageTotal,
    pageFrom,
    pageTo,
    items,
    refresh,
    deleteRow
  }
}