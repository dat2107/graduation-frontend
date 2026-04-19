import { useNavigate } from 'react-router-dom'
import appConfig from '@/configs/app.config'
import { REDIRECT_URL_KEY } from '@/constants/app.constant'
import { api } from '@/services/Service'
import {
  setUser,
  setUserInfo,
  signInSuccess,
  signOutSuccess,
  updateSession,
  useAppDispatch,
  useAppSelector,
} from '@/store'
import { AuthService } from '@/services/auth/auth.service'
import type { SignInRequest } from '@/@types/auth'
import type { ForgotPasswordRequest, RegisterRequest } from '@/@types/user'
import useQuery from './useQuery'

function useAuth() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { token, signedIn, refreshToken } = useAppSelector((state) => state.auth.session)
  const userId = useAppSelector((state) => state.auth.userInfo.userId)
  const query = useQuery()

  // ─── Sign In ────────────────────────────────────────────────────────────────
  const signIn = async (values: SignInRequest) => {
    try {
      const resp = await AuthService.signIn(values)
      // resp = BaseResponse<LoginResponse>
      const loginData = resp.data
      dispatch(
        signInSuccess({
          token: loginData.accessToken,
          refreshToken: loginData.refreshToken,
          expireTime: loginData.expiresIn,
        })
      )
      dispatch(
        setUserInfo({
          userId: loginData.userId,
          name: loginData.username,
          email: loginData.email,
          role: loginData.role,
          googleLogin: false,
        })
      )
      const redirectUrl = query.get(REDIRECT_URL_KEY)
      navigate(redirectUrl || appConfig.authenticatedEntryPath)
      return { code: '0', message: 'success' }
    } catch (errors: any) {
      return {
        code: 'failed',
        message: errors?.response?.data?.message || errors.toString(),
      }
    }
  }

  // ─── Sign Up ─────────────────────────────────────────────────────────────────
  const signUp = async (values: RegisterRequest) => {
    try {
      const resp = await AuthService.register(values)
      return { code: '0', message: resp.message || 'Đăng ký thành công! Vui lòng kiểm tra email xác nhận.' }
    } catch (errors: any) {
      return {
        code: 'failed',
        message: errors?.response?.data?.message || errors.toString(),
      }
    }
  }

  // ─── Forgot Password ──────────────────────────────────────────────────────────
  const forgotPassword = async (values: ForgotPasswordRequest) => {
    try {
      await AuthService.forgotPassword(values)
      return { code: '0', message: 'Email đặt lại mật khẩu đã được gửi. Vui lòng kiểm tra hộp thư.' }
    } catch (errors: any) {
      return {
        code: 'failed',
        message: errors?.response?.data?.message || errors.toString(),
      }
    }
  }

  // ─── Refresh Token ────────────────────────────────────────────────────────────
  const refreshAccessToken = async () => {
    if (!refreshToken) return false
    try {
      const resp = await AuthService.refreshToken({ refreshToken })
      const newSession = resp.data
      dispatch(
        updateSession({
          token: newSession.accessToken,
          refreshToken: newSession.refreshToken,
          expireTime: newSession.expiresIn,
        })
      )
      return true
    } catch {
      handleSignOut()
      return false
    }
  }

  // ─── Sign Out ─────────────────────────────────────────────────────────────────
  const handleSignOut = () => {
    dispatch(api.util.resetApiState())
    dispatch(signOutSuccess())
    dispatch(setUserInfo({ googleLogin: false, name: '', role: '', email: '', userId }))
    dispatch(setUser({ fullName: '', role: [], email: '' }))
    navigate(appConfig.unAuthenticatedEntryPath)
  }

  const signOut = async () => {
    handleSignOut()
  }

  return {
    authenticated: token && signedIn,
    signIn,
    signUp,
    signOut,
    forgotPassword,
    refreshAccessToken,
  }
}

export default useAuth
