'use client';

import { Tooltip } from '@heroui/react';
import { addToast } from '@heroui/toast';
import { confetti } from '@tsparticles/confetti';
import { useRouter } from 'next/navigation';
import React, { useMemo, useState } from 'react';
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
  amount,
  totalRaised,
}: {
  amount: number;
  totalRaised: number;
}) {
  const { t } = useTranslation();
  const account = useActiveAccount();
  const wallet = useActiveWallet();
  const address = useMemo(() => account?.address, [account]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

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
        disabled={!address || totalRaised >= 100000 * 1e18}
        className="flex items-center justify-center disabled:bg-gray-600 min-h-[48px] max-h-[48px] flex-1 py-1 md:py-2 px-2 md:px-4 rounded-md transition-colors border-neutral-950 border-2 bg-cyan-500 text-black font-bold hover:bg-cyan-400"
        // @ts-ignore
        onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
          if (wallet?.id === 'inApp') {
            const confirmed = window.confirm(
              t('transferTokens.confirmTransaction'),
            );
            if (!confirmed) {
              // Prevent the transaction from being sent
              event.preventDefault();
              setIsLoading(true);
            }
          } else {
            setIsLoading(true);
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
          addToast({
            title: 'Transaction Error',
            description:
              isNaN(amount) || amount === 0
                ? 'Please enter a valid amount'
                : revertReason || 'Unknown error',
            color: 'danger',
            variant: 'flat',
          });
          setIsLoading(false);
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
            if (data.data.success) {
              const end = Date.now() + 3 * 1000;
              (function frame() {
                confetti('tsparticles', {
                  particleCount: 2,
                  angle: 60,
                  spread: 55,
                  position: { x: 0 },
                });

                confetti('tsparticles', {
                  particleCount: 2,
                  angle: 120,
                  spread: 55,
                  position: { x: 100 },
                });

                if (Date.now() < end) {
                  requestAnimationFrame(frame);
                }
              })();
              router.push('/tokens');
            }
          }
          setIsLoading(false);
        }}
      >
        {isLoading
          ? t('transferTokens.button.processing')
          : t('transferTokens.button.default')}
      </TransactionButton>
    </Tooltip>
  );
}
