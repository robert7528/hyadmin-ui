import Cookies from 'js-cookie'
import type { LoginRequest, LoginResponse } from '@/types/auth'
import type { Module } from '@/types/module'
import type { Feature, CreateFeatureRequest, UpdateFeatureRequest } from '@/types/feature'
import type { AdminUser, CreateUserRequest, UpdateUserRequest } from '@/types/user'
import type { Role, CreateRoleRequest, UpdateRoleRequest } from '@/types/role'
import type { Permission, CreatePermissionRequest, BatchCreatePermissionRequest } from '@/types/permission'

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080'
const TOKEN_KEY = 'hyadmin_token'
const TENANT_KEY = 'hyadmin_tenant'

// ── Token management ─────────────────────────────────────────────────────────

export function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return sessionStorage.getItem(TOKEN_KEY) ?? Cookies.get(TOKEN_KEY) ?? null
}

export function setToken(token: string, tenantCode?: string): void {
  sessionStorage.setItem(TOKEN_KEY, token)
  Cookies.set(TOKEN_KEY, token, { path: '/', sameSite: 'strict' })
  if (tenantCode) {
    sessionStorage.setItem(TENANT_KEY, tenantCode)
    Cookies.set(TENANT_KEY, tenantCode, { path: '/', sameSite: 'strict' })
  }
}

export function clearToken(): void {
  sessionStorage.removeItem(TOKEN_KEY)
  sessionStorage.removeItem(TENANT_KEY)
  Cookies.remove(TOKEN_KEY, { path: '/' })
  Cookies.remove(TENANT_KEY, { path: '/' })
}

export function getTenantCode(): string {
  if (typeof window === 'undefined') return ''
  return sessionStorage.getItem(TENANT_KEY) ?? Cookies.get(TENANT_KEY) ?? ''
}

// ── Fetch wrapper ─────────────────────────────────────────────────────────────

export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getToken()
  const tenantCode = getTenantCode()

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(init.headers as Record<string, string>),
  }
  if (token) headers['Authorization'] = `Bearer ${token}`
  if (tenantCode) headers['X-Tenant-ID'] = tenantCode

  const res = await fetch(`${API_BASE}${path}`, { ...init, headers })

  if (res.status === 401) {
    clearToken()
    if (typeof window !== 'undefined') {
      window.location.href = '/hyadmin/login'
    }
    throw new Error('Unauthorized')
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error ?? `HTTP ${res.status}`)
  }

  return res.json() as Promise<T>
}

// ── Auth API ──────────────────────────────────────────────────────────────────

export const authApi = {
  login: (req: LoginRequest) =>
    apiFetch<LoginResponse>('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify(req),
    }),
  logout: () => apiFetch('/api/v1/auth/logout', { method: 'POST' }),
}

// ── Modules API ───────────────────────────────────────────────────────────────

export const modulesApi = {
  list: () => apiFetch<{ modules: Module[] }>('/api/v1/modules'),
}

// ── Features API ──────────────────────────────────────────────────────────────

export const featuresApi = {
  listByModule: (moduleId: number) =>
    apiFetch<{ features: Feature[] }>(`/api/v1/features?module_id=${moduleId}`),
}

// ── Permissions API (user) ────────────────────────────────────────────────────

export const permissionsApi = {
  me: () => apiFetch<{ permissions: string[] }>('/api/v1/permissions/me'),
}

// ── Admin: Modules ────────────────────────────────────────────────────────────

export const adminModulesApi = {
  list: () => apiFetch<{ modules: Module[] }>('/api/v1/admin/modules'),
  get: (id: number) => apiFetch<Module>(`/api/v1/admin/modules/${id}`),
  create: (data: Partial<Module>) =>
    apiFetch<Module>('/api/v1/admin/modules', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: Partial<Module>) =>
    apiFetch(`/api/v1/admin/modules/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) =>
    apiFetch(`/api/v1/admin/modules/${id}`, { method: 'DELETE' }),
}

// ── Admin: Features ───────────────────────────────────────────────────────────

export const adminFeaturesApi = {
  listByModule: (moduleId: number) =>
    apiFetch<{ features: Feature[] }>(`/api/v1/admin/modules/${moduleId}/features`),
  get: (id: number) => apiFetch<Feature>(`/api/v1/admin/features/${id}`),
  create: (moduleId: number, data: CreateFeatureRequest) =>
    apiFetch<Feature>(`/api/v1/admin/modules/${moduleId}/features`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: number, data: UpdateFeatureRequest) =>
    apiFetch(`/api/v1/admin/features/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) =>
    apiFetch(`/api/v1/admin/features/${id}`, { method: 'DELETE' }),
  listPermissions: (id: number) =>
    apiFetch<{ permissions: Permission[] }>(`/api/v1/admin/features/${id}/permissions`),
  createPermission: (id: number, data: CreatePermissionRequest) =>
    apiFetch<Permission>(`/api/v1/admin/features/${id}/permissions`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  batchCreatePermissions: (id: number, data: BatchCreatePermissionRequest) =>
    apiFetch<{ permissions: Permission[] }>(`/api/v1/admin/features/${id}/permissions/batch`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
}

// ── Admin: Permissions ────────────────────────────────────────────────────────

export const adminPermissionsApi = {
  update: (id: number, data: Partial<Permission>) =>
    apiFetch(`/api/v1/admin/permissions/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) =>
    apiFetch(`/api/v1/admin/permissions/${id}`, { method: 'DELETE' }),
}

// ── Admin: Users ──────────────────────────────────────────────────────────────

export const adminUsersApi = {
  list: (tenantCode?: string, page = 1, pageSize = 20) =>
    apiFetch<{ users: AdminUser[]; total: number }>(
      `/api/v1/admin/users?tenant_code=${tenantCode ?? ''}&page=${page}&page_size=${pageSize}`
    ),
  get: (id: number) => apiFetch<AdminUser>(`/api/v1/admin/users/${id}`),
  create: (data: CreateUserRequest) =>
    apiFetch<AdminUser>('/api/v1/admin/users', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: UpdateUserRequest) =>
    apiFetch(`/api/v1/admin/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) =>
    apiFetch(`/api/v1/admin/users/${id}`, { method: 'DELETE' }),
}

// ── Admin: Roles ──────────────────────────────────────────────────────────────

export const adminRolesApi = {
  list: (tenantCode?: string) =>
    apiFetch<{ roles: Role[] }>(`/api/v1/admin/roles?tenant_code=${tenantCode ?? ''}`),
  get: (id: number) =>
    apiFetch<{ role: Role; permission_codes: string[] }>(`/api/v1/admin/roles/${id}`),
  create: (data: CreateRoleRequest) =>
    apiFetch<Role>('/api/v1/admin/roles', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: UpdateRoleRequest) =>
    apiFetch(`/api/v1/admin/roles/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) =>
    apiFetch(`/api/v1/admin/roles/${id}`, { method: 'DELETE' }),
  assignPermissions: (id: number, codes: string[]) =>
    apiFetch(`/api/v1/admin/roles/${id}/permissions`, {
      method: 'PUT',
      body: JSON.stringify({ codes }),
    }),
  assignUsers: (id: number, userIds: number[]) =>
    apiFetch(`/api/v1/admin/roles/${id}/users`, {
      method: 'PUT',
      body: JSON.stringify({ user_ids: userIds }),
    }),
}
