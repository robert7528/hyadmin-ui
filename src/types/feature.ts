export interface Feature {
  id: number
  module_id: number
  name: string
  display_name: string
  icon: string
  path: string
  sort_order: number
  enabled: boolean
  created_at: string
  updated_at: string
}

export interface CreateFeatureRequest {
  module_id: number
  name: string
  display_name: string
  icon?: string
  path: string
  sort_order?: number
}

export interface UpdateFeatureRequest {
  display_name?: string
  icon?: string
  path?: string
  sort_order?: number
  enabled?: boolean
}
