export interface AdminUser {
  id: number
  tenant_code: string
  username: string
  display_name: string
  email: string
  provider: string
  enabled: boolean
  created_at: string
  updated_at: string
}

export interface CreateUserRequest {
  tenant_code: string
  username: string
  password?: string
  display_name?: string
  email?: string
  provider?: string
  provider_id?: string
}

export interface UpdateUserRequest {
  display_name?: string
  email?: string
  enabled?: boolean
}
