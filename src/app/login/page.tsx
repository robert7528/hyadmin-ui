'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, Input, Label, Button } from '@hysp/ui-kit'
import { authApi, setToken } from '@/lib/api'
import { usePermission } from '@/contexts/permission-context'
import { useModules } from '@/contexts/module-context'
import { useLocale } from '@/contexts/locale-context'

export default function LoginPage() {
  const router = useRouter()
  const { loadPermissions } = usePermission()
  const { loadModules } = useModules()
  const { t } = useLocale()
  const { header: loginHeader, form: loginForm, error: loginError } = t.hyadmin.login
  const [form, setForm] = useState({ tenant_code: '', username: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await authApi.login({ ...form, provider: 'local' })
      setToken(res.token, form.tenant_code)
      await loadPermissions()
      await loadModules()
      router.push('/')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : loginError.failed)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-sm shadow-lg">
      <CardHeader className="flex flex-col items-center pb-0 pt-6">
        <CardTitle className="text-2xl font-bold text-primary">{loginHeader.title}</CardTitle>
        <CardDescription className="mt-1">{loginHeader.subtitle}</CardDescription>
      </CardHeader>
      <CardContent className="px-6 pb-6 pt-4">
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tenant_code">{loginForm.labelTenantCode}</Label>
            <Input
              id="tenant_code"
              placeholder="tenant_code"
              value={form.tenant_code}
              onChange={(e) => setForm({ ...form, tenant_code: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="username">{loginForm.labelUsername}</Label>
            <Input
              id="username"
              placeholder="username"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">{loginForm.labelPassword}</Label>
            <Input
              id="password"
              type="password"
              placeholder="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loginForm.buttonSubmit}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
