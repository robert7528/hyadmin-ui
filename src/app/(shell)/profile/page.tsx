'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, Input, Label, Button } from '@hysp/ui-kit'
import { apiFetch } from '@/lib/api'
import { useLocale } from '@/contexts/locale-context'

export default function ProfilePage() {
  const { t } = useLocale()
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
      setMsg(t.profile.name_updated)
    } catch (e: unknown) {
      setMsg(e instanceof Error ? e.message : t.common.update_failed)
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
      setMsg(t.profile.password_updated)
      setOldPassword('')
      setNewPassword('')
    } catch (e: unknown) {
      setMsg(e instanceof Error ? e.message : t.common.update_failed)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-4 max-w-md">
      <h1 className="text-xl font-semibold">{t.profile.title}</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">{t.profile.update_name_title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="display_name">{t.profile.display_name}</Label>
            <Input
              id="display_name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </div>
          <Button size="sm" disabled={saving} onClick={handleUpdateName}>
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t.profile.update}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">{t.profile.change_password_title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="old_password">{t.profile.old_password}</Label>
            <Input
              id="old_password"
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new_password">{t.profile.new_password}</Label>
            <Input
              id="new_password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <Button size="sm" disabled={saving} onClick={handleChangePassword}>
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t.profile.change_password}
          </Button>
        </CardContent>
      </Card>

      {msg && <p className="text-sm text-primary">{msg}</p>}
    </div>
  )
}
