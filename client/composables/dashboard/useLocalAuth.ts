

const { signOut } = useAuth()
const toast = useToast()


export const useLocalAuth = () => {







  // Logout handler
  const logout = async () => {
    try {
      await signOut({
        callbackUrl: '/login',
        redirect: true
      })
      // Add after logout logic here, could be removing the session data from localstorage or whatever
    } catch (error: any) {

      console.warn('error', error);
      // toast.add({ title: 'error', description: error?.data?.message || error?.message, timeout: 5000 });
    }
  }


  return {
    logout,
  }
}
