'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { adminModulesApi } from '@/lib/api'
import { useLocale } from '@/contexts/locale-context'

export default function NewModulePage() {
  const { t } = useLocale()
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
      setError(err instanceof Error ? err.message : t.common.create_failed)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-lg">
      <h1 className="text-xl font-semibold mb-4">{t.modules.new}</h1>
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="name">{t.modules.name} (name)</Label>
              <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="display_name">{t.modules.display_name}</Label>
              <Input id="display_name" value={form.display_name} onChange={(e) => setForm({ ...form, display_name: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="route">{t.modules.route} (route)</Label>
              <Input id="route" value={form.route} onChange={(e) => setForm({ ...form, route: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="url">{t.modules.url}</Label>
              <Input id="url" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="icon">{t.modules.icon} (icon class)</Label>
              <Input id="icon" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">{t.common.description}</Label>
              <Input id="description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sort_order">{t.modules.sort_order}</Label>
              <Input id="sort_order" type="number" value={String(form.sort_order)} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} />
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
