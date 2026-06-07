
export const useWorksSection = () => {

  const getAllData = async () => {
    const { data, pending } = await useLazyAsyncData<{

    }[]>('works', () => ($fetch as any)(`/api/works`, {
      query: {}
    }), {
      default: () => [],
      watch: []
    })

    return data.value
  }


  return {
    getAllData,
  }
}
