'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Plus, Trash2, Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { adminFeaturesApi, adminPermissionsApi } from '@/lib/api'
import type { Feature } from '@/types/feature'
import type { Permission } from '@/types/permission'
import { useLocale } from '@/contexts/locale-context'

export default function FeaturePermissionsPage() {
  const { t } = useLocale()
  const { id } = useParams<{ id: string }>()

  const STANDARD_SUFFIXES = [
    { suffix: 'view', label: t.features.tpl_view, type: 'menu' },
    { suffix: 'create', label: t.features.tpl_create, type: 'button' },
    { suffix: 'update', label: t.features.tpl_update, type: 'button' },
    { suffix: 'delete', label: t.features.tpl_delete, type: 'button' },
    { suffix: 'export', label: t.features.tpl_export, type: 'button' },
  ]
  const [feature, setFeature] = useState<Feature | null>(null)
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSuffixes, setSelectedSuffixes] = useState<Set<string>>(new Set(['view']))
  const [batching, setBatching] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [newPerm, setNewPerm] = useState({ suffix: '', name: '', type: 'button' })

  const load = async () => {
    setLoading(true)
    try {
      const [featData, permData] = await Promise.all([
        adminFeaturesApi.get(Number(id)),
        adminFeaturesApi.listPermissions(Number(id)),
      ])
      setFeature(featData)
      setPermissions(permData.permissions ?? [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [id])

  const codePrefix = feature ? `${feature.name}` : ''

  const handleBatchCreate = async () => {
    if (!feature || selectedSuffixes.size === 0) return
    setBatching(true)
    try {
      await adminFeaturesApi.batchCreatePermissions(Number(id), {
        feature_id: Number(id),
        code_prefix: codePrefix,
        suffixes: Array.from(selectedSuffixes),
      })
      load()
    } finally {
      setBatching(false)
    }
  }

  const handleCreateCustom = async () => {
    if (!newPerm.suffix || !newPerm.name) return
    await adminFeaturesApi.createPermission(Number(id), {
      feature_id: Number(id),
      code: `${codePrefix}.${newPerm.suffix}`,
      name: newPerm.name,
      type: newPerm.type as 'menu' | 'button' | 'api',
    })
    setShowModal(false)
    setNewPerm({ suffix: '', name: '', type: 'button' })
    load()
  }

  const handleDelete = async (permId: number) => {
    if (!confirm(t.features.confirm_delete)) return
    await adminPermissionsApi.delete(permId)
    load()
  }

  if (loading) return (
    <div className="flex justify-center py-12">
      <Loader2 className="h-6 w-6 animate-spin" />
    </div>
  )

  return (
    <div className="space-y-4 max-w-2xl">
      <h1 className="text-xl font-semibold">
        {t.features.title}
        {feature && <span className="text-muted-foreground font-normal text-base ml-2">— {feature.display_name}</span>}
      </h1>

      {/* Batch create from template */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">{t.features.batch_title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3 mb-3">
            {STANDARD_SUFFIXES.map((s) => (
              <div key={s.suffix} className="flex items-center gap-1.5">
                <Checkbox
                  id={`suffix-${s.suffix}`}
                  checked={selectedSuffixes.has(s.suffix)}
                  onCheckedChange={(v) => {
                    setSelectedSuffixes((prev) => {
                      const next = new Set(prev)
                      if (v) next.add(s.suffix)
                      else next.delete(s.suffix)
                      return next
                    })
                  }}
                />
                <label htmlFor={`suffix-${s.suffix}`} className="text-sm cursor-pointer">
                  {s.label}
                </label>
              </div>
            ))}
          </div>
          <Button size="sm" disabled={batching} onClick={handleBatchCreate}>
            {batching && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t.features.batch_apply}
          </Button>
        </CardContent>
      </Card>

      {/* Existing permissions */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-muted-foreground">{t.features.existing_title}</h2>
        <Button size="sm" onClick={() => setShowModal(true)}>
          <Plus className="mr-2 h-4 w-4" />
          {t.features.new_custom}
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t.features.code}</TableHead>
            <TableHead>{t.common.name}</TableHead>
            <TableHead>{t.features.type}</TableHead>
            <TableHead>{t.common.actions}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {permissions.map((p) => (
            <TableRow key={p.id}>
              <TableCell className="font-mono text-xs">{p.code}</TableCell>
              <TableCell>{p.name}</TableCell>
              <TableCell>
                <Badge variant={p.type === 'menu' ? 'default' : p.type === 'api' ? 'outline' : 'secondary'}>
                  {p.type}
                </Badge>
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDelete(p.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Custom permission modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.features.new_custom}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-4">
            <div className="space-y-2">
              <Label htmlFor="perm-suffix">{t.features.suffix}</Label>
              <Input
                id="perm-suffix"
                placeholder="e.g. reset_pwd"
                value={newPerm.suffix}
                onChange={(e) => setNewPerm({ ...newPerm, suffix: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">{t.features.full_code}: {codePrefix}.{newPerm.suffix || '...'}</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="perm-name">{t.common.name}</Label>
              <Input
                id="perm-name"
                placeholder="e.g. Reset Password"
                value={newPerm.name}
                onChange={(e) => setNewPerm({ ...newPerm, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>{t.features.type}</Label>
              <Select value={newPerm.type} onValueChange={(v) => setNewPerm({ ...newPerm, type: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="menu">menu ({t.features.type_menu})</SelectItem>
                  <SelectItem value="button">button ({t.features.type_button})</SelectItem>
                  <SelectItem value="api">api ({t.features.type_api})</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowModal(false)}>{t.common.cancel}</Button>
            <Button onClick={handleCreateCustom}>{t.common.create}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
