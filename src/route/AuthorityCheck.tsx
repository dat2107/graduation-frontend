import { ReactNode, CSSProperties } from 'react';
import useAuthority from '@/utils/hooks/useAuthority';

export interface CommonProps {
  className?: string;
  children?: ReactNode;
  style?: CSSProperties;
}

interface AuthorityCheckProps extends CommonProps {
  userAuthority: string[];
  authority: string[];
}

const AuthorityCheck = (props: AuthorityCheckProps) => {
  const { userAuthority = [], authority = [], children } = props;

  const roleMatched = useAuthority(userAuthority, authority);

  return <>{roleMatched ? children : null}</>;
};

export default AuthorityCheck;
