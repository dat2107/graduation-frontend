import { useMemo } from 'react';

function useAuthority(
  userAuthority: string[] = [],
  authority: string[] = [],
  emptyCheck = false
) {
  const roleMatched = useMemo(
    () => authority.some((role) => userAuthority.includes(role)),
    [authority, userAuthority]
  );

  if (
    authority.length === 0 ||
    userAuthority.length === 0 ||
    typeof authority === 'undefined'
  ) {
    return !emptyCheck;
  }

  return roleMatched;
}

export default useAuthority;
