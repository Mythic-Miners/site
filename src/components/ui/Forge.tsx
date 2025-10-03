'use client';

import { Button } from '@heroui/button';
import { Card, CardFooter } from '@heroui/card';
import { Image } from '@heroui/image';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from '@heroui/react';
import { addToast } from '@heroui/toast';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { prepareContractCall } from 'thirdweb';
import { TransactionButton, useActiveAccount } from 'thirdweb/react';

import type { InventoryItem } from '@/api/inventory';
import { useMergeInGameMutation, useMergeMutation } from '@/api/inventory';
import { MERGE_PRICE_RARITY } from '../../lib/consts';
import { formatAMZ } from '../../lib/utils';
import { confetti } from '@tsparticles/confetti';
import { amazoniteTransferContract } from '../../contracts/amazonite';

interface ForgeProps {
  inventoryItems: InventoryItem[];
  onRefetchInventory: () => void;
  gameAmazonites: number;
  isVip: boolean;
}

interface SelectedEquipment {
  item: InventoryItem;
  slot: number;
}

interface MergeResult {
  image: string;
  name: string;
  description: string;
  attributes: Array<{
    trait_type: string;
    value: string | number;
    display_type?: string;
  }>;
}

const launchConfetti = () => {
  confetti('tsparticles', {
    particleCount: 100,
    spread: 70,
    position: { x: 50, y: 50 },
  });

  // Additional confetti bursts for more celebration
  setTimeout(() => {
    confetti('tsparticles', {
      particleCount: 50,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.6 },
    });
  }, 250);

  setTimeout(() => {
    confetti('tsparticles', {
      particleCount: 50,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.6 },
    });
  }, 500);
};

export default function Forge({ inventoryItems, onRefetchInventory, gameAmazonites, isVip }: ForgeProps) {
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedEquipments, setSelectedEquipments] = useState<
    SelectedEquipment[]
  >([]);
  const [mergeResult, setMergeResult] = useState<MergeResult | null>(null);
  const [selectedRarity, setSelectedRarity] = useState<string | null>(null);
  const account = useActiveAccount();
  const mergeMutation = useMergeMutation();
  const address = useMemo(() => account?.address, [account]);
  const { mutate: mergeInGameMutate, isPending: isMergeInGamePending } = useMergeInGameMutation();

  // Filter equipment items (exclude relics and timeless items)
  const forgeableItems = useMemo(() => {
    return inventoryItems.filter((item) => {
      if (item.category !== 'equipments') return false;

      // Check if it's timeless or relic
      const rarityAttr = item.metadata?.attributes?.find(
        (attr) => attr.trait_type === 'Rarity',
      );
      if (rarityAttr?.value === 'Timeless') return false;

      const categoryAttr = item.metadata?.attributes?.find(
        (attr) => attr.trait_type === 'Category',
      );
      if (categoryAttr?.value === 'Relic') return false;

      return true;
    });
  }, [inventoryItems]);

  // Group items by rarity
  const itemsByRarity = useMemo(() => {
    const grouped: Record<string, InventoryItem[]> = {};

    forgeableItems.forEach((item) => {
      const rarityAttr = item.metadata?.attributes?.find(
        (attr) => attr.trait_type === 'Rarity',
      );
      const rarity = rarityAttr?.value as string || 'Uncommon';

      if (!grouped[rarity]) {
        grouped[rarity] = [];
      }
      grouped[rarity].push(item);
    });

    return grouped;
  }, [forgeableItems]);

  // Get available rarities
  const availableRarities = useMemo(() => {
    return Object.keys(itemsByRarity).sort((a, b) => {
      const order = {
        'Uncommon': 0,
        'Rare': 1,
        'Epic': 2,
        'Legendary': 3,
        "Timeless": 4,
      };
      return order[a as keyof typeof order] - order[b as keyof typeof order];
    });
  }, [itemsByRarity]);

  // Get items for selected rarity
  const itemsForSelectedRarity = useMemo(() => {
    if (!selectedRarity) return forgeableItems; // Show all items if no rarity selected
    return itemsByRarity[selectedRarity] || [];
  }, [selectedRarity, itemsByRarity, forgeableItems]);

  // Get equipment grade from metadata
  const getEquipmentGrade = (item: InventoryItem): number => {
    const gradeAttr = item.metadata?.attributes?.find(
      (attr) => attr.trait_type === 'Grade',
    );
    const rarityAttr = item.metadata?.attributes?.find(
      (attr) => attr.trait_type === 'Rarity',
    );

    // Consider Limited Edition as S grade
    if (rarityAttr?.value === 'Limited Edition') {
      return 3; // S grade
    }

    if (!gradeAttr) return 0; // Default to C grade

    const gradeValue = gradeAttr.value as string;
    switch (gradeValue) {
      case 'C':
        return 0;
      case 'B':
        return 1;
      case 'A':
        return 2;
      case 'S':
        return 3;
      default:
        return 0;
    }
  };

  // Get equipment rarity from metadata
  const getEquipmentRarity = (item: InventoryItem): string => {
    const rarityAttr = item.metadata?.attributes?.find(
      (attr) => attr.trait_type === 'Rarity',
    );
    return rarityAttr?.value as string || 'Uncommon';
  };

  // Rarity labels for translation
  const rarityLabels = useMemo(() => ({
    'Uncommon': t('inventory.forge.rarityUncommon'),
    'Rare': t('inventory.forge.rarityRare'),
    'Epic': t('inventory.forge.rarityEpic'),
    'Legendary': t('inventory.forge.rarityLegendary'),
    'Mythic': t('inventory.forge.rarityMythic'),
    'Limited Edition': t('inventory.forge.rarityLimitedEdition'),
  }), [t]);

  // Check if forge is valid
  const isForgeValid = useMemo(() => {
    return selectedEquipments.length >= 3 && selectedEquipments.length <= 4;
  }, [selectedEquipments.length]);

  const handleEquipmentSelect = (item: InventoryItem) => {
    const isSelected = selectedEquipments.some(
      (selected) => selected.item.tokenId === item.tokenId,
    );

    if (isSelected) {
      setSelectedEquipments((prev) =>
        prev.filter((selected) => selected.item.tokenId !== item.tokenId),
      );
    } else {
      if (selectedEquipments.length >= 4) {
        addToast({
          title: t('inventory.forge.maxItemsSelected'),
          color: 'danger',
          variant: 'flat',
        });
        return;
      }

      // Check if the item has the same rarity as already selected items
      if (selectedEquipments.length > 0) {
        const firstItemRarity = getEquipmentRarity(selectedEquipments[0].item);
        const newItemRarity = getEquipmentRarity(item);

        if (firstItemRarity !== newItemRarity) {
          addToast({
            title: t('inventory.forge.sameRarityRequired'),
            color: 'danger',
            variant: 'flat',
          });
          return;
        }
      }

      const slot = selectedEquipments.length;
      setSelectedEquipments((prev) => [...prev, { item, slot }]);
    }

    // Clear previous forge result when selecting new equipment
    setMergeResult(null);
  };

  const handleRemoveEquipment = (tokenId: number) => {
    setSelectedEquipments((prev) =>
      prev.filter((selected) => selected.item.tokenId !== tokenId),
    );
    // Clear forge result when removing equipment
    setMergeResult(null);
  };

  const handleOpenModal = () => {
    setSelectedEquipments([]);
    setSelectedRarity(null);
    setMergeResult(null);
    onOpen();
  };

  const handleMergeSuccess = (result?: MergeResult) => {
    addToast({
      title: t('inventory.forge.mergeSuccess'),
      color: 'success',
      variant: 'flat',
    });

    if (result) {
      setMergeResult(result);
      launchConfetti();
    }

    onRefetchInventory();
    setSelectedEquipments([]);
    onClose();
  };

  const handleMergeError = (error: any) => {
    addToast({
      title: t('inventory.forge.mergeError'),
      description: error.message || 'Unknown error occurred',
      color: 'danger',
      variant: 'flat',
    });
  };

  const totalCost = useMemo(() => {
    const firstNft = selectedEquipments[0];
    const rarityAttr = firstNft?.item.metadata?.attributes?.find((attr: any) => attr.trait_type === 'Rarity');
    const rarity = rarityAttr?.value || 'Uncommon' as 'Uncommon' | 'Rare' | 'Epic' | 'Legendary';

    return isVip ? MERGE_PRICE_RARITY[rarity as keyof typeof MERGE_PRICE_RARITY].vip : MERGE_PRICE_RARITY[rarity as keyof typeof MERGE_PRICE_RARITY].regular;
  }, [isVip, MERGE_PRICE_RARITY, selectedEquipments]);

  return (
    <>
      <div className="bg-indigo-950 p-6 rounded-lg border-2 border-black mb-12">
        <h2 className="text-2xl font-bold text-cyan-500 mb-6 mythic-text-shadow">
          {t('inventory.forge.title')}
        </h2>

        {/* Equipment Selection Area */}
        <div className="mb-6">
          {/* Forge Layout */}
          <div className="bg-gray-800/30 p-6 rounded-lg border border-gray-600">
            <div className="flex flex-col lg:flex-row items-center justify-between">
              {/* Input Equipment */}
              <div className="flex-2">
                <h4 className="text-white font-semibold mb-3 text-center">
                  {t('inventory.forge.inputEquipment')}
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4">
                  {Array.from({ length: 4 }).map((_, index) => {
                    const selected = selectedEquipments[index];
                    return (
                      <div
                        key={index}
                        className={`relative border-2 rounded-lg p-2 w-30 h-30 flex items-center justify-center ${selected
                          ? 'border-cyan-500 bg-cyan-500/10'
                          : 'border-dashed border-gray-500 bg-gray-800/50'
                          }`}
                      >
                        {selected && (
                          <div
                            className="cursor-pointer absolute -top-2 -right-2 rounded-full flex items-center justify-center bg-[#08b9db] border border-[#08b9db] w-4 h-4 text-black text-xs font-bold leading-[13px]"
                            onClick={() =>
                              handleRemoveEquipment(selected.item.tokenId)
                            }
                          >
                            x
                          </div>
                        )}
                        {selected ? (
                          <div className="w-full h-full">
                            <Image
                              src={
                                selected.item.metadata?.image ||
                                '/assets/images/placeholder.png'
                              }
                              alt={selected.item.metadata?.name || ''}
                              className="w-full h-full object-contain"
                              height={100}
                              width={100}
                            />
                          </div>
                        ) : (
                          <div className="text-gray-400 text-xs text-center">
                            {index < 3
                              ? t('inventory.forge.required')
                              : t('inventory.forge.optional')}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="flex items-center justify-center text-cyan-500 text-2xl font-bold mt-[36px] rotate-90 lg:rotate-0 lg:mr-10">
                →
              </div>

              {/* Result Equipment */}
              <div className="flex-1">
                <h4 className="text-white font-semibold mb-3 text-center">
                  {t('inventory.forge.resultEquipment')}
                </h4>
                <div className="flex items-center justify-center">
                  {mergeResult ? (
                    <div className="relative">
                      <div className={`rounded-lg p-2 w-full h-30 flex flex-col items-center justify-center border-2 border-yellow-400 bg-yellow-400/10`}>
                        <Image
                          src={mergeResult.image || '/assets/images/placeholder.png'}
                          alt={mergeResult.name || ''}
                          className="w-full h-full object-contain"
                          height={100}
                          width={100}
                        />
                      </div>

                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-yellow-400 rounded-lg p-2 w-full h-30 flex items-center justify-center bg-yellow-400/10">
                      <div className="text-yellow-400 text-2xl">?</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Forge Action */}
        <div className="flex justify-between">
          <div className="flex flex-col gap-4">
            <Button
              className="rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-bold border-2 border-black"
              size="md"
              onPress={handleOpenModal}
            >
              {t('inventory.forge.selectEquipment')}
            </Button>
            <div className="bg-gray-800/50 p-2 rounded-lg border border-gray-600 min-w-[200px] text-sm text-gray-300 flex items-center justify-center">
              {t('inventory.forge.selectedItems')}: {selectedEquipments.length}
              /4
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <TransactionButton
              className={`border-2 border-black w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold py-1 px-4 rounded-lg absolute top-0 left-0 transition-opacity duration-200 h-full ${isLoading ? 'opacity-50' : 'opacity-100'}`}
              // @ts-ignore
              onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                const confirmed = window.confirm(
                  t('transferTokens.confirmTransaction'),
                );
                if (!confirmed) {
                  event.preventDefault();
                } else {
                  setIsLoading(true);
                }
              }}
              transaction={() => {
                return amazoniteTransferContract(BigInt(totalCost * 1e18));
              }}
              onError={handleMergeError}
              onTransactionConfirmed={async (result) => {
                try {
                  const payload = {
                    transactionHash: result.transactionHash,
                    equipmentTokenIds: selectedEquipments.map((selected) => selected.item.tokenId),
                  }
                  mergeMutation.mutate(payload, {
                    onSuccess: (response) => {
                      handleMergeSuccess(response.data.newEquipment);
                      setIsLoading(false);
                    },
                    onError: (error) => {
                      handleMergeError(error);
                      setIsLoading(false);
                    },
                  });
                } catch (error) {
                  handleMergeError(error);
                  setIsLoading(false);
                }
              }}
              unstyled
              disabled={!address || !isForgeValid}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              ) : (
                <>
                  {t('inventory.forge.merge')} - {totalCost} AMZ
                </>
              )}
            </TransactionButton>
            <Button
              onPress={() => {
                if (gameAmazonites < totalCost) {
                  addToast({
                    title: t('inventory.gacha.notEnoughAMZ'),
                    description: t('inventory.gacha.notEnoughAMZDescription'),
                    color: 'danger',
                    variant: 'flat',
                  });
                }
                mergeInGameMutate(selectedEquipments.map((selected) => selected.item.tokenId), {
                  onSuccess: (response) => {
                    handleMergeSuccess(response.data.newEquipment);
                  },
                  onError: (error) => {
                    handleMergeError(error);
                  },
                });
              }}
              isDisabled={selectedEquipments.length < 3 || gameAmazonites < totalCost || isMergeInGamePending}
              className={`disabled:cursor-not-allowed h-full border-2 border-black w-full bg-gradient-to-r from-[#1ae9ea] to-[#20a2a3] text-black font-bold py-1 px-4 rounded-lg break-words`}
            >
              <div className="flex items-center justify-center gap-2">
                {isMergeInGamePending ? (
                  <div>
                    <svg
                      className="animate-spin h-4 w-4 text-black"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-50"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="2"
                      ></circle>
                      <path
                        fill="currentColor"
                        d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  </div>
                ) : (
                  <>
                    {t('inventory.forge.mergeInGame')}{' '}
                    {`${totalCost || 0} $AMZ`}
                    <span className="flex items-center gap-1 rounded-md bg-white/30 p-1">
                      {formatAMZ(gameAmazonites)}{' '}
                      <Image
                        src="/assets/images/in-game-amz.png"
                        alt="Amazonite"
                        className="w-4 h-4"
                        height={16}
                        width={16}
                      />
                    </span>
                  </>
                )}
              </div>
            </Button>
          </div>

        </div >

        {/* Rules */}
        < div className="mt-6 p-4 bg-gray-800/30 rounded-lg border border-gray-600" >
          <h4 className="text-white font-semibold mb-2">
            {t('inventory.forge.rules')}
          </h4>
          <div className='flex justify-between items-center '>
            <ul className="text-white space-y-1 text-sm">
              <li className="list-item">• {t('inventory.forge.rule1')}</li>
              <li className="list-item">• {t('inventory.forge.rule2')}</li>
              <li className="list-item">• {t('inventory.forge.rule3')}</li>
              <li className="list-item">• {t('inventory.forge.rule4')}</li>
              <li className="list-item">• {t('inventory.forge.rule5')}</li>
              <li className="list-item">• {t('inventory.forge.rule6')}</li>
              <li className="list-item">• {t('inventory.forge.rule7')}</li>
            </ul>
            <div className="max-w-[250px] flex flex-col items-center justify-center gap-3 p-3 bg-gray-900/40 rounded-md border border-gray-700">
              <Image
                src="/assets/images/timeless.png"
                alt="Timeless"
                className="w-50 h-50 object-contain"
                height={100}
                width={140}
              />
              <p className="text-sm text-center text-gray-200">{t('inventory.forge.timelessNote')}</p>
            </div>
          </div>

        </div >
      </div >


      {/* Equipment Selection Modal */}
      < Modal isOpen={isOpen} onClose={onClose} size="4xl" >
        <ModalContent className="bg-indigo-950 border-2 border-black shadow-[0_0_20px_0_rgb(0,0,0)]">
          <ModalHeader className="bg-indigo-950/80 border-b-2 border-black">
            <div>
              <h3 className="text-xl font-bold text-cyan-500 mythic-text-shadow">
                {t('inventory.forge.modalTitle')}
              </h3>
              <p className="text-sm text-gray-300 mt-1">
                {t('inventory.forge.modalSubtitle')}
              </p>
            </div>
          </ModalHeader>
          <ModalBody className="bg-indigo-950/60 p-6">
            {/* Rarity Filter */}
            <div className="mb-6">
              <h4 className="text-white font-semibold mb-3">
                {t('inventory.forge.rarityFilter')}
              </h4>
              <p className="text-sm text-gray-300 mb-4">
                {t('inventory.forge.rarityFilterDesc')}
              </p>
              <div className="flex flex-wrap gap-2">
                {availableRarities.map((rarity) => {
                  const count = itemsByRarity[rarity]?.length || 0;

                  return (
                    <Button
                      key={rarity}
                      className={`px-4 py-2 rounded-lg font-semibold transition-colors ${selectedRarity === rarity
                        ? 'bg-cyan-600 text-white border-cyan-500'
                        : 'bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600'
                        } border-2`}
                      onPress={() => setSelectedRarity(rarity)}
                    >
                      {rarityLabels[rarity as keyof typeof rarityLabels]} ({count})
                    </Button>
                  );
                })}
                {selectedRarity && (
                  <Button
                    className="px-4 py-2 rounded-lg font-semibold transition-colors bg-gray-600 text-gray-300 border-gray-500 hover:bg-gray-500 border-2"
                    onPress={() => setSelectedRarity(null)}
                  >
                    {t('inventory.forge.showAll')}
                  </Button>
                )}
              </div>
            </div>

            {/* Equipment Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 max-h-96 overflow-y-auto py-4 px-2">
              {itemsForSelectedRarity.map((item) => {
                const isSelected = selectedEquipments.some(
                  (selected) => selected.item.tokenId === item.tokenId,
                );
                return (
                  <Card
                    key={`${item.tokenId}-${item.category}`}
                    isFooterBlurred
                    className={`bg-gray-400/30  ${isSelected
                      ? 'border-cyan-500 bg-cyan-500/10 shadow-[0_0_10px_0_rgb(8,185,219)]'
                      : 'border-black bg-gray-400/30 hover:border-gray-400 hover:bg-gray-400/40'
                      } flex items-center justify-start pt-2 cursor-pointer hover:scale-103 transition-transform`}
                    radius="md"
                    isPressable
                    onPress={() => handleEquipmentSelect(item)}
                  >
                    <Image
                      src={
                        item.metadata?.image || '/assets/images/placeholder.png'
                      }
                      alt={item.metadata?.name || ''}
                      className="pb-2 object-contain"
                      height={100}
                      width={100}
                    />

                    <CardFooter className="justify-between border-black border-1 overflow-hidden py-1 absolute rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small z-10">
                      <p className="text-tiny text-white/80 truncate">
                        {item.metadata?.name}
                      </p>
                    </CardFooter>

                    {/* Hover overlay for better UX */}
                    <div className="absolute inset-0 bg-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg pointer-events-none"></div>
                  </Card>
                );
              })}
            </div>

            {selectedRarity && itemsForSelectedRarity.length === 0 && (
              <div className="text-center text-gray-400 py-8">
                <p className="text-lg">
                  {t('inventory.forge.noItemsForRarity')}
                </p>
              </div>
            )}


          </ModalBody>
          <ModalFooter className="bg-indigo-950/80 border-t-2 border-black">
            <div className="flex flex-col gap-2 w-full">

              <div className="flex gap-2">
                <Button
                  className="bg-gray-600 hover:bg-gray-700 text-white border border-gray-500"
                  onPress={onClose}
                >
                  {t('common.close')}
                </Button>
                <Button
                  className={`px-6 py-3 rounded-lg font-semibold transition-colors ${selectedEquipments.length >= 3
                    ? 'bg-cyan-600 hover:bg-cyan-700 text-white'
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    }`}
                  onPress={onClose}
                  isDisabled={selectedEquipments.length < 3}
                >
                  {t('inventory.forge.confirmSelection')} ({selectedEquipments.length}/4)
                </Button>
              </div>
            </div>
          </ModalFooter>
        </ModalContent>
      </Modal >
    </>
  );
}
