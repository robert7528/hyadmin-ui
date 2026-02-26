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
} from '@heroui/react'
import { Plus, Settings, Trash2 } from 'lucide-react'
import { adminRolesApi } from '@/lib/api'
import type { Role } from '@/types/role'
import { PermissionGuard } from '@/components/permission-guard'

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    try {
      const data = await adminRolesApi.list()
      setRoles(data.roles ?? [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (id: number) => {
    if (!confirm('確定刪除此角色？')) return
    await adminRolesApi.delete(id)
    load()
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">角色管理</h1>
        <PermissionGuard code="admin.roles.create">
          <Button as={Link} href="/admin/roles/new" color="primary" startContent={<Plus size={16} />} size="sm">
            新增角色
          </Button>
        </PermissionGuard>
      </div>
      <Table aria-label="roles" isStriped>
        <TableHeader>
          <TableColumn>角色名稱</TableColumn>
          <TableColumn>說明</TableColumn>
          <TableColumn>租戶</TableColumn>
          <TableColumn>操作</TableColumn>
        </TableHeader>
        <TableBody isLoading={loading} items={roles}>
          {(role) => (
            <TableRow key={role.id}>
              <TableCell className="font-medium">{role.name}</TableCell>
              <TableCell className="text-gray-500">{role.description}</TableCell>
              <TableCell>{role.tenant_code}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button as={Link} href={`/admin/roles/${role.id}`} isIconOnly size="sm" variant="light" title="設定授權">
                    <Settings size={14} />
                  </Button>
                  <PermissionGuard code="admin.roles.delete">
                    <Button isIconOnly size="sm" variant="light" color="danger" onClick={() => handleDelete(role.id)}>
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
