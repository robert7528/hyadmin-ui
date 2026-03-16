'use client'

import { useEffect, useState } from 'react'
import { Search, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
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
import { apiFetch } from '@/lib/api'

interface AuditLog {
  id: number
  tenant_code: string
  user_id: number
  username: string
  action: string
  resource: string
  resource_id: string
  detail: string
  ip: string
  created_at: string
}

const actionVariant: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  CREATE: 'default',
  UPDATE: 'secondary',
  DELETE: 'destructive',
  LOGIN: 'outline',
  LOGOUT: 'outline',
}

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [resource, setResource] = useState('')

  const load = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (resource) params.set('resource', resource)
      const data = await apiFetch<{ logs: AuditLog[]; total: number }>(
        `/api/v1/admin/audit-logs?${params}`
      )
      setLogs(data.logs ?? [])
      setTotal(data.total)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">操作稽核日誌 <span className="text-sm text-muted-foreground">({total})</span></h1>
        <div className="flex gap-2">
          <div className="relative w-48">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜尋資源..."
              value={resource}
              onChange={(e) => setResource(e.target.value)}
              className="pl-8 h-9"
            />
          </div>
          <Button size="sm" onClick={load}>查詢</Button>
        </div>
      </div>
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>時間</TableHead>
              <TableHead>操作者</TableHead>
              <TableHead>動作</TableHead>
              <TableHead>資源</TableHead>
              <TableHead>ID</TableHead>
              <TableHead>IP</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.id}>
                <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                  {new Date(log.created_at).toLocaleString('zh-TW')}
                </TableCell>
                <TableCell>{log.username}</TableCell>
                <TableCell>
                  <Badge variant={actionVariant[log.action] ?? 'outline'}>
                    {log.action}
                  </Badge>
                </TableCell>
                <TableCell className="font-mono text-xs">{log.resource}</TableCell>
                <TableCell className="text-xs">{log.resource_id}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{log.ip}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}
