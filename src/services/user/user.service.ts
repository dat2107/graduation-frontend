import ApiService from '@/services/ApiService'
import type {
  BaseResponse,
  UpdateActiveUserRequest,
  UpdateActiveUserResponse,
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
}

export default UserService
