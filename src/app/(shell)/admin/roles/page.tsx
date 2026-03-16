'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Settings, Trash2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table'
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
          <Button size="sm" asChild>
            <Link href="/admin/roles/new">
              <Plus className="mr-2 h-4 w-4" />
              新增角色
            </Link>
          </Button>
        </PermissionGuard>
      </div>
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>角色名稱</TableHead>
              <TableHead>說明</TableHead>
              <TableHead>租戶</TableHead>
              <TableHead>操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {roles.map((role) => (
              <TableRow key={role.id}>
                <TableCell className="font-medium">{role.name}</TableCell>
                <TableCell className="text-muted-foreground">{role.description}</TableCell>
                <TableCell>{role.tenant_code}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" title="設定授權" asChild>
                      <Link href={`/admin/roles/${role.id}`}>
                        <Settings className="h-4 w-4" />
                      </Link>
                    </Button>
                    <PermissionGuard code="admin.roles.delete">
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDelete(role.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </PermissionGuard>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}
