'use client'

import { useEffect, useState } from 'react'
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  Chip,
} from '@heroui/react'
import { Search } from 'lucide-react'
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

const actionColors: Record<string, 'success' | 'warning' | 'danger' | 'default'> = {
  CREATE: 'success',
  UPDATE: 'warning',
  DELETE: 'danger',
  LOGIN: 'default',
  LOGOUT: 'default',
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
        <h1 className="text-xl font-semibold">操作稽核日誌 <span className="text-sm text-gray-400">({total})</span></h1>
        <div className="flex gap-2">
          <Input
            placeholder="搜尋資源..."
            value={resource}
            onChange={(e) => setResource(e.target.value)}
            startContent={<Search size={14} />}
            size="sm"
            className="w-48"
          />
          <Button size="sm" onClick={load}>查詢</Button>
        </div>
      </div>
      <Table aria-label="audit-logs" isStriped>
        <TableHeader>
          <TableColumn>時間</TableColumn>
          <TableColumn>操作者</TableColumn>
          <TableColumn>動作</TableColumn>
          <TableColumn>資源</TableColumn>
          <TableColumn>ID</TableColumn>
          <TableColumn>IP</TableColumn>
        </TableHeader>
        <TableBody isLoading={loading} items={logs}>
          {(log) => (
            <TableRow key={log.id}>
              <TableCell className="text-xs text-gray-500 whitespace-nowrap">
                {new Date(log.created_at).toLocaleString('zh-TW')}
              </TableCell>
              <TableCell>{log.username}</TableCell>
              <TableCell>
                <Chip size="sm" color={actionColors[log.action] ?? 'default'} variant="flat">
                  {log.action}
                </Chip>
              </TableCell>
              <TableCell className="font-mono text-xs">{log.resource}</TableCell>
              <TableCell className="text-xs">{log.resource_id}</TableCell>
              <TableCell className="text-xs text-gray-500">{log.ip}</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
