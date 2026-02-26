'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Card, CardBody, CardHeader, Input, Switch } from '@heroui/react'
import { adminModulesApi } from '@/lib/api'

export default function NewModulePage() {
  const router = useRouter()
  const [form, setForm] = useState({
    name: '', display_name: '', icon: '', route: '', url: '', description: '', sort_order: 0,
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      await adminModulesApi.create(form)
      router.push('/admin/modules')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : '建立失敗')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-lg">
      <h1 className="text-xl font-semibold mb-4">新增模組</h1>
      <Card>
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-3">
            <Input label="模組代號 (name)" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} isRequired />
            <Input label="顯示名稱" value={form.display_name} onChange={(e) => setForm({ ...form, display_name: e.target.value })} isRequired />
            <Input label="路由 (route)" value={form.route} onChange={(e) => setForm({ ...form, route: e.target.value })} isRequired />
            <Input label="子應用 URL" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} />
            <Input label="圖示 (icon class)" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} />
            <Input label="說明" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <Input label="排序" type="number" value={String(form.sort_order)} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} />
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
