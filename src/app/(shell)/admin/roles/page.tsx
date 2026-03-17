'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Settings, Trash2, Loader2 } from 'lucide-react'
import { Button, Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@hysp/ui-kit'
import { adminRolesApi } from '@/lib/api'
import type { Role } from '@/types/role'
import { PermissionGuard } from '@/components/permission-guard'
import { useLocale } from '@/contexts/locale-context'

export default function RolesPage() {
  const { t } = useLocale()
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
    if (!confirm(t.roles.confirm_delete)) return
    await adminRolesApi.delete(id)
    load()
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">{t.roles.title}</h1>
        <PermissionGuard code="admin.roles.create">
          <Button size="sm" asChild>
            <Link href="/admin/roles/new">
              <Plus className="mr-2 h-4 w-4" />
              {t.roles.new}
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
              <TableHead>{t.roles.name}</TableHead>
              <TableHead>{t.roles.description}</TableHead>
              <TableHead>{t.roles.tenant}</TableHead>
              <TableHead>{t.common.actions}</TableHead>
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
                    <Button variant="ghost" size="icon" title={t.roles.permissions_title} asChild>
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
