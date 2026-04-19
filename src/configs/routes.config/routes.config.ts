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
  // ── Quiz ─────────────────────────────────────────────────────────────────────
  {
    key: 'quiz',
    path: '/quiz',
    component: lazy(() => import('@/pages/quiz/QuizPage')),
    authority: ['STUDENT', 'TEACHER', 'ADMIN'],
  },
  {
    key: 'quiz.detail',
    path: '/quiz/:quizId',
    component: lazy(() => import('@/pages/quiz/QuizDetailPage')),
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
