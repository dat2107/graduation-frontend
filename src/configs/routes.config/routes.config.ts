import { lazy } from 'react';

import authRoute from './authRoute';
import type { Routes } from '@/@types/routes';

export const publicRoutes: Routes = [...authRoute];

export const protectedRoutes = [
  {
    key: 'dashboard',
    path: '/dashboard',
    component: lazy(() => import('@/pages/dashboard/Dashboard')),
    authority: [],
  },
  {
    key: 'profile',
    path: '/profile',
    component: lazy(() => import('@/pages/profile/Profile')),
    authority: ['STUDENT', 'TEACHER', 'ADMIN'],
  },
  // ── IELTS Practice ──────────────────────────────────────────────────────────
  {
    key: 'ielts-practice',
    path: '/ielts-practice',
    component: lazy(() => import('@/pages/ielts-practice/IeltsPracticePage')),
    authority: ['STUDENT', 'TEACHER', 'ADMIN'],
  },
  {
    key: 'ielts-practice.detail',
    path: '/ielts-practice/:testId',
    component: lazy(() => import('@/pages/ielts-practice/IeltsTestDetailPage')),
    authority: ['STUDENT', 'TEACHER', 'ADMIN'],
  },
  // ── Vocabulary ───────────────────────────────────────────────────────────────
  // ── Grammar ──────────────────────────────────────────────────────────────────
  {
    key: 'grammar',
    path: '/grammar',
    component: lazy(() => import('@/pages/grammar/GrammarPage')),
    authority: ['STUDENT', 'TEACHER', 'ADMIN'],
  },
  {
    key: 'grammar.detail',
    path: '/grammar/:lessonId',
    component: lazy(() => import('@/pages/grammar/GrammarLessonDetail')),
    authority: ['STUDENT', 'TEACHER', 'ADMIN'],
  },
  // ── Listening ───────────────────────────────────────────────────────────────
  {
    key: 'listening',
    path: '/listening',
    component: lazy(() => import('@/pages/listening/ListeningPage')),
    authority: ['STUDENT', 'TEACHER', 'ADMIN'],
  },
  {
    key: 'listening.detail',
    path: '/listening/:lessonId',
    component: lazy(() => import('@/pages/listening/ListeningLessonDetail')),
    authority: ['STUDENT', 'TEACHER', 'ADMIN'],
  },
  // ── Vocabulary ───────────────────────────────────────────────────────────────
  // ── AI Chat ─────────────────────────────────────────────────────────────────
  {
    key: 'ai-chat',
    path: '/ai-chat',
    component: lazy(() => import('@/pages/ai-chat/AiChatPage')),
    authority: ['STUDENT', 'TEACHER', 'ADMIN'],
  },
  // ── Writing Check ─────────────────────────────────────────────────────────
  {
    key: 'writing-check',
    path: '/writing-check',
    component: lazy(() => import('@/pages/writing-check/WritingCheckPage')),
    authority: ['STUDENT', 'TEACHER', 'ADMIN'],
  },
  // ── Vocabulary ───────────────────────────────────────────────────────────────
  {
    key: 'vocabulary',
    path: '/vocabulary',
    component: lazy(() => import('@/pages/vocabulary/VocabularyPage')),
    authority: ['STUDENT', 'TEACHER', 'ADMIN'],
  },
  {
    key: 'vocabulary.detail',
    path: '/vocabulary/:setId',
    component: lazy(() => import('@/pages/vocabulary/VocabularySetDetail')),
    authority: ['STUDENT', 'TEACHER', 'ADMIN'],
  },
  // ── Teacher Management ───────────────────────────────────────────────────
  {
    key: 'teacher.vocabulary',
    path: '/teacher/vocabulary',
    component: lazy(() => import('@/pages/teacher/vocabulary/TeacherVocabularyPage')),
    authority: ['TEACHER', 'ADMIN'],
  },
  {
    key: 'teacher.vocabulary.detail',
    path: '/teacher/vocabulary/:topicId',
    component: lazy(() => import('@/pages/teacher/vocabulary/TeacherVocabularyTopicDetail')),
    authority: ['TEACHER', 'ADMIN'],
  },
  {
    key: 'teacher.grammar',
    path: '/teacher/grammar',
    component: lazy(() => import('@/pages/teacher/grammar/TeacherGrammarPage')),
    authority: ['TEACHER', 'ADMIN'],
  },
  {
    key: 'teacher.grammar.detail',
    path: '/teacher/grammar/:topicId',
    component: lazy(() => import('@/pages/teacher/grammar/TeacherGrammarTopicDetail')),
    authority: ['TEACHER', 'ADMIN'],
  },
  {
    key: 'teacher.listening',
    path: '/teacher/listening',
    component: lazy(() => import('@/pages/teacher/listening/TeacherListeningPage')),
    authority: ['TEACHER', 'ADMIN'],
  },
  {
    key: 'teacher.listening.detail',
    path: '/teacher/listening/:topicId',
    component: lazy(() => import('@/pages/teacher/listening/TeacherListeningTopicDetail')),
    authority: ['TEACHER', 'ADMIN'],
  },
  // ── Admin ──────────────────────────────────────────────────────────────────
  {
    key: 'admin.dashboard',
    path: '/admin',
    component: lazy(() => import('@/pages/admin/AdminDashboard')),
    authority: ['ADMIN'],
  },
  {
    key: 'admin.users',
    path: '/admin/users',
    component: lazy(() => import('@/pages/admin/AdminUserManagement')),
    authority: ['ADMIN'],
  },
  {
    key: 'admin.content',
    path: '/admin/content',
    component: lazy(() => import('@/pages/admin/AdminContentManagement')),
    authority: ['ADMIN'],
  },
];
