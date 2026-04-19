import ApiService from '@/services/ApiService'
import type {
  BaseResponse,
  ForgotPasswordRequest,
  LoginResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  RegisterRequest,
} from '@/@types/user'
import type { SignInRequest } from '@/@types/auth'

export const AuthService = {
  /** POST /api/auth/login */
  async signIn(data: SignInRequest) {
    const res = await ApiService.fetchData<SignInRequest, BaseResponse<LoginResponse>>({
      url: '/api/auth/login',
      method: 'POST',
      data,
    })
    return res.data // BaseResponse<LoginResponse>
  },

  /** POST /api/auth/register */
  async register(data: RegisterRequest) {
    const res = await ApiService.fetchData<RegisterRequest, BaseResponse<null>>({
      url: '/api/auth/register',
      method: 'POST',
      data,
    })
    return res.data // BaseResponse<null>
  },

  /** POST /api/auth/refresh */
  async refreshToken(data: RefreshTokenRequest) {
    const res = await ApiService.fetchData<RefreshTokenRequest, BaseResponse<RefreshTokenResponse>>({
      url: '/api/auth/refresh',
      method: 'POST',
      data,
    })
    return res.data // BaseResponse<RefreshTokenResponse>
  },

  /** POST /api/auth/forgot-password */
  async forgotPassword(data: ForgotPasswordRequest) {
    const res = await ApiService.fetchData<ForgotPasswordRequest, BaseResponse<null>>({
      url: '/api/auth/forgot-password',
      method: 'POST',
      data,
    })
    return res.data // BaseResponse<null>
  },
}
