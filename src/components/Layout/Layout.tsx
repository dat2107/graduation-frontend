import { lazy, Suspense } from 'react';
import { useLocation } from 'react-router-dom';
import LoadingScreen from '@/components/LoadingScreen/LoadingScreen';
import useAuth from '@/utils/hooks/useAuth';
import useLocale from '@/utils/hooks/useLocale';

// Lazy imports phải khai báo ngoài component để React không tạo lại instance mỗi lần render
const LandingPage = lazy(() => import('@/pages/LandingPage'));
const DefaultLayout = lazy(() => import('./LayoutTypes/DefaultLayout'));
const AuthLayout = lazy(() => import('./AuthLayout'));

export function Layout() {
  const { authenticated } = useAuth();
  const { pathname } = useLocation();

  useLocale();

  // Landing page renders without any layout wrapper (full-page)
  if (pathname === '/') {
    return (
      <Suspense fallback={<LoadingScreen />}>
        <LandingPage />
      </Suspense>
    );
  }

  const AppLayout = authenticated ? DefaultLayout : AuthLayout;

  return (
    <Suspense
      fallback={
        <div className="flex flex-auto flex-col h-[100vh]">
          <LoadingScreen />
        </div>
      }
    >
      <AppLayout />
    </Suspense>
  );
}
