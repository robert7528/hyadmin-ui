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

const STANDARD_SUFFIXES = [
  { suffix: 'view', label: '頁面存取', type: 'menu' },
  { suffix: 'create', label: '新增', type: 'button' },
  { suffix: 'update', label: '編輯', type: 'button' },
  { suffix: 'delete', label: '刪除', type: 'button' },
  { suffix: 'export', label: '匯出', type: 'button' },
]

export default function FeaturePermissionsPage() {
  const { id } = useParams<{ id: string }>()
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
    if (!confirm('確定刪除此授權點？')) return
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
        授權點管理
        {feature && <span className="text-muted-foreground font-normal text-base ml-2">— {feature.display_name}</span>}
      </h1>

      {/* Batch create from template */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">從範本建立授權點</CardTitle>
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
            套用範本
          </Button>
        </CardContent>
      </Card>

      {/* Existing permissions */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-muted-foreground">現有授權點</h2>
        <Button size="sm" onClick={() => setShowModal(true)}>
          <Plus className="mr-2 h-4 w-4" />
          新增自訂授權點
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Code</TableHead>
            <TableHead>名稱</TableHead>
            <TableHead>類型</TableHead>
            <TableHead>操作</TableHead>
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
            <DialogTitle>新增自訂授權點</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-4">
            <div className="space-y-2">
              <Label htmlFor="perm-suffix">Suffix（code後綴）</Label>
              <Input
                id="perm-suffix"
                placeholder="e.g. reset_pwd"
                value={newPerm.suffix}
                onChange={(e) => setNewPerm({ ...newPerm, suffix: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">完整 Code: {codePrefix}.{newPerm.suffix || '...'}</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="perm-name">顯示名稱</Label>
              <Input
                id="perm-name"
                placeholder="重設密碼"
                value={newPerm.name}
                onChange={(e) => setNewPerm({ ...newPerm, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>類型</Label>
              <Select value={newPerm.type} onValueChange={(v) => setNewPerm({ ...newPerm, type: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="menu">menu（頁面存取）</SelectItem>
                  <SelectItem value="button">button（操作按鈕）</SelectItem>
                  <SelectItem value="api">api（API 端點）</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowModal(false)}>取消</Button>
            <Button onClick={handleCreateCustom}>建立</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
