import ApiService from '@/services/ApiService'
import type { BaseResponse } from '@/@types/user'
import type {
  CreateIeltsWritingTaskRequest,
  IeltsWritingSubmission,
  IeltsWritingTask,
  IeltsWritingTaskManage,
  SubmitIeltsWritingRequest,
  UpdateIeltsWritingTaskRequest,
} from '@/@types/ieltsWriting'

export const IeltsWritingService = {
  async getTasks(params?: { taskType?: string; topic?: string }) {
    const res = await ApiService.fetchData<undefined, BaseResponse<IeltsWritingTask[]>>({
      url: '/api/ielts-writing/tasks',
      method: 'GET',
      params: params ?? {},
    })
    return res.data
  },

  async getTask(taskId: number) {
    const res = await ApiService.fetchData<undefined, BaseResponse<IeltsWritingTask>>({
      url: `/api/ielts-writing/tasks/${taskId}`,
      method: 'GET',
    })
    return res.data
  },

  // ─── Teacher Management ──────────────────────────────────────────────────

  /** POST /api/ielts-writing/tasks — Tạo task mới (TEACHER/ADMIN) */
  async createTask(data: CreateIeltsWritingTaskRequest) {
    const res = await ApiService.fetchData<CreateIeltsWritingTaskRequest, BaseResponse<IeltsWritingTaskManage>>({
      url: '/api/ielts-writing/tasks',
      method: 'POST',
      data,
    })
    return res.data
  },

  /** PUT /api/ielts-writing/tasks/:taskId — Cập nhật (partial, chỉ field non-null) */
  async updateTask(taskId: number, data: UpdateIeltsWritingTaskRequest) {
    const res = await ApiService.fetchData<UpdateIeltsWritingTaskRequest, BaseResponse<IeltsWritingTaskManage>>({
      url: `/api/ielts-writing/tasks/${taskId}`,
      method: 'PUT',
      data,
    })
    return res.data
  },

  /** DELETE /api/ielts-writing/tasks/:taskId — Xóa (lỗi nếu đã có submissions) */
  async deleteTask(taskId: number) {
    const res = await ApiService.fetchData<null, BaseResponse<null>>({
      url: `/api/ielts-writing/tasks/${taskId}`,
      method: 'DELETE',
    })
    return res.data
  },

  async submit(data: SubmitIeltsWritingRequest) {
    const res = await ApiService.fetchData<SubmitIeltsWritingRequest, BaseResponse<IeltsWritingSubmission>>({
      url: '/api/ielts-writing/submit',
      method: 'POST',
      data,
    })
    return res.data
  },

  async getSubmission(id: number) {
    const res = await ApiService.fetchData<undefined, BaseResponse<IeltsWritingSubmission>>({
      url: `/api/ielts-writing/${id}`,
      method: 'GET',
    })
    return res.data
  },

  async getHistory() {
    const res = await ApiService.fetchData<undefined, BaseResponse<IeltsWritingSubmission[]>>({
      url: '/api/ielts-writing/history',
      method: 'GET',
    })
    return res.data
  },
}
