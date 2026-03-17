'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { Card, CardContent, Input, Label, Textarea, Button } from '@hysp/ui-kit'
import { adminRolesApi } from '@/lib/api'
import { useLocale } from '@/contexts/locale-context'

export default function NewRolePage() {
  const { t } = useLocale()
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
      setError(err instanceof Error ? err.message : t.common.create_failed)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-md">
      <h1 className="text-xl font-semibold mb-4">{t.roles.new}</h1>
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="tenant_code">{t.common.tenant_code}</Label>
              <Input id="tenant_code" value={form.tenant_code} onChange={(e) => setForm({ ...form, tenant_code: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">{t.roles.name}</Label>
              <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">{t.roles.description}</Label>
              <Textarea id="description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            {error && <p className="text-destructive text-sm">{error}</p>}
            <div className="flex gap-2 pt-2">
              <Button type="submit" disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t.common.create}
              </Button>
              <Button variant="ghost" type="button" onClick={() => router.back()}>{t.common.cancel}</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
