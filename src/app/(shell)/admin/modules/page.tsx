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
import { adminModulesApi } from '@/lib/api'
import type { Module } from '@/types/module'
import { PermissionGuard } from '@/components/permission-guard'
import { useLocale } from '@/contexts/locale-context'

export default function ModulesPage() {
  const { t } = useLocale()
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
    if (!confirm(t.modules.confirm_delete)) return
    await adminModulesApi.delete(id)
    load()
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">{t.modules.title}</h1>
        <PermissionGuard code="admin.modules.create">
          <Button size="sm" asChild>
            <Link href="/admin/modules/new">
              <Plus className="mr-2 h-4 w-4" />
              {t.modules.new}
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
              <TableHead>{t.modules.name}</TableHead>
              <TableHead>{t.modules.display_name}</TableHead>
              <TableHead>{t.modules.route}</TableHead>
              <TableHead>{t.modules.sort_order}</TableHead>
              <TableHead>{t.common.status}</TableHead>
              <TableHead>{t.common.actions}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {modules.map((mod) => (
              <TableRow key={mod.id}>
                <TableCell>{mod.name}</TableCell>
                <TableCell>{mod.display_name}</TableCell>
                <TableCell className="font-mono text-sm">{mod.route}</TableCell>
                <TableCell>{mod.sort_order}</TableCell>
                <TableCell>
                  <Badge variant={mod.enabled ? 'default' : 'outline'}>
                    {mod.enabled ? t.common.enabled : t.common.disabled}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/admin/modules/${mod.id}`}>
                        <Pencil className="h-4 w-4" />
                      </Link>
                    </Button>
                    <PermissionGuard code="admin.modules.delete">
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDelete(mod.id)}>
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
