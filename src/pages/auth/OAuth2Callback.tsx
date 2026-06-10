import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader, Stack, Text } from '@mantine/core';
import appConfig from '@/configs/app.config';
import { REDIRECT_URL_KEY } from '@/constants/app.constant';
import { signInSuccess, setUserInfo, useAppDispatch } from '@/store';

const APP_ROLES = new Set(['STUDENT', 'TEACHER', 'ADMIN']);

function decodeJwtPayload(token: string) {
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  try {
    const payload = atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(payload);
  } catch {
    return null;
  }
}

export default function OAuth2Callback() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const processed = useRef(false);

  useEffect(() => {
    if (processed.current) return;
    processed.current = true;

    const token = searchParams.get('token');
    const refreshToken = searchParams.get('refreshToken') ?? '';
    const userId = searchParams.get('userId') ?? '';
    const role = searchParams.get('role') ?? '';

    if (!token) {
      navigate('/sign-in', { replace: true });
      return;
    }

    const claims = decodeJwtPayload(token);
    if (!claims) {
      navigate('/sign-in', { replace: true });
      return;
    }

    // Use role from BE redirect URL, fallback to JWT realm_access
    const appRole =
      role ||
      (claims.realm_access?.roles ?? []).find((r: string) =>
        APP_ROLES.has(r)
      ) ||
      'STUDENT';

    // Calculate expire time in seconds from JWT exp
    const expireTime = claims.exp
      ? claims.exp - Math.floor(Date.now() / 1000)
      : 300;

    dispatch(
      signInSuccess({
        token,
        refreshToken,
        expireTime,
      })
    );

    dispatch(
      setUserInfo({
        userId,
        name: claims.name ?? '',
        email: claims.email ?? '',
        role: appRole,
        googleLogin: true,
      })
    );

    // Redirect based on role or saved redirect URL
    const redirectUrl = searchParams.get(REDIRECT_URL_KEY);
    if (redirectUrl) {
      navigate(redirectUrl, { replace: true });
    } else if (appRole === 'ADMIN') {
      navigate('/admin/users', { replace: true });
    } else if (appRole === 'TEACHER') {
      navigate('/teacher/vocabulary', { replace: true });
    } else {
      navigate(appConfig.authenticatedEntryPath, { replace: true });
    }
  }, []);

  return (
    <Stack align="center" gap="md" py="xl">
      <Loader size="lg" />
      <Text c="dimmed">Dang xac thuc...</Text>
    </Stack>
  );
}
