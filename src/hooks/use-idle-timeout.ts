import { useEffect, useRef } from 'react'
import { clearToken } from '@/lib/api'

/**
 * Detects user inactivity and clears auth + redirects to login.
 * Uses timestamp comparison instead of pure setTimeout to handle
 * OS sleep/hibernate correctly (setTimeout fires immediately on wake).
 * @param timeoutMinutes Minutes of inactivity before logout (default 30)
 */
export function useIdleTimeout(timeoutMinutes = 30) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastActiveRef = useRef<number>(Date.now())

  useEffect(() => {
    if (timeoutMinutes <= 0) return
    const timeoutMs = timeoutMinutes * 60 * 1000

    const logout = () => {
      clearToken()
      window.location.href = '/hyadmin/login'
    }

    const resetTimer = () => {
      lastActiveRef.current = Date.now()
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(checkIdle, timeoutMs)
    }

    const checkIdle = () => {
      const elapsed = Date.now() - lastActiveRef.current
      if (elapsed >= timeoutMs) {
        logout()
      } else {
        // Woke from sleep but not yet timed out — reschedule remainder
        timerRef.current = setTimeout(checkIdle, timeoutMs - elapsed)
      }
    }

    const events = ['mousemove', 'keydown', 'scroll', 'click', 'touchstart']
    events.forEach((e) => window.addEventListener(e, resetTimer, { passive: true }))
    resetTimer() // start timer

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      events.forEach((e) => window.removeEventListener(e, resetTimer))
    }
  }, [timeoutMinutes])
}
