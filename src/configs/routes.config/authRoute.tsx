import { lazy } from 'react';
import type { Routes } from '@/@types/routes';

const authRoute: Routes = [
  {
    key: 'signIn',
    path: `/sign-in`,
    component: lazy(() => import('@/pages/auth/SignIn')),
    authority: [],
  },
  {
    key: 'signUp',
    path: `/sign-up`,
    component: lazy(() => import('@/pages/auth/SignUp')),
    authority: [],
  },
  {
    key: 'forgotPassword',
    path: `/forgot-password`,
    component: lazy(() => import('@/pages/auth/ForgotPassword')),
    authority: [],
  },
  {
    key: 'oauth2Callback',
    path: `/oauth2/success`,
    component: lazy(() => import('@/pages/auth/OAuth2Callback')),
    authority: [],
  },
];

export default authRoute;
