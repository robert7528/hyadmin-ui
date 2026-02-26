'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Button,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
} from '@heroui/react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { adminModulesApi } from '@/lib/api'
import type { Module } from '@/types/module'
import { PermissionGuard } from '@/components/permission-guard'

export default function ModulesPage() {
  const [modules, setModules] = useState<Module[]>([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    try {
      const data = await adminModulesApi.list()
      setModules(data.modules ?? [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (id: number) => {
    if (!confirm('確定刪除此模組？')) return
    await adminModulesApi.delete(id)
    load()
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">模組管理</h1>
        <PermissionGuard code="admin.modules.create">
          <Button as={Link} href="/admin/modules/new" color="primary" startContent={<Plus size={16} />} size="sm">
            新增模組
          </Button>
        </PermissionGuard>
      </div>
      <Table aria-label="modules" isStriped>
        <TableHeader>
          <TableColumn>名稱</TableColumn>
          <TableColumn>顯示名稱</TableColumn>
          <TableColumn>路由</TableColumn>
          <TableColumn>排序</TableColumn>
          <TableColumn>狀態</TableColumn>
          <TableColumn>操作</TableColumn>
        </TableHeader>
        <TableBody isLoading={loading} items={modules}>
          {(mod) => (
            <TableRow key={mod.id}>
              <TableCell>{mod.name}</TableCell>
              <TableCell>{mod.display_name}</TableCell>
              <TableCell className="font-mono text-sm">{mod.route}</TableCell>
              <TableCell>{mod.sort_order}</TableCell>
              <TableCell>
                <Chip size="sm" color={mod.enabled ? 'success' : 'default'} variant="flat">
                  {mod.enabled ? '啟用' : '停用'}
                </Chip>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button as={Link} href={`/admin/modules/${mod.id}`} isIconOnly size="sm" variant="light">
                    <Pencil size={14} />
                  </Button>
                  <PermissionGuard code="admin.modules.delete">
                    <Button isIconOnly size="sm" variant="light" color="danger" onClick={() => handleDelete(mod.id)}>
                      <Trash2 size={14} />
                    </Button>
                  </PermissionGuard>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
