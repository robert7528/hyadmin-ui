export interface Permission {
  id: number
  feature_id: number
  code: string
  name: string
  description: string
  type: 'menu' | 'button' | 'api'
  sort_order: number
  created_at: string
  updated_at: string
}

export interface CreatePermissionRequest {
  feature_id: number
  code: string
  name: string
  description?: string
  type?: 'menu' | 'button' | 'api'
  sort_order?: number
}

export interface BatchCreatePermissionRequest {
  feature_id: number
  code_prefix: string
  suffixes: string[]
}
