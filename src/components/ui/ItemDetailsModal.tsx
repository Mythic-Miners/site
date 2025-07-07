'use client';

import {
  Button,
  Chip,
  Divider,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@heroui/react';
import { addToast } from '@heroui/toast';
import { confetti } from '@tsparticles/confetti';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { sendAndConfirmTransaction } from 'thirdweb';
import { useActiveAccount } from 'thirdweb/react';

import type { InventoryItem } from '@/api/inventory';
import {
  equipmentsApproveContract,
  equipmentsContract,
} from '@/contracts/equipments';
import {
  equipTransaction,
  unequipTransaction,
} from '@/contracts/equipmentsManager';
import { relicsApproveContract, relicsContract } from '@/contracts/relics';
import { convertTokenIdToBlockchain } from '@/lib/utils';

interface ItemDetailsModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  item: InventoryItem | null;
  onEquipSuccess?: () => void;
  onUnequipSuccess?: () => void;
}

export default function ItemDetailsModal({
  isOpen,
  onOpenChange,
  item,
  onEquipSuccess,
  onUnequipSuccess,
}: ItemDetailsModalProps) {
  const { t } = useTranslation();
  const account = useActiveAccount();
  const [isEquipping, setIsEquipping] = useState(false);
  const [isEquipped, setIsEquipped] = useState(false);

  useEffect(() => {
    setIsEquipped(false);
  }, [isOpen]);

  // Delay function to wait between transactions
  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  if (!item || !item.metadata) return null;

  const contractAddress = getContractAddress(item.category);
  const nftContract = getNFTContract(item.category);

  const handleApproveAndEquip = async () => {
    if (!account || !nftContract || !contractAddress) {
      addToast({
        title: t('item.transaction.error'),
        description: t('item.transaction.missingData'),
        color: 'danger',
        variant: 'flat',
      });
      return;
    }

    setIsEquipping(true);

    try {
      const tokenId = convertTokenIdToBlockchain(item.tokenId);
      const approveTransaction =
        item.category === 'equipments'
          ? equipmentsApproveContract(tokenId)
          : relicsApproveContract(tokenId);

      addToast({
        title: t('item.transaction.transactionSent'),
        description: t('item.transaction.approvingAndEquipping'),
        color: 'warning',
        variant: 'flat',
        timeout: 2000,
      });

      // Send transaction
      await sendAndConfirmTransaction({
        account,
        transaction: approveTransaction,
      });

      await delay(1500);

      // Step 2: Send equip transaction
      await sendAndConfirmTransaction({
        account,
        transaction: equipTransaction(contractAddress, tokenId),
      });

      if (onEquipSuccess) {
        onEquipSuccess();
      }

      setIsEquipping(false);

      confetti('tsparticles', {
        particleCount: 50,
        spread: 70,
        position: { x: 50, y: 50 },
      });

      addToast({
        title: t('item.transaction.itemEquipped'),
        description: `${item.metadata?.name} ${t('item.transaction.itemEquippedSuccess')}`,
        color: 'success',
        variant: 'flat',
      });

      setIsEquipped(true);
    } catch (error) {
      const errorMessage = (error as Error).message;
      setIsEquipping(false);

      if (
        errorMessage.includes(
          "Sender doesn't have enough funds to send tx. The max upfront cost is",
        )
      ) {
        // Parse the upfront cost and balance from the error message
        const upfrontCostMatch = errorMessage.match(
          /max upfront cost is: (\d+)/,
        );
        const balanceMatch = errorMessage.match(/sender's balance is: (\d+)/);

        const upfrontCost = upfrontCostMatch ? upfrontCostMatch[1] : 'unknown';
        const balance = balanceMatch ? balanceMatch[1] : 'unknown';

        // Convert from wei to ETH for better readability (assuming 18 decimals)
        const formatWei = (wei: string) => {
          if (wei === 'unknown' || wei === '0') return wei;
          const ethValue = parseFloat(wei) / Math.pow(10, 18);
          return ethValue.toFixed(6);
        };

        addToast({
          title: t('item.transaction.insufficientFunds'),
          description: t('item.transaction.insufficientFundsDetails', {
            required: formatWei(upfrontCost),
            balance: formatWei(balance),
          }),
          color: 'danger',
          variant: 'flat',
        });
        return;
      } else if (errorMessage.includes('ERC721InsufficientApproval')) {
        addToast({
          title: t('item.transaction.error'),
          description: t('item.transaction.approvalFailed'),
          color: 'danger',
          variant: 'flat',
        });
        return;
      } else if (errorMessage.includes('ERC721IncorrectOwner')) {
        addToast({
          title: t('item.transaction.error'),
          description: t('item.transaction.notOwner'),
          color: 'danger',
          variant: 'flat',
        });
        return;
      } else {
        addToast({
          title: t('item.transaction.error'),
          description: t('item.transaction.failedToPrepare'),
          color: 'danger',
          variant: 'flat',
        });
      }
    }
  };

  const handleApproveAndUnequip = async () => {
    if (!account || !nftContract || !contractAddress) {
      addToast({
        title: t('item.transaction.error'),
        description: t('item.transaction.missingData'),
        color: 'danger',
        variant: 'flat',
      });
      return;
    }

    setIsEquipping(true);

    try {
      // Step 2: Send equip transaction
      await sendAndConfirmTransaction({
        account,
        transaction: unequipTransaction(item.equipmentType!),
      });

      if (onUnequipSuccess) {
        onUnequipSuccess();
      }

      setIsEquipping(false);

      addToast({
        title: t('item.transaction.itemUnequipped'),
        description: `${item.metadata?.name} ${t('item.transaction.itemUnequippedSuccess')}`,
        color: 'success',
        variant: 'flat',
      });

      setIsEquipped(true);
    } catch (error) {
      const errorMessage = (error as Error).message;
      setIsEquipping(false);
      console.log('errorMessage', errorMessage);

      if (
        errorMessage.includes(
          "Sender doesn't have enough funds to send tx. The max upfront cost is",
        )
      ) {
        // Parse the upfront cost and balance from the error message
        const upfrontCostMatch = errorMessage.match(
          /max upfront cost is: (\d+)/,
        );
        const balanceMatch = errorMessage.match(/sender's balance is: (\d+)/);

        const upfrontCost = upfrontCostMatch ? upfrontCostMatch[1] : 'unknown';
        const balance = balanceMatch ? balanceMatch[1] : 'unknown';

        // Convert from wei to ETH for better readability (assuming 18 decimals)
        const formatWei = (wei: string) => {
          if (wei === 'unknown' || wei === '0') return wei;
          const ethValue = parseFloat(wei) / Math.pow(10, 18);
          return ethValue.toFixed(6);
        };

        addToast({
          title: t('item.transaction.insufficientFunds'),
          description: t('item.transaction.insufficientFundsDetails', {
            required: formatWei(upfrontCost),
            balance: formatWei(balance),
          }),
          color: 'danger',
          variant: 'flat',
        });
        return;
      } else if (errorMessage.includes('ERC721InsufficientApproval')) {
        addToast({
          title: t('item.transaction.error'),
          description: t('item.transaction.approvalFailed'),
          color: 'danger',
          variant: 'flat',
        });
        return;
      } else if (errorMessage.includes('ERC721IncorrectOwner')) {
        addToast({
          title: t('item.transaction.error'),
          description: t('item.transaction.notOwner'),
          color: 'danger',
          variant: 'flat',
        });
        return;
      } else {
        addToast({
          title: t('item.transaction.error'),
          description: t('item.transaction.failedToPrepare'),
          color: 'danger',
          variant: 'flat',
        });
      }
    }
  };

  const rarity = getRarityFromAttributes(item.metadata.attributes);

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="4xl"
      scrollBehavior="inside"
      classNames={{
        // base: 'bg-gray-900 border border-gray-700',
        base: 'bg-indigo-950 border border-black border-2',
        // header: 'border-b border-gray-700',
        header: 'border-b border-black',
        // footer: 'border-t border-gray-700',
        footer: 'border-t border-black',
      }}
    >
      <ModalContent>
        <>
          <ModalHeader className="flex flex-col gap-1">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-white">
                {item.metadata?.name}
              </h2>
              {rarity && (
                <Chip
                  className={`${getRarityColor(rarity)} text-white font-bold`}
                  size="sm"
                >
                  {rarity}
                </Chip>
              )}
            </div>
            <p className="text-gray-400 text-sm">
              {item.category} • Token ID: #{item.tokenId}
            </p>
          </ModalHeader>

          <ModalBody className="gap-6 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left side - Image */}
              <div className="space-y-4">
                <div className="relative aspect-square bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-4 border border-black">
                  <Image
                    src={item.metadata?.image}
                    alt={item.metadata?.name}
                    className="w-full h-full object-contain rounded-xl"
                  />
                </div>

                {/* Item Stats Summary */}
                <div className="bg-gray-800/50 rounded-xl p-4 border border-black">
                  <h3 className="text-lg font-bold text-cyan-400 mb-3">
                    {t('item.details.overview')}
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">
                        {t('item.details.category')}:
                      </span>
                      <p className="text-white font-medium">{item.category}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">
                        {t('item.details.tokenId')}:
                      </span>
                      <p className="text-white font-medium">#{item.tokenId}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right side - Details */}
              <div className="space-y-6">
                {/* Description */}
                <div>
                  <h3 className="text-lg font-bold text-cyan-400 mb-3">
                    {t('item.details.description')}
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {item.metadata?.description}
                  </p>
                </div>

                <Divider className="bg-black" />

                {/* Attributes */}
                {item.metadata?.attributes?.length && (
                  <div>
                    <h3 className="text-lg font-bold text-cyan-400 mb-4">
                      {t('item.details.attributes')}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {item.metadata?.attributes?.map((attr, index) => (
                        <div
                          key={attr._id || index}
                          className="bg-gray-800/50 rounded-lg p-3 border border-black"
                        >
                          <div className="text-xs text-gray-400 uppercase tracking-wide">
                            {attr.trait_type}
                          </div>
                          <div className="text-white font-bold mt-1">
                            {attr.display_type === 'number'
                              ? `${attr.value}`
                              : attr.display_type === 'boost_percentage'
                                ? `${attr.value}%`
                                : attr.value}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </ModalBody>

          {isEquippable(item.category) && (
            <ModalFooter className="gap-3">
              {/* Approve & Equip Button using batch transaction */}
              {!item.isEquipped && (
                <Button
                  color="primary"
                  isDisabled={
                    !(account && contractAddress && nftContract) ||
                    isEquipping ||
                    isEquipped
                  }
                  isLoading={isEquipping}
                  onPress={handleApproveAndEquip}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold hover:from-cyan-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isEquipping
                    ? t('item.actions.equipping')
                    : t('item.actions.equip')}
                </Button>
              )}
              {/* Approve & Equip Button using batch transaction */}
              {item.isEquipped && (
                <Button
                  color="primary"
                  isDisabled={
                    !(account && contractAddress && nftContract) ||
                    isEquipping ||
                    isEquipped
                  }
                  isLoading={isEquipping}
                  onPress={handleApproveAndUnequip}
                  className="bg-gradient-to-r from-cyan-500 to-blue-400 text-white font-bold hover:from-cyan-600 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isEquipping
                    ? t('item.actions.unequipping')
                    : t('item.actions.unequip')}
                </Button>
              )}
            </ModalFooter>
          )}
        </>
      </ModalContent>
    </Modal>
  );
}

const isEquippable = (category: string) => {
  return category === 'equipments' || category === 'relics';
};

const getRarityFromAttributes = (
  attributes: Array<{ trait_type: string; value: string | number }>,
) => {
  const rarityAttr = attributes.find(
    (attr) => attr.trait_type.toLowerCase() === 'rarity',
  );
  return rarityAttr?.value as string;
};

// Contract addresses - these should be configured in environment variables
const getContractAddress = (category: string) => {
  switch (category) {
    case 'equipments':
      return process.env.NEXT_PUBLIC_EQUIPMENTS_ADDRESS || '';
    case 'relics':
      return process.env.NEXT_PUBLIC_RELICS_ADDRESS || '';
    default:
      return '';
  }
};

// Get the appropriate NFT contract for approval
const getNFTContract = (category: string): any => {
  switch (category) {
    case 'equipments':
      return equipmentsContract;
    case 'relics':
      return relicsContract;
    default:
      return null;
  }
};

const getRarityColor = (rarity?: string) => {
  switch (rarity?.toLowerCase()) {
    case 'timeless':
      return 'bg-gradient-to-r from-red-600 to-red-400';
    case 'legendary':
      return 'bg-gradient-to-r from-yellow-600 to-yellow-500';
    case 'epic':
      return 'bg-gradient-to-r from-violet-600 to-violet-400';
    case 'rare':
      return 'bg-gradient-to-r from-cyan-500 to-cyan-400';
    case 'uncommon':
      return 'bg-gradient-to-r from-emerald-500 to-emerald-400';
    case 'common':
      return 'bg-gradient-to-r from-gray-500 to-gray-400';
    default:
      return 'bg-gradient-to-r from-gray-600 to-gray-400';
  }
};
