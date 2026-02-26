'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Card, CardBody, CardHeader, Input } from '@heroui/react'
import { authApi, setToken } from '@/lib/api'
import { usePermission } from '@/contexts/permission-context'
import { useModules } from '@/contexts/module-context'

export default function LoginPage() {
  const router = useRouter()
  const { loadPermissions } = usePermission()
  const { loadModules } = useModules()
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
      setError(err instanceof Error ? err.message : '登入失敗')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-sm shadow-lg">
      <CardHeader className="flex flex-col items-center pb-0 pt-6">
        <h1 className="text-2xl font-bold text-primary">HySP Admin</h1>
        <p className="text-sm text-gray-500 mt-1">管理員登入</p>
      </CardHeader>
      <CardBody className="px-6 pb-6 pt-4">
        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            label="租戶代碼"
            placeholder="tenant_code"
            value={form.tenant_code}
            onChange={(e) => setForm({ ...form, tenant_code: e.target.value })}
            isRequired
          />
          <Input
            label="帳號"
            placeholder="username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            isRequired
          />
          <Input
            label="密碼"
            type="password"
            placeholder="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            isRequired
          />
          {error && <p className="text-sm text-danger">{error}</p>}
          <Button type="submit" color="primary" className="w-full" isLoading={loading}>
            登入
          </Button>
        </form>
      </CardBody>
    </Card>
  )
}
