import { useCallback, useEffect, useRef, useState } from 'react'
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Group,
  Loader,
  Menu,
  Modal,
  ScrollArea,
  Select,
  Stack,
  Text,
  Textarea,
  TextInput,
  Title,
  Tooltip,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import {
  IconDotsVertical,
  IconEdit,
  IconMessageChatbot,
  IconPlus,
  IconSend,
  IconTrash,
} from '@tabler/icons-react'
import { ChatService } from '@/services/chat/chat.service'
import type {
  ChatConversation,
  ChatMessage,
  EnglishLevel,
} from '@/@types/chat'
import styles from './AiChatPage.module.css'

const LEVEL_OPTIONS = [
  { value: 'A1', label: 'A1 - Beginner' },
  { value: 'A2', label: 'A2 - Elementary' },
  { value: 'B1', label: 'B1 - Intermediate' },
  { value: 'B2', label: 'B2 - Upper Intermediate' },
  { value: 'C1', label: 'C1 - Advanced' },
  { value: 'C2', label: 'C2 - Proficiency' },
]

const levelColorMap: Record<string, string> = {
  A1: 'green',
  A2: 'teal',
  B1: 'blue',
  B2: 'indigo',
  C1: 'violet',
  C2: 'grape',
}

export default function AiChatPage() {
  // ── State ────────────────────────────────────────────────────────────────────
  const [conversations, setConversations] = useState<ChatConversation[]>([])
  const [activeConvId, setActiveConvId] = useState<number | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [streaming, setStreaming] = useState(false)
  const [loadingConversations, setLoadingConversations] = useState(true)
  const [loadingMessages, setLoadingMessages] = useState(false)

  // New conversation modal
  const [newConvOpened, { open: openNewConv, close: closeNewConv }] = useDisclosure(false)
  const [newLevel, setNewLevel] = useState<EnglishLevel>('B1')
  const [newTitle, setNewTitle] = useState('')

  // Rename modal
  const [renameOpened, { open: openRename, close: closeRename }] = useDisclosure(false)
  const [renameTitle, setRenameTitle] = useState('')
  const [renameConvId, setRenameConvId] = useState<number | null>(null)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const abortRef = useRef<AbortController | null>(null)
  const streamingContentRef = useRef('')

  // ── Load conversations ───────────────────────────────────────────────────────
  const loadConversations = useCallback(async () => {
    setLoadingConversations(true)
    try {
      const res = await ChatService.getConversations()
      if (res?.status === 200 && res.data) {
        setConversations(res.data)
      }
    } catch {
      // silent
    } finally {
      setLoadingConversations(false)
    }
  }, [])

  useEffect(() => {
    loadConversations()
  }, [loadConversations])

  // ── Load messages for active conversation ────────────────────────────────────
  useEffect(() => {
    if (!activeConvId) {
      setMessages([])
      return
    }

    const loadMessages = async () => {
      setLoadingMessages(true)
      try {
        const res = await ChatService.getMessages(activeConvId)
        if (res?.status === 200 && res.data) {
          setMessages(res.data.messages)
        }
      } catch {
        // silent
      } finally {
        setLoadingMessages(false)
      }
    }
    loadMessages()
  }, [activeConvId])

  // ── Auto-scroll to bottom ────────────────────────────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // ── Create conversation ──────────────────────────────────────────────────────
  const handleCreateConversation = async () => {
    try {
      const res = await ChatService.createConversation({
        title: newTitle.trim() || undefined,
        englishLevel: newLevel,
      })
      if (res?.status === 200 && res.data) {
        setConversations((prev) => [res.data, ...prev])
        setActiveConvId(res.data.id)
        setMessages([])
      }
    } catch {
      // silent
    }
    closeNewConv()
    setNewTitle('')
    setNewLevel('B1')
  }

  // ── Delete conversation ──────────────────────────────────────────────────────
  const handleDelete = async (convId: number) => {
    try {
      await ChatService.deleteConversation(convId)
      setConversations((prev) => prev.filter((c) => c.id !== convId))
      if (activeConvId === convId) {
        setActiveConvId(null)
        setMessages([])
      }
    } catch {
      // silent
    }
  }

  // ── Rename conversation ──────────────────────────────────────────────────────
  const handleRename = async () => {
    if (!renameConvId || !renameTitle.trim()) return
    try {
      const res = await ChatService.updateConversation(renameConvId, {
        title: renameTitle.trim(),
      })
      if (res?.status === 200 && res.data) {
        setConversations((prev) =>
          prev.map((c) => (c.id === renameConvId ? { ...c, title: res.data.title } : c)),
        )
      }
    } catch {
      // silent
    }
    closeRename()
  }

  // ── Send message (SSE stream) ────────────────────────────────────────────────
  const handleSend = () => {
    if (!input.trim() || !activeConvId || streaming) return

    const userContent = input.trim()
    setInput('')

    // Optimistic: add user message immediately
    const tempUserMsg: ChatMessage = {
      id: Date.now(),
      role: 'USER',
      content: userContent,
      createdAt: new Date().toISOString(),
    }
    setMessages((prev) => [...prev, tempUserMsg])

    // Add empty assistant message placeholder
    const tempAssistantMsg: ChatMessage = {
      id: Date.now() + 1,
      role: 'ASSISTANT',
      content: '',
      createdAt: new Date().toISOString(),
    }
    setMessages((prev) => [...prev, tempAssistantMsg])

    setStreaming(true)
    streamingContentRef.current = ''

    const controller = ChatService.sendMessageStream(
      activeConvId,
      userContent,
      // onToken
      (token) => {
        streamingContentRef.current += token
        setMessages((prev) => {
          const updated = [...prev]
          const last = updated[updated.length - 1]
          if (last && last.role === 'ASSISTANT') {
            updated[updated.length - 1] = {
              ...last,
              content: streamingContentRef.current,
            }
          }
          return updated
        })
      },
      // onDone
      () => {
        setStreaming(false)
        // Update conversation message count
        setConversations((prev) =>
          prev.map((c) =>
            c.id === activeConvId
              ? { ...c, messageCount: c.messageCount + 2, updatedAt: new Date().toISOString() }
              : c,
          ),
        )
      },
      // onError
      (error) => {
        setStreaming(false)
        setMessages((prev) => {
          const updated = [...prev]
          const last = updated[updated.length - 1]
          if (last && last.role === 'ASSISTANT' && !last.content) {
            updated[updated.length - 1] = {
              ...last,
              content: `Error: ${error}`,
            }
          }
          return updated
        })
      },
    )

    abortRef.current = controller
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const activeConv = conversations.find((c) => c.id === activeConvId)

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className={styles.chatLayout}>
      {/* ── Sidebar ──────────────────────────────────────────────────────── */}
      <div className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <Button
            fullWidth
            leftSection={<IconPlus size={16} />}
            onClick={openNewConv}
            variant="light"
          >
            Cuộc hội thoại mới
          </Button>
        </div>

        <div className={styles.conversationList}>
          {loadingConversations ? (
            <Stack align="center" py="xl">
              <Loader size="sm" />
            </Stack>
          ) : conversations.length === 0 ? (
            <Text size="sm" c="dimmed" ta="center" py="xl">
              Chưa có cuộc hội thoại nào
            </Text>
          ) : (
            conversations.map((conv) => (
              <Group
                key={conv.id}
                className={`${styles.conversationItem} ${
                  conv.id === activeConvId ? styles.conversationItemActive : ''
                }`}
                justify="space-between"
                wrap="nowrap"
                onClick={() => setActiveConvId(conv.id)}
              >
                <Box style={{ flex: 1, minWidth: 0 }}>
                  <Text size="sm" fw={500} truncate="end">
                    {conv.title}
                  </Text>
                  <Group gap={4} mt={2}>
                    <Badge
                      size="xs"
                      color={levelColorMap[conv.englishLevel] ?? 'gray'}
                      variant="light"
                    >
                      {conv.englishLevel}
                    </Badge>
                    <Text size="xs" c="dimmed">
                      {conv.messageCount} tin nhắn
                    </Text>
                  </Group>
                </Box>

                <Menu shadow="md" width={140} position="bottom-end" withArrow>
                  <Menu.Target>
                    <ActionIcon
                      size="sm"
                      variant="subtle"
                      color="gray"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <IconDotsVertical size={14} />
                    </ActionIcon>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Item
                      leftSection={<IconEdit size={14} />}
                      onClick={(e) => {
                        e.stopPropagation()
                        setRenameConvId(conv.id)
                        setRenameTitle(conv.title)
                        openRename()
                      }}
                    >
                      Đổi tên
                    </Menu.Item>
                    <Menu.Item
                      leftSection={<IconTrash size={14} />}
                      color="red"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDelete(conv.id)
                      }}
                    >
                      Xóa
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              </Group>
            ))
          )}
        </div>
      </div>

      {/* ── Main Chat Area ───────────────────────────────────────────────── */}
      <div className={styles.chatMain}>
        {!activeConvId ? (
          <div className={styles.emptyState}>
            <IconMessageChatbot size={48} stroke={1.2} />
            <Title order={3}>AI English Chatbot</Title>
            <Text size="sm">
              Chọn cuộc hội thoại hoặc tạo mới để bắt đầu luyện tiếng Anh
            </Text>
            <Button
              leftSection={<IconPlus size={16} />}
              onClick={openNewConv}
              mt="sm"
            >
              Tạo cuộc hội thoại
            </Button>
          </div>
        ) : (
          <>
            {/* Header */}
            <Group
              px="lg"
              py="sm"
              justify="space-between"
              style={{ borderBottom: '1px solid var(--mantine-color-gray-3)' }}
            >
              <Group gap="sm">
                <Text fw={600}>{activeConv?.title}</Text>
                <Badge
                  size="sm"
                  color={levelColorMap[activeConv?.englishLevel ?? 'B1']}
                  variant="light"
                >
                  {activeConv?.englishLevel}
                </Badge>
              </Group>
              <Text size="xs" c="dimmed">
                {activeConv?.aiProvider} / {activeConv?.model}
              </Text>
            </Group>

            {/* Messages */}
            <ScrollArea className={styles.messagesArea} type="auto">
              {loadingMessages ? (
                <Stack align="center" py="xl">
                  <Loader size="sm" />
                </Stack>
              ) : messages.length === 0 ? (
                <Stack align="center" py="xl" gap="xs">
                  <Text size="lg">👋</Text>
                  <Text size="sm" c="dimmed">
                    Hãy gửi tin nhắn đầu tiên bằng tiếng Anh!
                  </Text>
                </Stack>
              ) : (
                <Stack gap="sm">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`${styles.messageBubble} ${
                        msg.role === 'USER'
                          ? styles.userBubble
                          : styles.assistantBubble
                      }`}
                    >
                      {msg.content ||
                        (streaming && msg.role === 'ASSISTANT' && (
                          <div className={styles.typingDots}>
                            <span className={styles.typingDot} />
                            <span className={styles.typingDot} />
                            <span className={styles.typingDot} />
                          </div>
                        ))}
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </Stack>
              )}
            </ScrollArea>

            {/* Input */}
            <div className={styles.inputArea}>
              <Group gap="sm" align="flex-end">
                <Textarea
                  placeholder="Nhập tin nhắn bằng tiếng Anh..."
                  value={input}
                  onChange={(e) => setInput(e.currentTarget.value)}
                  onKeyDown={handleKeyDown}
                  autosize
                  minRows={1}
                  maxRows={4}
                  style={{ flex: 1 }}
                  disabled={streaming}
                />
                <Tooltip label="Gửi (Enter)">
                  <ActionIcon
                    size="lg"
                    variant="filled"
                    onClick={handleSend}
                    disabled={!input.trim() || streaming}
                    loading={streaming}
                  >
                    <IconSend size={18} />
                  </ActionIcon>
                </Tooltip>
              </Group>
            </div>
          </>
        )}
      </div>

      {/* ── New Conversation Modal ───────────────────────────────────────── */}
      <Modal
        opened={newConvOpened}
        onClose={closeNewConv}
        title="Tạo cuộc hội thoại mới"
        size="sm"
      >
        <Stack gap="md">
          <TextInput
            label="Tiêu đề (tùy chọn)"
            placeholder="VD: Practice everyday English"
            value={newTitle}
            onChange={(e) => setNewTitle(e.currentTarget.value)}
          />
          <Select
            label="Trình độ tiếng Anh"
            data={LEVEL_OPTIONS}
            value={newLevel}
            onChange={(v) => setNewLevel((v as EnglishLevel) || 'B1')}
            allowDeselect={false}
          />
          <Button onClick={handleCreateConversation} fullWidth>
            Tạo cuộc hội thoại
          </Button>
        </Stack>
      </Modal>

      {/* ── Rename Modal ──────────────────────────────────────────────────── */}
      <Modal
        opened={renameOpened}
        onClose={closeRename}
        title="Đổi tên cuộc hội thoại"
        size="sm"
      >
        <Stack gap="md">
          <TextInput
            label="Tiêu đề mới"
            value={renameTitle}
            onChange={(e) => setRenameTitle(e.currentTarget.value)}
          />
          <Button onClick={handleRename} fullWidth>
            Lưu
          </Button>
        </Stack>
      </Modal>
    </div>
  )
}
