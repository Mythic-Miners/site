'use client';

import React, { useEffect, useState } from 'react';
import { useMeQuery } from '@/api/auth';
import { useActiveAccount } from 'thirdweb/react';
import UsernameModal from '@/components/ui/UsernameModal';

export default function UsernameGate() {
  const account = useActiveAccount();
  const address = account?.address ?? '';
  const { data, isLoading, refetch, isError } = useMeQuery(!!address);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && data && account?.address) {
      if (data?.errorMessage === "[504] - Lambda timeout.") {
        refetch();
      } else {
        const hasUsername = !!data.data?.username;
        setOpen(!hasUsername);
      }
    }
  }, [data, isLoading, account?.address, isError, refetch]);

  return <UsernameModal isOpen={open} onOpenChange={setOpen} />;
}
