'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table'
import { adminUsersApi } from '@/lib/api'
import type { AdminUser } from '@/types/user'
import { PermissionGuard } from '@/components/permission-guard'
import { useLocale } from '@/contexts/locale-context'

export default function UsersPage() {
  const { t } = useLocale()
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
    if (!confirm(t.users.confirm_delete)) return
    await adminUsersApi.delete(id)
    load()
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">{t.users.title} <span className="text-sm text-muted-foreground">({total})</span></h1>
        <PermissionGuard code="admin.users.create">
          <Button size="sm" asChild>
            <Link href="/admin/users/new">
              <Plus className="mr-2 h-4 w-4" />
              {t.users.new}
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
              <TableHead>{t.users.username}</TableHead>
              <TableHead>{t.users.display_name}</TableHead>
              <TableHead>{t.users.email}</TableHead>
              <TableHead>{t.users.tenant}</TableHead>
              <TableHead>{t.users.provider}</TableHead>
              <TableHead>{t.common.status}</TableHead>
              <TableHead>{t.common.actions}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.display_name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.tenant_code}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{user.provider}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={user.enabled ? 'default' : 'outline'}>
                    {user.enabled ? t.common.enabled : t.common.disabled}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/admin/users/${user.id}`}>
                        <Pencil className="h-4 w-4" />
                      </Link>
                    </Button>
                    <PermissionGuard code="admin.users.delete">
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDelete(user.id)}>
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
