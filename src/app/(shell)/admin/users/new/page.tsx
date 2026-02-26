'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Card, CardBody, Input } from '@heroui/react'
import { adminUsersApi } from '@/lib/api'

export default function NewUserPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    tenant_code: '', username: '', password: '', display_name: '', email: '', provider: 'local',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [key]: e.target.value })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      await adminUsersApi.create(form)
      router.push('/admin/users')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : '建立失敗')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-lg">
      <h1 className="text-xl font-semibold mb-4">新增使用者</h1>
      <Card>
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-3">
            <Input label="租戶代碼" value={form.tenant_code} onChange={set('tenant_code')} isRequired />
            <Input label="帳號" value={form.username} onChange={set('username')} isRequired />
            <Input label="密碼" type="password" value={form.password} onChange={set('password')} />
            <Input label="顯示名稱" value={form.display_name} onChange={set('display_name')} />
            <Input label="Email" type="email" value={form.email} onChange={set('email')} />
            {error && <p className="text-danger text-sm">{error}</p>}
            <div className="flex gap-2 pt-2">
              <Button type="submit" color="primary" isLoading={saving}>建立</Button>
              <Button variant="light" onClick={() => router.back()}>取消</Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  )
}
