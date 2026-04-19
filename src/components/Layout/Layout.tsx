import { lazy, Suspense, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import LoadingScreen from '@/components/LoadingScreen/LoadingScreen';
import useAuth from '@/utils/hooks/useAuth';
import useLocale from '@/utils/hooks/useLocale';

export function Layout() {
  const { authenticated } = useAuth();
  const { pathname } = useLocation();

  useLocale();

  const AppLayout = useMemo(() => {
    // Landing page renders without any layout wrapper (full-page)
    if (pathname === '/') {
      return lazy(() => import('@/pages/LandingPage'));
    }
    if (authenticated) {
      return lazy(() => import('./LayoutTypes/DefaultLayout'));
    }
    return lazy(() => import('./AuthLayout'));
  }, [authenticated, pathname]);

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
