'use client';

import { Tooltip } from '@heroui/react';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { parseEventLogs, prepareEvent } from 'thirdweb/event';
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
  const { t } = useTranslation();
  const account = useActiveAccount();
  const wallet = useActiveWallet();
  const address = useMemo(() => account?.address, [account]);
  console.log('wallet', wallet);

  return (
    <Tooltip
      content={t('transferTokens.tooltip')}
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
              t('transferTokens.confirmTransaction'),
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
            method: 'purchase',
            params: [],
            value: BigInt(1e18), // 1 ETH
          })
        }
        onError={(error) => {
          console.log('ERROR!', error);
        }}
        onTransactionConfirmed={async (result) => {
          const purchasedEvent = prepareEvent({
            signature:
              'event Purchased(address indexed user, uint256 amountPaid, uint256 earnedTokens, uint8 stage, uint256 nftId)',
          });

          const events = parseEventLogs({
            logs: result.logs,
            events: [purchasedEvent],
          });

          const purchased = events.find((e) => e.eventName === 'Purchased');
          if (purchased) {
            const nftId = purchased.args.nftId;

            const response = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/nfts/metadata/relics/${nftId.toString()}`,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                credentials: 'include',
              },
            );

            const data = await response.json();
            console.log('data', data);
            console.log('Returned nftId:', nftId.toString());
          }
        }}
      >
        {isSubmitting
          ? t('transferTokens.button.processing')
          : t('transferTokens.button.default')}
      </TransactionButton>
    </Tooltip>
  );
}
