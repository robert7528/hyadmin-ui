'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Card, CardBody, Input, Textarea } from '@heroui/react'
import { adminRolesApi } from '@/lib/api'

export default function NewRolePage() {
  const router = useRouter()
  const [form, setForm] = useState({ tenant_code: '', name: '', description: '' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      await adminRolesApi.create(form)
      router.push('/admin/roles')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : '建立失敗')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-md">
      <h1 className="text-xl font-semibold mb-4">新增角色</h1>
      <Card>
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-3">
            <Input label="租戶代碼" value={form.tenant_code} onChange={(e) => setForm({ ...form, tenant_code: e.target.value })} isRequired />
            <Input label="角色名稱" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} isRequired />
            <Textarea label="說明" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
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
