import ApiService from '@/services/ApiService'
import type {
  AdminUserRes,
  BaseResponse,
  CreateTeacherRequest,
  PageResponse,
  UpdateActiveUserRequest,
  UpdateActiveUserResponse,
  UpdateAvatarRequest,
  UpdateUserInfoRequest,
  UpdateUserRoleRequest,
  UserDTO,
  UserInfoRequest,
} from '@/@types/user'

const UserService = {
  /** POST /api/users/getInfo */
  async getUserInfo(data: UserInfoRequest) {
    const res = await ApiService.fetchData<UserInfoRequest, BaseResponse<UserDTO>>({
      url: '/api/users/getInfo',
      method: 'POST',
      data,
    })
    return res.data // BaseResponse<UserDTO>
  },

  /** PUT /api/users/update-info */
  async updateInfo(data: UpdateUserInfoRequest) {
    const res = await ApiService.fetchData<UpdateUserInfoRequest, BaseResponse<UserDTO>>({
      url: '/api/users/update-info',
      method: 'PUT',
      data,
    })
    return res.data // BaseResponse<UserDTO>
  },

  /** PUT /api/users/update-user-active-satus (typo in BE) */
  async updateActiveStatus(data: UpdateActiveUserRequest) {
    const res = await ApiService.fetchData<UpdateActiveUserRequest, BaseResponse<UpdateActiveUserResponse>>({
      url: '/api/users/update-user-active-satus',
      method: 'PUT',
      data,
    })
    return res.data // BaseResponse<UpdateActiveUserResponse>
  },

  /** PUT /api/users/update-role */
  async updateRole(data: UpdateUserRoleRequest) {
    const res = await ApiService.fetchData<UpdateUserRoleRequest, BaseResponse<null>>({
      url: '/api/users/update-role',
      method: 'PUT',
      data,
    })
    return res.data // BaseResponse<null>
  },

  /** GET /api/users — Admin: list all users (paginated) */
  async getAllUsers(params: { page?: number; size?: number; search?: string; role?: string }) {
    const res = await ApiService.fetchData<null, BaseResponse<PageResponse<AdminUserRes>>>({
      url: '/api/users',
      method: 'GET',
      params,
    })
    return res.data // BaseResponse<PageResponse<AdminUserRes>>
  },

  /** POST /api/users/create-teacher — Admin: create teacher account */
  async createTeacher(data: CreateTeacherRequest) {
    const res = await ApiService.fetchData<CreateTeacherRequest, BaseResponse<AdminUserRes>>({
      url: '/api/users/create-teacher',
      method: 'POST',
      data,
    })
    return res.data // BaseResponse<AdminUserRes>
  },

  /** PUT /api/users/update-avatar */
  async updateAvatar(data: UpdateAvatarRequest) {
    const res = await ApiService.fetchData<UpdateAvatarRequest, BaseResponse<UserDTO>>({
      url: '/api/users/update-avatar',
      method: 'PUT',
      data,
    })
    return res.data // BaseResponse<UserDTO>
  },
}

export default UserService
