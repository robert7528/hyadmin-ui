import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Plus, Pencil, Loader2 } from 'lucide-react'
import { Card, CardContent, Input, Label, Button, Switch, Separator } from '@hysp/ui-kit'
import { adminModulesApi, adminFeaturesApi } from '@/lib/api'
import type { Module } from '@/types/module'
import type { Feature } from '@/types/feature'
import { useLocale } from '@/contexts/locale-context'

export default function EditModulePage() {
  const { t } = useLocale()
  const { action, label, status } = t.shared.common
  const { header: modulesHeader, form: modulesForm, features: modulesFeatures } = t.hyadmin.modules
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [mod, setMod] = useState<Module | null>(null)
  const [features, setFeatures] = useState<Feature[]>([])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    adminModulesApi.get(Number(id)).then(setMod)
    adminFeaturesApi.listByModule(Number(id)).then((d) => setFeatures(d.features ?? []))
  }, [id])

  const handleSave = async () => {
    if (!mod) return
    setSaving(true)
    try {
      await adminModulesApi.update(Number(id), {
        display_name: mod.display_name,
        icon: mod.icon,
        url: mod.url,
        description: mod.description,
        sort_order: mod.sort_order,
        enabled: mod.enabled,
      })
      navigate('/admin/modules')
    } finally {
      setSaving(false)
    }
  }

  if (!mod) return <p className="text-muted-foreground text-sm">{status.loading}</p>

  return (
    <div className="max-w-lg space-y-4">
      <h1 className="text-xl font-semibold">{modulesHeader.titleEdit} — <span className="font-mono text-base">{mod.name}</span></h1>
      <Card>
        <CardContent className="pt-6 space-y-3">
          <div className="space-y-2">
            <Label htmlFor="display_name">{modulesForm.labelDisplayName}</Label>
            <Input id="display_name" value={mod.display_name} onChange={(e) => setMod({ ...mod, display_name: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="url">{modulesForm.labelUrl}</Label>
            <Input id="url" value={mod.url} onChange={(e) => setMod({ ...mod, url: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="icon">{modulesForm.labelIcon}</Label>
            <Input id="icon" value={mod.icon} onChange={(e) => setMod({ ...mod, icon: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">{label.description}</Label>
            <Input id="description" value={mod.description} onChange={(e) => setMod({ ...mod, description: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sort_order">{modulesForm.labelSortOrder}</Label>
            <Input id="sort_order" type="number" value={String(mod.sort_order)} onChange={(e) => setMod({ ...mod, sort_order: Number(e.target.value) })} />
          </div>
          <div className="flex items-center gap-2">
            <Switch checked={mod.enabled} onCheckedChange={(v) => setMod({ ...mod, enabled: v })} />
            <span className="text-sm">{status.enabled}</span>
          </div>
          <div className="flex gap-2 pt-2">
            <Button disabled={saving} onClick={handleSave}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {action.save}
            </Button>
            <Button variant="ghost" onClick={() => navigate(-1)}>{action.cancel}</Button>
          </div>
        </CardContent>
      </Card>

      <Separator />
      <div className="flex items-center justify-between">
        <h2 className="font-medium text-sm">{modulesFeatures.title}</h2>
        <Button size="sm" asChild>
          <Link to={`/admin/modules/${id}/features/new`}>
            <Plus className="mr-2 h-4 w-4" />
            {modulesFeatures.buttonNew}
          </Link>
        </Button>
      </div>
      <div className="space-y-1">
        {features.map((f) => (
          <div key={f.id} className="flex items-center justify-between p-2 border rounded-md text-sm">
            <span>{f.display_name} <span className="text-muted-foreground font-mono text-xs">{f.path}</span></span>
            <Button variant="ghost" size="icon" asChild>
              <Link to={`/admin/features/${f.id}`}>
                <Pencil className="h-3 w-3" />
              </Link>
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
