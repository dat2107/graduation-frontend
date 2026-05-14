import { lazy, Suspense } from 'react'
import { Loader, Modal, Stack } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useLocation } from 'react-router-dom'
import { IconMessageChatbot } from '@tabler/icons-react'
import styles from './ChatFab.module.css'

const AiChatPage = lazy(() => import('@/pages/ai-chat/AiChatPage'))

const ChatFab = () => {
  const [opened, { open, close }] = useDisclosure(false)
  const { pathname } = useLocation()

  // Hide FAB when already on the AI Chat page
  if (pathname === '/ai-chat') return null

  return (
    <>
      <button
        className={styles.fab}
        onClick={open}
        aria-label="Open AI Chatbot"
        type="button"
      >
        <IconMessageChatbot size={28} stroke={1.5} />
      </button>

      <Modal
        opened={opened}
        onClose={close}
        title="AI English Chatbot"
        size="xl"
        centered
        radius="md"
        styles={{
          body: { height: 'calc(80vh - 60px)', padding: 0 },
          content: { maxHeight: '80vh' },
        }}
      >
        <Suspense
          fallback={
            <Stack align="center" justify="center" h="100%">
              <Loader size="md" />
            </Stack>
          }
        >
          <AiChatPage quickStart />
        </Suspense>
      </Modal>
    </>
  )
}

export default ChatFab
