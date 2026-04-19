import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/store'
import { setUser } from '@/store'
import UserService from '@/services/user/user.service'
import type { UpdateActiveUserRequest, UpdateUserInfoRequest, UpdateUserRoleRequest } from '@/@types/user'

function useUser() {
  const dispatch = useAppDispatch()
  const userId = useAppSelector((state) => state.auth.userInfo.userId)
  const [loading, setLoading] = useState(false)

  // ─── Get user info ────────────────────────────────────────────────────────────
  const getUserInfo = async (targetUserId?: string) => {
    const id = targetUserId || userId
    if (!id) return { code: 'failed', message: 'Không tìm thấy userId', data: null }
    try {
      setLoading(true)
      const resp = await UserService.getUserInfo({ userId: id })
      // Sync profile into Redux if fetching own profile
      if (!targetUserId) {
        dispatch(
          setUser({
            fullName: resp.data.fullName,
            email: resp.data.email,
          })
        )
      }
      return { code: '0', message: 'success', data: resp.data }
    } catch (errors: any) {
      return {
        code: 'failed',
        message: errors?.response?.data?.message || errors.toString(),
        data: null,
      }
    } finally {
      setLoading(false)
    }
  }

  // ─── Update user info ─────────────────────────────────────────────────────────
  const updateInfo = async (values: UpdateUserInfoRequest) => {
    try {
      setLoading(true)
      const resp = await UserService.updateInfo(values)
      // Sync updated profile into Redux
      dispatch(
        setUser({
          fullName: resp.data.fullName,
          email: resp.data.email,
        })
      )
      return { code: '0', message: 'Cập nhật thông tin thành công!', data: resp.data }
    } catch (errors: any) {
      return {
        code: 'failed',
        message: errors?.response?.data?.message || errors.toString(),
        data: null,
      }
    } finally {
      setLoading(false)
    }
  }

  // ─── Admin: update active status ─────────────────────────────────────────────
  const updateActiveStatus = async (values: UpdateActiveUserRequest) => {
    try {
      const resp = await UserService.updateActiveStatus(values)
      return { code: '0', message: 'Cập nhật trạng thái thành công!', data: resp.data }
    } catch (errors: any) {
      return {
        code: 'failed',
        message: errors?.response?.data?.message || errors.toString(),
        data: null,
      }
    }
  }

  // ─── Admin: update role ───────────────────────────────────────────────────────
  const updateRole = async (values: UpdateUserRoleRequest) => {
    try {
      await UserService.updateRole(values)
      return { code: '0', message: 'Cập nhật vai trò thành công!' }
    } catch (errors: any) {
      return {
        code: 'failed',
        message: errors?.response?.data?.message || errors.toString(),
      }
    }
  }

  return {
    loading,
    getUserInfo,
    updateInfo,
    updateActiveStatus,
    updateRole,
  }
}

export default useUser
