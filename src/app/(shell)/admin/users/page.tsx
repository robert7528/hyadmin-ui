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
import { adminUsersApi } from '@/lib/api'
import type { AdminUser } from '@/types/user'
import { PermissionGuard } from '@/components/permission-guard'

export default function UsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    try {
      const data = await adminUsersApi.list()
      setUsers(data.users ?? [])
      setTotal(data.total)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (id: number) => {
    if (!confirm('確定刪除此使用者？')) return
    await adminUsersApi.delete(id)
    load()
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">使用者管理 <span className="text-sm text-gray-400">({total})</span></h1>
        <PermissionGuard code="admin.users.create">
          <Button as={Link} href="/admin/users/new" color="primary" startContent={<Plus size={16} />} size="sm">
            新增使用者
          </Button>
        </PermissionGuard>
      </div>
      <Table aria-label="users" isStriped>
        <TableHeader>
          <TableColumn>帳號</TableColumn>
          <TableColumn>顯示名稱</TableColumn>
          <TableColumn>Email</TableColumn>
          <TableColumn>租戶</TableColumn>
          <TableColumn>登入方式</TableColumn>
          <TableColumn>狀態</TableColumn>
          <TableColumn>操作</TableColumn>
        </TableHeader>
        <TableBody isLoading={loading} items={users}>
          {(user) => (
            <TableRow key={user.id}>
              <TableCell>{user.username}</TableCell>
              <TableCell>{user.display_name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.tenant_code}</TableCell>
              <TableCell>
                <Chip size="sm" variant="flat">{user.provider}</Chip>
              </TableCell>
              <TableCell>
                <Chip size="sm" color={user.enabled ? 'success' : 'default'} variant="flat">
                  {user.enabled ? '啟用' : '停用'}
                </Chip>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button as={Link} href={`/admin/users/${user.id}`} isIconOnly size="sm" variant="light">
                    <Pencil size={14} />
                  </Button>
                  <PermissionGuard code="admin.users.delete">
                    <Button isIconOnly size="sm" variant="light" color="danger" onClick={() => handleDelete(user.id)}>
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
