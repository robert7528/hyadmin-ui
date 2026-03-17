'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react'
import { Button, Badge, Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@hysp/ui-kit'
import { adminModulesApi } from '@/lib/api'
import type { Module } from '@/types/module'
import { PermissionGuard } from '@/components/permission-guard'
import { useLocale } from '@/contexts/locale-context'

export default function ModulesPage() {
  const { t } = useLocale()
  const { label, status } = t.shared.common
  const { header: modulesHeader, form: modulesForm, confirm: modulesConfirm } = t.hyadmin.modules
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
    if (!confirm(modulesConfirm.delete)) return
    await adminModulesApi.delete(id)
    load()
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">{modulesHeader.title}</h1>
        <PermissionGuard code="admin.modules.create">
          <Button size="sm" asChild>
            <Link href="/admin/modules/new">
              <Plus className="mr-2 h-4 w-4" />
              {modulesHeader.buttonNew}
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
              <TableHead>{modulesForm.labelName}</TableHead>
              <TableHead>{modulesForm.labelDisplayName}</TableHead>
              <TableHead>{modulesForm.labelRoute}</TableHead>
              <TableHead>{modulesForm.labelSortOrder}</TableHead>
              <TableHead>{label.status}</TableHead>
              <TableHead>{label.actions}</TableHead>
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
                    {mod.enabled ? status.enabled : status.disabled}
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
