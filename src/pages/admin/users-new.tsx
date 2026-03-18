import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { Card, CardContent, Input, Label, Button } from '@hysp/ui-kit'
import { adminUsersApi } from '@/lib/api'
import { useLocale } from '@/contexts/locale-context'

export default function NewUserPage() {
  const { t } = useLocale()
  const { action, label, error: commonError } = t.shared.common
  const { header: usersHeader, form: usersForm } = t.hyadmin.users
  const { form: loginForm } = t.hyadmin.login
  const navigate = useNavigate()
  const [form, setForm] = useState({
    tenant_code: '', username: '', password: '', display_name: '', email: '', provider: 'local',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [key]: e.target.value })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      await adminUsersApi.create(form)
      navigate('/admin/users')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : commonError.createFailed)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-lg">
      <h1 className="text-xl font-semibold mb-4">{usersHeader.buttonNew}</h1>
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="tenant_code">{label.tenantCode}</Label>
              <Input id="tenant_code" value={form.tenant_code} onChange={set('tenant_code')} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">{usersForm.labelUsername}</Label>
              <Input id="username" value={form.username} onChange={set('username')} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{loginForm.labelPassword}</Label>
              <Input id="password" type="password" value={form.password} onChange={set('password')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="display_name">{usersForm.labelDisplayName}</Label>
              <Input id="display_name" value={form.display_name} onChange={set('display_name')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={form.email} onChange={set('email')} />
            </div>
            {error && <p className="text-destructive text-sm">{error}</p>}
            <div className="flex gap-2 pt-2">
              <Button type="submit" disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {action.create}
              </Button>
              <Button variant="ghost" type="button" onClick={() => navigate(-1)}>{action.cancel}</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
