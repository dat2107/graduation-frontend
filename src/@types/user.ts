// ─── Enums ────────────────────────────────────────────────────────────────────
export type UserRole = 'STUDENT' | 'TEACHER' | 'ADMIN'
export type UserGender = 'MALE' | 'FEMALE' | 'OTHER'
export type UserProvider = 'LOCAL' | 'GOOGLE' | 'FACEBOOK'

// ─── BE BaseResponse wrapper ───────────────────────────────────────────────────
export interface BaseResponse<T> {
  status: number
  message: string
  data: T
  timestamp: number
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

/** Matches BE: LoginRes */
export interface LoginResponse {
  accessToken: string
  refreshToken: string
  expiresIn: number
  userId: string
  username: string
  email: string
  role: UserRole
}

/** Matches BE: RefreshTokenRes */
export interface RefreshTokenResponse {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

/** Matches BE: RegisterReq */
export interface RegisterRequest {
  username: string
  password: string
  fullName: string
  email: string
  phone: string
  address?: string
  gender?: UserGender
  dob?: string // yyyy-MM-dd
}

/** Matches BE: ForgotPasswordReq */
export interface ForgotPasswordRequest {
  email: string
}

/** Matches BE: RefreshTokenReq */
export interface RefreshTokenRequest {
  refreshToken: string
}

// ─── User ─────────────────────────────────────────────────────────────────────

/** Matches BE: UserDTO */
export interface UserDTO {
  fullName: string
  dob: string | null // yyyy-MM-dd
  gender: UserGender | null
  email: string
  avatarUrl: string | null
}

/** Matches BE: UpdateAvatarReq */
export interface UpdateAvatarRequest {
  base64Image: string
}

/** Matches BE: UpdateUserInfoReq */
export interface UpdateUserInfoRequest {
  fullName?: string
  dob?: string // yyyy-MM-dd
  gender?: UserGender
  email?: string
}

/** Matches BE: UserInfoReq */
export interface UserInfoRequest {
  userId: string
}

// ─── Admin ────────────────────────────────────────────────────────────────────

/** Matches BE: UpdateActiveUserReq */
export interface UpdateActiveUserRequest {
  userId: string
  active: boolean
}

/** Matches BE: UpdateActiveUserRes */
export interface UpdateActiveUserResponse {
  userId: string
  active: boolean
}

/** Matches BE: UpdateUserRoleReq */
export interface UpdateUserRoleRequest {
  keycloakUserId: string
  newRole: UserRole
}

// ─── Admin User List ─────────────────────────────────────────────────────────

/** Matches BE: AdminUserRes */
export interface AdminUserRes {
  id: string
  username: string
  fullName: string
  email: string
  role: UserRole
  active: boolean
  provider: UserProvider
  keycloakUserId: string
  createdAt: string // yyyy-MM-dd HH:mm:ss
}

/** Matches BE: CreateTeacherReq */
export interface CreateTeacherRequest {
  username: string
  password: string
  fullName: string
  email: string
}

/** Matches BE: PageResponse<T> */
export interface PageResponse<T> {
  items: T[]
  totalItems: number
  totalPages: number
  page: number
  size: number
}
