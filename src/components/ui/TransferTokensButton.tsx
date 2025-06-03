'use client';

import { Tooltip } from '@heroui/react';
import { addToast } from '@heroui/toast';
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

function extractRevertReason(errorString: string): string | null {
  // Match the revert reason inside single quotes after 'reverted with reason string'
  const match = errorString.match(/reverted with reason string '([^']+)'/);
  return match ? match[1] : null;
}

export default function TransferTokensButton({
  isSubmitting,
  amount,
}: {
  isSubmitting: boolean;
  amount: number;
}) {
  const { t } = useTranslation();
  const account = useActiveAccount();
  const wallet = useActiveWallet();
  const address = useMemo(() => account?.address, [account]);
  console.log('wallet', wallet);

  return (
    <Tooltip
      content={t('transferTokens.tooltip')}
      showArrow
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
            value: BigInt(amount * 1e18),
          })
        }
        onError={(error) => {
          const revertReason = extractRevertReason(error.message);
          console.log('revertReason', error.message, amount);
          addToast({
            title: 'Transaction Error',
            description:
              isNaN(amount) || amount === 0
                ? 'Please enter a valid amount'
                : revertReason || 'Unknown error',
            color: 'danger',
            variant: 'flat',
          });
        }}
        onTransactionConfirmed={async (result) => {
          const purchasedEvent = prepareEvent({
            signature:
              'event Purchased(address indexed user, uint256 amountPaid, uint256 earnedTokens, uint8 stage, uint256[] nftIds)',
          });

          const events = parseEventLogs({
            logs: result.logs,
            events: [purchasedEvent],
          });

          const purchased = events.find((e) => e.eventName === 'Purchased');
          if (purchased) {
            const nftId = purchased.args.nftIds;
            console.log('nftId', nftId);

            const response = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/nfts/metadata/relics`,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                  transactionHash: result.transactionHash,
                }),
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
