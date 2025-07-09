'use client';

import { Tooltip } from '@heroui/react';
import { addToast } from '@heroui/toast';
import { confetti } from '@tsparticles/confetti';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { parseEventLogs } from 'thirdweb/event';
import {
  TransactionButton,
  useActiveAccount,
  useActiveWallet,
} from 'thirdweb/react';
import { prepareContractCall } from 'thirdweb/transaction';

import { airdropManagerContract, claimEvent } from '@/contracts/airdrop';

function extractRevertReason(errorString: string): string | null {
  // Match the revert reason inside single quotes after 'reverted with reason string'
  const match = errorString.match(/reverted with reason string '([^']+)'/);
  return match ? match[1] : null;
}

export default function AirdropClaimButton({
  disabled,
  refetchAirdrop,
}: {
  disabled: boolean;
  refetchAirdrop: () => void;
}) {
  const { t } = useTranslation();
  const account = useActiveAccount();
  const wallet = useActiveWallet();
  const address = useMemo(() => account?.address, [account]);
  const [isLoading, setIsLoading] = useState(false);
  const [isClaimed, setIsClaimed] = useState(false);

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
        disabled={disabled || !address || isClaimed}
        className="flex items-center justify-center text-center mt-2 disabled:grayscale bg-amber-400 text-black font-bold py-2 px-4 rounded-md hover:bg-amber-500 transition-colors border-2 border-neutral-950 w-full"
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
            contract: airdropManagerContract,
            method: 'claim',
            params: [],
          })
        }
        onError={(error) => {
          console.log('error', error);
          const revertReason = extractRevertReason(error.message);
          addToast({
            title: 'Transaction Error',
            description: revertReason || 'Unknown error',
            color: 'danger',
            variant: 'flat',
          });
          setIsLoading(false);
        }}
        onTransactionStarted={(a: any) => {
          console.log('transaction started', a);
        }}
        onTransactionConfirmed={async (result) => {
          console.log('transaction confirmed', result);
          const events = parseEventLogs({
            logs: result.logs,
            events: [claimEvent],
          });

          const tokensClaimed = events.find(
            (e) => e.eventName === 'TokensClaimed',
          );
          if (tokensClaimed) {
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
            refetchAirdrop();
            setIsClaimed(true);
          }
          setIsLoading(false);
        }}
      >
        {isLoading
          ? t('transferTokens.button.processing')
          : t('tokensPage.claim')}
      </TransactionButton>
    </Tooltip>
  );
}
