import { lazy } from 'react';

import authRoute from './authRoute';
import type { Routes } from '@/@types/routes';

export const publicRoutes: Routes = [...authRoute];

export const protectedRoutes = [
  {
    key: 'dashboard',
    path: '/dashboard',
    component: lazy(() => import('@/pages/examples/Pages')),
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
];
