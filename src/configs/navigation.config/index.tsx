import {
  IconBook,
  IconBrain,
  IconHeadphones,
  IconHome,
  IconListCheck,
  IconMessageChatbot,
  IconMicrophone,
} from '@tabler/icons-react'
import type { NavigationTree } from '@/@types/navigation'

const navigationConfig: NavigationTree[] = [
  {
    key: 'dashboard',
    path: '/dashboard',
    title: 'Trang chủ',
    translateKey: '',
    icon: IconHome,
    authority: [],
    subMenu: [],
  },
  {
    key: 'vocabulary',
    path: '/vocabulary',
    title: 'Từ vựng',
    translateKey: '',
    icon: IconBook,
    authority: ['STUDENT', 'TEACHER', 'ADMIN'],
    subMenu: [],
  },
  {
    key: 'grammar',
    path: '/grammar',
    title: 'Ngữ pháp',
    translateKey: '',
    icon: IconBrain,
    authority: ['STUDENT', 'TEACHER', 'ADMIN'],
    subMenu: [],
  },
  {
    key: 'listening',
    path: '/listening',
    title: 'Nghe',
    translateKey: '',
    icon: IconHeadphones,
    authority: ['STUDENT', 'TEACHER', 'ADMIN'],
    subMenu: [],
  },
  {
    key: 'speaking',
    path: '/speaking',
    title: 'Nói',
    translateKey: '',
    icon: IconMicrophone,
    authority: ['STUDENT', 'TEACHER', 'ADMIN'],
    subMenu: [],
    disabled: true,
  } as any,
  {
    key: 'ielts-practice',
    path: '/ielts-practice',
    title: 'Luyện đề IELTS',
    translateKey: '',
    icon: IconListCheck,
    authority: ['STUDENT', 'TEACHER', 'ADMIN'],
    subMenu: [],
  },
  {
    key: 'ai-chat',
    path: '/ai-chat',
    title: 'AI Chatbot',
    translateKey: '',
    icon: IconMessageChatbot,
    authority: ['STUDENT', 'TEACHER', 'ADMIN'],
    subMenu: [],
  },
]

export default navigationConfig
