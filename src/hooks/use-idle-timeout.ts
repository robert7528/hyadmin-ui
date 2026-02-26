'use client'

import { useEffect, useRef } from 'react'
import { clearToken } from '@/lib/api'

/**
 * Detects user inactivity and clears auth + redirects to login.
 * @param timeoutMinutes Minutes of inactivity before logout (default 30)
 */
export function useIdleTimeout(timeoutMinutes = 30) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined' || timeoutMinutes <= 0) return

    const reset = () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => {
        clearToken()
        window.location.href = '/hyadmin/login'
      }, timeoutMinutes * 60 * 1000)
    }

    const events = ['mousemove', 'keydown', 'scroll', 'click', 'touchstart']
    events.forEach((e) => window.addEventListener(e, reset, { passive: true }))
    reset() // start timer

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      events.forEach((e) => window.removeEventListener(e, reset))
    }
  }, [timeoutMinutes])
}
