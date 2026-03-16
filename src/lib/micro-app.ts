export function initMicroApp() {
  if (typeof window === 'undefined') return
  import('@micro-zoe/micro-app').then(({ default: microApp }) => {
    microApp.start()
  })
}
