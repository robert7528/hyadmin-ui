export interface Role {
  id: number
  tenant_code: string
  name: string
  description: string
  created_at: string
  updated_at: string
}

export interface CreateRoleRequest {
  tenant_code: string
  name: string
  description?: string
}

export interface UpdateRoleRequest {
  name?: string
  description?: string
}
