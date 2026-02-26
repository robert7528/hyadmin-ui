export interface LoginRequest {
  provider?: string   // default "local"
  tenant_code: string
  username: string
  password: string
}

export interface LoginResponse {
  token: string
  provider: string
}
