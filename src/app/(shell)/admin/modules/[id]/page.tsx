'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button, Card, CardBody, Input, Switch, Divider } from '@heroui/react'
import { adminModulesApi, adminFeaturesApi } from '@/lib/api'
import type { Module } from '@/types/module'
import type { Feature } from '@/types/feature'
import { Plus, Pencil } from 'lucide-react'
import Link from 'next/link'

export default function EditModulePage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
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
      router.push('/admin/modules')
    } finally {
      setSaving(false)
    }
  }

  if (!mod) return <p className="text-gray-400 text-sm">載入中...</p>

  return (
    <div className="max-w-lg space-y-4">
      <h1 className="text-xl font-semibold">編輯模組 — <span className="font-mono text-base">{mod.name}</span></h1>
      <Card>
        <CardBody className="space-y-3">
          <Input label="顯示名稱" value={mod.display_name} onChange={(e) => setMod({ ...mod, display_name: e.target.value })} />
          <Input label="子應用 URL" value={mod.url} onChange={(e) => setMod({ ...mod, url: e.target.value })} />
          <Input label="圖示" value={mod.icon} onChange={(e) => setMod({ ...mod, icon: e.target.value })} />
          <Input label="說明" value={mod.description} onChange={(e) => setMod({ ...mod, description: e.target.value })} />
          <Input label="排序" type="number" value={String(mod.sort_order)} onChange={(e) => setMod({ ...mod, sort_order: Number(e.target.value) })} />
          <div className="flex items-center gap-2">
            <Switch isSelected={mod.enabled} onValueChange={(v) => setMod({ ...mod, enabled: v })} />
            <span className="text-sm">啟用</span>
          </div>
          <div className="flex gap-2 pt-2">
            <Button color="primary" isLoading={saving} onClick={handleSave}>儲存</Button>
            <Button variant="light" onClick={() => router.back()}>取消</Button>
          </div>
        </CardBody>
      </Card>

      <Divider />
      <div className="flex items-center justify-between">
        <h2 className="font-medium text-sm">功能列表</h2>
        <Link href={`/admin/modules/${id}/features/new`}>
          <Button size="sm" startContent={<Plus size={14} />}>新增功能</Button>
        </Link>
      </div>
      <div className="space-y-1">
        {features.map((f) => (
          <div key={f.id} className="flex items-center justify-between p-2 border rounded-md text-sm">
            <span>{f.display_name} <span className="text-gray-400 font-mono text-xs">{f.path}</span></span>
            <Link href={`/admin/features/${f.id}`}>
              <Button isIconOnly size="sm" variant="light"><Pencil size={12} /></Button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
