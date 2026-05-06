import ApiService from '@/services/ApiService'
import type { BaseResponse } from '@/@types/user'
import type {
  ChatConversation,
  ChatMessageHistoryResponse,
  CreateConversationRequest,
  UpdateConversationRequest,
} from '@/@types/chat'
import { PERSIST_STORE_NAME } from '@/constants/app.constant'
import deepParseJson from '@/utils/deepParseJson'
import store from '@/store'

function getAccessToken(): string | null {
  const rawPersistData = localStorage.getItem(PERSIST_STORE_NAME)
  const persistData = deepParseJson(rawPersistData)
  let token = (persistData as any)?.auth?.session?.token
  if (!token) {
    const { auth } = store.getState()
    token = auth.session.token
  }
  return token || null
}

export const ChatService = {
  async createConversation(data: CreateConversationRequest) {
    const res = await ApiService.fetchData<
      CreateConversationRequest,
      BaseResponse<ChatConversation>
    >({
      url: '/api/chat/conversations',
      method: 'POST',
      data,
    })
    return res.data
  },

  async getConversations() {
    const res = await ApiService.fetchData<
      undefined,
      BaseResponse<ChatConversation[]>
    >({
      url: '/api/chat/conversations',
      method: 'GET',
    })
    return res.data
  },

  async getConversation(conversationId: number) {
    const res = await ApiService.fetchData<
      undefined,
      BaseResponse<ChatConversation>
    >({
      url: `/api/chat/conversations/${conversationId}`,
      method: 'GET',
    })
    return res.data
  },

  async updateConversation(conversationId: number, data: UpdateConversationRequest) {
    const res = await ApiService.fetchData<
      UpdateConversationRequest,
      BaseResponse<ChatConversation>
    >({
      url: `/api/chat/conversations/${conversationId}`,
      method: 'PUT',
      data,
    })
    return res.data
  },

  async deleteConversation(conversationId: number) {
    const res = await ApiService.fetchData<undefined, BaseResponse<void>>({
      url: `/api/chat/conversations/${conversationId}`,
      method: 'DELETE',
    })
    return res.data
  },

  async getMessages(conversationId: number, page = 0, size = 50) {
    const res = await ApiService.fetchData<
      undefined,
      BaseResponse<ChatMessageHistoryResponse>
    >({
      url: `/api/chat/conversations/${conversationId}/messages`,
      method: 'GET',
      params: { page, size },
    })
    return res.data
  },

  sendMessageStream(
    conversationId: number,
    content: string,
    onToken: (token: string) => void,
    onDone: () => void,
    onError: (error: string) => void,
  ): AbortController {
    const controller = new AbortController()
    const token = getAccessToken()

    fetch(`/api/chat/conversations/${conversationId}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ content }),
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) {
          const errorText = await response.text()
          onError(errorText || `HTTP ${response.status}`)
          return
        }

        const reader = response.body?.getReader()
        if (!reader) {
          onError('No readable stream')
          return
        }

        const decoder = new TextDecoder()
        let buffer = ''

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          buffer = lines.pop() || ''

          for (const line of lines) {
            if (line.startsWith('data:')) {
              const data = line.slice(5)
              if (data === '[DONE]') {
                onDone()
                return
              }
              onToken(data)
            } else if (line.startsWith('event:error')) {
              // Next data line will contain the error message
            } else if (line.startsWith('event:done')) {
              // Next data line will be [DONE]
            }
          }
        }

        // Stream ended without [DONE]
        onDone()
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          onError(err.message || 'Stream error')
        }
      })

    return controller
  },
}
