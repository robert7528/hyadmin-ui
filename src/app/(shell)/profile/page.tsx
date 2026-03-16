'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
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
        <CardHeader>
          <CardTitle className="text-sm font-medium">更新顯示名稱</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="display_name">顯示名稱</Label>
            <Input
              id="display_name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </div>
          <Button size="sm" disabled={saving} onClick={handleUpdateName}>
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            更新
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">修改密碼</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="old_password">目前密碼</Label>
            <Input
              id="old_password"
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new_password">新密碼</Label>
            <Input
              id="new_password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <Button size="sm" disabled={saving} onClick={handleChangePassword}>
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            變更密碼
          </Button>
        </CardContent>
      </Card>

      {msg && <p className="text-sm text-primary">{msg}</p>}
    </div>
  )
}
