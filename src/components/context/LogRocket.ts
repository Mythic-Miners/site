'use client';

import LogRocket from 'logrocket';
import { useEffect } from 'react';
import { useActiveAccount } from 'thirdweb/react';

export default function LogRocketProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const account = useActiveAccount();

  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      process.env.NODE_ENV === 'production'
    ) {
      LogRocket.init('loqlxd/mythicminers');
      LogRocket.identify(account?.address || '');
    }
  }, [account?.address]);

  return children;
}
