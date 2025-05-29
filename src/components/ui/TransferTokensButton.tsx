'use client';

import { Tooltip } from '@heroui/react';
import React, { useMemo } from 'react';
import {
  TransactionButton,
  useActiveAccount,
  useActiveWallet,
} from 'thirdweb/react';
import { prepareContractCall } from 'thirdweb/transaction';

import { icoManagerContract } from '@/contracts/ico';

export default function TransferTokensButton({
  isSubmitting,
}: {
  isSubmitting: boolean;
}) {
  const account = useActiveAccount();
  const wallet = useActiveWallet();
  const address = useMemo(() => account?.address, [account]);
  console.log('wallet', wallet);

  return (
    <Tooltip
      content="Conecte a sua carteira para adquirir $AMZ"
      showArrow={true}
      isDisabled={!!address}
      placement="bottom"
      classNames={{
        base: ['before:bg-zinc-800'],
        content: ['py-2 px-4 shadow-xl', 'text-neutral-250 bg-zinc-800'],
      }}
    >
      <TransactionButton
        unstyled
        disabled={!address}
        className="disabled:bg-gray-600 min-h-[48px] max-h-[48px] flex-1 py-1 md:py-3 px-2 md:px-4 rounded-md transition-colors border-neutral-950 border-2 bg-cyan-500 text-black font-bold hover:bg-cyan-400"
        // @ts-ignore
        onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
          if (wallet?.id === 'inApp') {
            const confirmed = window.confirm(
              'Are you sure you want to send this transaction?',
            );
            if (!confirmed) {
              // Prevent the transaction from being sent
              event.preventDefault();
            }
          }
        }}
        transaction={() =>
          prepareContractCall({
            contract: icoManagerContract,
            method: 'buyWithETH',
            params: [],
            value: BigInt(1e18), // 1 ETH
          })
        }
        onError={(error) => {
          console.log('ERROR!', error);
        }}
        onTransactionConfirmed={(result) => {
          console.log('BANAN called!', result);
        }}
      >
        {isSubmitting ? 'Processando...' : 'Adquirir $AMZ'}
      </TransactionButton>
    </Tooltip>
  );
}
