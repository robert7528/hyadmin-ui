'use client'

import { useState } from 'react'
import { Button, Card, CardBody, CardHeader, Input } from '@heroui/react'
import { apiFetch } from '@/lib/api'

export default function ProfilePage() {
  const [displayName, setDisplayName] = useState('')
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  const handleUpdateName = async () => {
    setSaving(true)
    try {
      await apiFetch('/api/v1/profile/display-name', {
        method: 'PUT',
        body: JSON.stringify({ display_name: displayName }),
      })
      setMsg('顯示名稱已更新')
    } catch (e: unknown) {
      setMsg(e instanceof Error ? e.message : '更新失敗')
    } finally {
      setSaving(false)
    }
  }

  const handleChangePassword = async () => {
    setSaving(true)
    try {
      await apiFetch('/api/v1/profile/password', {
        method: 'PUT',
        body: JSON.stringify({ old_password: oldPassword, new_password: newPassword }),
      })
      setMsg('密碼已更新')
      setOldPassword('')
      setNewPassword('')
    } catch (e: unknown) {
      setMsg(e instanceof Error ? e.message : '更新失敗')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-4 max-w-md">
      <h1 className="text-xl font-semibold">個人設定</h1>

      <Card>
        <CardHeader><p className="text-sm font-medium">更新顯示名稱</p></CardHeader>
        <CardBody className="space-y-3">
          <Input
            label="顯示名稱"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
          <Button size="sm" color="primary" isLoading={saving} onClick={handleUpdateName}>
            更新
          </Button>
        </CardBody>
      </Card>

      <Card>
        <CardHeader><p className="text-sm font-medium">修改密碼</p></CardHeader>
        <CardBody className="space-y-3">
          <Input
            label="目前密碼"
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
          <Input
            label="新密碼"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <Button size="sm" color="primary" isLoading={saving} onClick={handleChangePassword}>
            變更密碼
          </Button>
        </CardBody>
      </Card>

      {msg && <p className="text-sm text-primary">{msg}</p>}
    </div>
  )
}
