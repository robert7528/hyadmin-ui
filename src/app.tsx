import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { RootLayout } from '@/layouts/root-layout'
import { ShellLayout } from '@/layouts/shell-layout'
import { LoginLayout } from '@/layouts/login-layout'
import { AuthGuard } from '@/components/auth-guard'

import HomePage from '@/pages/home'
import LoginPage from '@/pages/login'
import ForbiddenPage from '@/pages/forbidden'
import NotFoundPage from '@/pages/not-found'
import ProfilePage from '@/pages/profile'
import UsersPage from '@/pages/admin/users'
import NewUserPage from '@/pages/admin/users-new'
import RolesPage from '@/pages/admin/roles'
import NewRolePage from '@/pages/admin/roles-new'
import RolePermissionsPage from '@/pages/admin/role-permissions'
import ModulesPage from '@/pages/admin/modules'
import NewModulePage from '@/pages/admin/modules-new'
import ModuleEditPage from '@/pages/admin/module-edit'
import FeaturePermissionsPage from '@/pages/admin/feature-permissions'
import AuditLogsPage from '@/pages/admin/audit-logs'
import AppPage from '@/pages/app-page'

export default function App() {
  return (
    <BrowserRouter basename="/hyadmin">
      <Routes>
        <Route element={<RootLayout />}>
          {/* Public routes */}
          <Route element={<LoginLayout />}>
            <Route path="login" element={<LoginPage />} />
          </Route>
          <Route path="forbidden" element={<ForbiddenPage />} />

          {/* Protected routes */}
          <Route element={<AuthGuard />}>
            <Route element={<ShellLayout />}>
              <Route index element={<HomePage />} />
              <Route path="profile" element={<ProfilePage />} />

              <Route path="admin">
                <Route path="users" element={<UsersPage />} />
                <Route path="users/new" element={<NewUserPage />} />
                <Route path="roles" element={<RolesPage />} />
                <Route path="roles/new" element={<NewRolePage />} />
                <Route path="roles/:id" element={<RolePermissionsPage />} />
                <Route path="modules" element={<ModulesPage />} />
                <Route path="modules/new" element={<NewModulePage />} />
                <Route path="modules/:id" element={<ModuleEditPage />} />
                <Route path="features/:id" element={<FeaturePermissionsPage />} />
                <Route path="audit-logs" element={<AuditLogsPage />} />
              </Route>

              <Route path="app/:route/*" element={<AppPage />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
