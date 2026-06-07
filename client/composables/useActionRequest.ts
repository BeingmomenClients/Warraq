export const useActionRequest = () => {
  const baseURL = useState("baseURL");
  const toast = useToast();
  const { signOut, token } = useAuth();

  const data: Ref<any> = ref(null)
  const error: Ref<any> = ref(null)
  const loading: Ref<boolean> = ref(false)

  const request = async (endpoint: string, options: {
    method?: 'POST' | 'GET' | 'HEAD' | 'PATCH' | 'PUT' | 'DELETE' | 'CONNECT' | 'OPTIONS' | 'TRACE',
    body?: object,
    refresh?: () => void
  }) => {
    const { method = 'POST', body, refresh } = options;

    try {
      const data = await $fetch(`${baseURL.value}${endpoint}`, {
        method,
        body,
        headers: {
          "Authorization": `${token.value}`,
          "Content-Type": "application/json",
        },
      });

      toast.add({ title: (data as { message: string }).message, timeout: 3000, color: 'green' });
      if (refresh) {
        refresh();
      }

      return data;
    } catch (error) {
      console.error('Request error:', error?.response._data);

      if (error instanceof Error && typeof error === 'object' && 'response' in error && error.response && typeof error.response === 'object' && '_data' in error.response) {
        const errorResponse = error.response as { _data?: { data?: string[], message?: string, statusCode?: number, errors?: Record<string, string[]> } };

        if (errorResponse._data?.statusCode === 400 || errorResponse._data?.statusCode === 500) {
          if (errorResponse._data.errors) {
            Object.values(errorResponse._data.errors).flat().forEach((err: string) => {
              toast.add({ title: err, timeout: 4000, color: "red" });
            });
          } else {
            toast.add({ title: errorResponse._data.message || 'An error occurred', timeout: 4000, color: "red" });
          }
        } else {
          const errors = errorResponse._data?.data || [errorResponse._data?.message || ''];
          errors.forEach((err: string) => {
            toast.add({ title: err, timeout: 4000, color: "red" });
          });
        }

        if (errorResponse._data?.statusCode === 401) {
          await signOut({ callbackUrl: "/login", redirect: true });
        }
      }

      throw error;
    }
  };

  const fetchEvent = async (endpoint: string, query?: object) => {
    loading.value = true
    error.value = null

    try {
      const response = await useFetch(`${baseURL.value}${endpoint}`, {
        headers: {
          Authorization: `${token.value}`
        },
        params: {
          ...query
        }
      })
      data.value = response.data.value
    } catch (err) {
      error.value = err
      if (err instanceof Error && 'response' in err && err.response && (err.response as any).status === 401) {
        await signOut()
      }
    } finally {
      loading.value = false
    }
  }

  return {
    request,
    data,
    error,
    loading,
    fetchEvent
  };
};
