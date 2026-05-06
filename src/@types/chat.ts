// ─── Enums ────────────────────────────────────────────────────────────────────
export type MessageRole = 'USER' | 'ASSISTANT' | 'SYSTEM'
export type AiProvider = 'OPENAI' | 'GEMINI' | 'CLAUDE'
export type EnglishLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'

// ─── Conversation ─────────────────────────────────────────────────────────────
export interface ChatConversation {
  id: number
  title: string
  englishLevel: EnglishLevel
  aiProvider: AiProvider
  model: string
  messageCount: number
  createdAt: string
  updatedAt: string
}

// ─── Message ──────────────────────────────────────────────────────────────────
export interface ChatMessage {
  id: number
  role: MessageRole
  content: string
  createdAt: string
}

// ─── Request DTOs ─────────────────────────────────────────────────────────────
export interface CreateConversationRequest {
  title?: string
  englishLevel: EnglishLevel
}

export interface SendMessageRequest {
  content: string
}

export interface UpdateConversationRequest {
  title: string
}

// ─── Response DTOs ────────────────────────────────────────────────────────────
export interface ChatMessageHistoryResponse {
  conversationId: number
  title: string
  englishLevel: EnglishLevel
  messages: ChatMessage[]
  hasMore: boolean
}
