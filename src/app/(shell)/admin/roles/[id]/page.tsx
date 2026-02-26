'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Button, Checkbox, Chip, Spinner } from '@heroui/react'
import { adminRolesApi, adminModulesApi, adminFeaturesApi } from '@/lib/api'
import type { Role } from '@/types/role'
import type { Module } from '@/types/module'
import type { Feature } from '@/types/feature'
import type { Permission } from '@/types/permission'

interface FeatureWithPermissions extends Feature {
  permissions: Permission[]
}

interface ModuleWithFeatures extends Module {
  features: FeatureWithPermissions[]
}

export default function RolePermissionsPage() {
  const { id } = useParams<{ id: string }>()
  const [role, setRole] = useState<Role | null>(null)
  const [tree, setTree] = useState<ModuleWithFeatures[]>([])
  const [selectedCodes, setSelectedCodes] = useState<Set<string>>(new Set())
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [roleData, modulesData] = await Promise.all([
          adminRolesApi.get(Number(id)),
          adminModulesApi.list(),
        ])
        setRole(roleData.role)
        setSelectedCodes(new Set(roleData.permission_codes))

        const mods: ModuleWithFeatures[] = await Promise.all(
          (modulesData.modules ?? []).map(async (mod) => {
            const featData = await adminFeaturesApi.listByModule(mod.id)
            const features: FeatureWithPermissions[] = await Promise.all(
              (featData.features ?? []).map(async (feat) => {
                const permData = await adminFeaturesApi.listPermissions(feat.id)
                return { ...feat, permissions: permData.permissions ?? [] }
              })
            )
            return { ...mod, features }
          })
        )
        setTree(mods)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  const toggle = (code: string) => {
    setSelectedCodes((prev) => {
      const next = new Set(prev)
      if (next.has(code)) next.delete(code)
      else next.add(code)
      return next
    })
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await adminRolesApi.assignPermissions(Number(id), Array.from(selectedCodes))
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="flex justify-center py-12"><Spinner /></div>

  return (
    <div className="space-y-4 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">角色授權設定</h1>
          {role && <p className="text-gray-500 text-sm mt-0.5">{role.name}</p>}
        </div>
        <Button color="primary" size="sm" isLoading={saving} onClick={handleSave}>
          儲存
        </Button>
      </div>

      <div className="border rounded-lg divide-y">
        {tree.map((mod) => (
          <div key={mod.id} className="p-4">
            <p className="font-semibold text-gray-700 mb-3">{mod.display_name}</p>
            <div className="space-y-3">
              {mod.features.map((feat) => (
                <div key={feat.id}>
                  <p className="text-sm font-medium text-gray-600 mb-2">{feat.display_name}</p>
                  <div className="flex flex-wrap gap-3">
                    {feat.permissions.map((perm) => (
                      <div key={perm.id} className="flex items-center gap-1.5">
                        <Checkbox
                          size="sm"
                          isSelected={selectedCodes.has(perm.code)}
                          onValueChange={() => toggle(perm.code)}
                        >
                          <span className="text-sm">{perm.name}</span>
                        </Checkbox>
                        <Chip size="sm" variant="flat" className="text-xs">
                          {perm.type}
                        </Chip>
                      </div>
                    ))}
                    {feat.permissions.length === 0 && (
                      <p className="text-xs text-gray-400">（無授權點）</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
