export default defineAppConfig({
  ui: {
    notifications: {
      // Show toasts at the top right of the screen
      position: 'top-2 bottom-auto left-1/2 translate-x-[-50%] right-auto',
      container: 'notifications-custom',
    },
    primary: 'green',
    gray: 'slate',
    button: {
      size: {
        '2xs': 'text-xs',
        xs: 'text-xs',
        sm: 'text-sm',
        md: 'text-sm',
        lg: 'text-sm',
        xl: 'text-base',
        '2xl': 'text-2xl',
        '3xl': 'text-3xl',
        '4xl': 'text-4xl',
        '5xl': 'text-5xl',
        '6xl': 'text-6xl',
      },
    },
    modal: {
      container: 'items-start sm:items-start'
    }
  }
})
