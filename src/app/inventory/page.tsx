'use client';

import {
  Button,
  Card,
  CardFooter,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from '@heroui/react';
import { Skeleton } from '@heroui/skeleton';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useAirdropInvetoryQuery } from '@/api/airdrop';
import AuthButton from '@/components/ui/AuthButton';
import { useAuth } from '@/context/AuthContext';

interface InventoryItem {
  id: string;
  name: string;
  image?: string;
  type: 'airdropItem' | 'subscription' | 'betaKey';
  equipmentType?: string;
  rarity?: string;
  grade?: string;
  isEquipped?: boolean;
  attributes?: Array<{
    trait_type: string;
    value: string | number;
    display_type?: string;
  }>;
}

interface EquippedSlots {
  helmet?: InventoryItem;
  relic?: InventoryItem;
  jetpack?: InventoryItem;
  pickaxe?: InventoryItem;
  armour?: InventoryItem;
  trinket?: InventoryItem;
  belt?: InventoryItem;
}

export default function InventoryPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { isConnected } = useAuth();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isGachaPlaying, setIsGachaPlaying] = useState(false);
  const [gachaResult, setGachaResult] = useState<InventoryItem | null>(null);
  const [vouchers, setVouchers] = useState(5); // Mock voucher count

  const {
    data: inventoryData,
    isLoading: isInventoryLoading,
    refetch: refetchInventory,
  } = useAirdropInvetoryQuery();

  // Process inventory data
  const { inventoryItems, equippedSlots } = useMemo(() => {
    if (!inventoryData?.data) return { inventoryItems: [], equippedSlots: {} };

    const items: InventoryItem[] = [];
    const equipped: EquippedSlots = {};

    // Process airdrop items
    inventoryData.data.airdropItems?.forEach((item) => {
      const inventoryItem: InventoryItem = {
        id: item._id,
        name: item.metadata.name,
        image: item.metadata.image,
        type: 'airdropItem',
        equipmentType: item.equipmentType,
        rarity: item.rarity,
        grade: item.grade,
        attributes: item.metadata.attributes,
      };

      items.push(inventoryItem);

      // Mock equipped status (you can adjust this based on your API)
      if (item.equipmentType && Math.random() > 0.7) {
        const slotKey = item.equipmentType.toLowerCase() as keyof EquippedSlots;
        if (!equipped[slotKey]) {
          equipped[slotKey] = { ...inventoryItem, isEquipped: true };
        }
      }
    });

    // Add subscriptions
    inventoryData.data.subscriptions?.forEach((subscription) => {
      items.push({
        id: subscription._id,
        name: `${subscription.plan} Subscription`,
        image: 'https://cdn.mythicminers.com/assets/site/vip.svg',
        type: 'subscription',
      });
    });

    // Add beta key
    if (inventoryData.data.betaKey) {
      items.push({
        id: 'beta-key',
        name: 'BETA Key',
        image: 'https://cdn.mythicminers.com/assets/site/beta-key.png',
        type: 'betaKey',
      });
    }

    return { inventoryItems: items, equippedSlots: equipped };
  }, [inventoryData]);

  const handleGachaPlay = async () => {
    if (vouchers <= 0) return;

    setIsGachaPlaying(true);
    setVouchers((prev) => prev - 1);

    // Simulate gacha animation delay
    setTimeout(() => {
      // Mock gacha result
      const mockResult: InventoryItem = {
        id: 'gacha-' + Date.now(),
        name: 'Legendary Sword',
        image: '/assets/images/items/sword.png',
        type: 'airdropItem',
        equipmentType: 'Weapon',
        rarity: 'Legendary',
        grade: 'S',
      };

      setGachaResult(mockResult);
      setIsGachaPlaying(false);
      onOpen();
      refetchInventory();
    }, 3000);
  };

  const handleBuyVouchers = () => {
    // Implement voucher purchase logic
    console.log('Buy vouchers');
  };

  const handleEquipItem = (item: InventoryItem) => {
    // Implement equip logic
    console.log('Equip item:', item);
  };

  const handleUnequipItem = (slotType: keyof EquippedSlots) => {
    // Implement unequip logic
    console.log('Unequip from slot:', slotType);
  };

  const getRarityColor = (rarity?: string) => {
    switch (rarity?.toLowerCase()) {
      case 'legendary':
        return 'border-orange-500 bg-orange-500/10';
      case 'epic':
        return 'border-purple-500 bg-purple-500/10';
      case 'rare':
        return 'border-blue-500 bg-blue-500/10';
      case 'common':
        return 'border-gray-500 bg-gray-500/10';
      default:
        return 'border-gray-600 bg-gray-600/10';
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-950 to-gray-900 p-4">
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-300 hover:text-cyan-400 transition-colors mb-8"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          {t('common.back')}
        </button>

        <div className="flex flex-col items-center justify-center min-h-[80vh]">
          <h1 className="text-4xl font-bold text-cyan-500 mb-12 mythic-text-shadow">
            {t('inventory.title')}
          </h1>
          <AuthButton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-950 to-gray-900 p-4">
      <button
        onClick={() => router.back()}
        className="flex items-center text-gray-300 hover:text-cyan-400 transition-colors mb-8"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        {t('common.back')}
      </button>

      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-cyan-500 mb-12 mythic-text-shadow">
          {t('inventory.title')}
        </h1>

        {/* Gacha Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Gacha Animation */}
          <div className="bg-gray-800/50 p-8 rounded-lg border border-neutral-950">
            <h2 className="text-2xl font-bold text-cyan-500 mb-6 mythic-text-shadow">
              {t('inventory.gacha.title')}
            </h2>

            <div className="relative aspect-square bg-gradient-to-br from-purple-900 to-blue-900 rounded-lg mb-6 overflow-hidden">
              {isGachaPlaying ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-32 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                  <div className="absolute w-24 h-24 border-4 border-purple-500 border-b-transparent rounded-full animate-spin animate-reverse"></div>
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-32 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-4xl">🎲</span>
                  </div>
                </div>
              )}
            </div>

            <Button
              onClick={handleGachaPlay}
              disabled={vouchers <= 0 || isGachaPlaying}
              className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-bold py-3 px-6 rounded-lg hover:from-cyan-600 hover:to-purple-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              size="lg"
            >
              {isGachaPlaying
                ? t('inventory.gacha.playing')
                : t('inventory.gacha.play')}
            </Button>
          </div>

          {/* Gacha Info */}
          <div className="bg-gray-800/50 p-8 rounded-lg border border-neutral-950">
            <h3 className="text-xl font-bold text-gray-300 mb-4">
              {t('inventory.gacha.info')}
            </h3>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">
                  {t('inventory.gacha.vouchers')}:
                </span>
                <span className="text-cyan-400 font-bold text-xl">
                  {vouchers}
                </span>
              </div>

              <div className="text-sm text-gray-400">
                <p className="mb-2">{t('inventory.gacha.description')}</p>
                <ul className="space-y-1">
                  <li className="flex items-center">
                    <span className="w-3 h-3 bg-orange-500 rounded-full mr-2"></span>
                    {t('inventory.gacha.legendary')} - 5%
                  </li>
                  <li className="flex items-center">
                    <span className="w-3 h-3 bg-purple-500 rounded-full mr-2"></span>
                    {t('inventory.gacha.epic')} - 15%
                  </li>
                  <li className="flex items-center">
                    <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                    {t('inventory.gacha.rare')} - 30%
                  </li>
                  <li className="flex items-center">
                    <span className="w-3 h-3 bg-gray-500 rounded-full mr-2"></span>
                    {t('inventory.gacha.common')} - 50%
                  </li>
                </ul>
              </div>
            </div>

            <Button
              onClick={handleBuyVouchers}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all"
            >
              {t('inventory.gacha.buyVouchers')}
            </Button>
          </div>
        </div>

        {/* Equipped Items Section */}
        <div className="bg-gray-800/50 p-8 rounded-lg border border-neutral-950 mb-12">
          <h2 className="text-2xl font-bold text-cyan-500 mb-6 mythic-text-shadow">
            {t('inventory.equipped.title')}
          </h2>

          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
            {/* Top Row */}
            <div></div>
            <div className="aspect-square bg-gray-700/50 rounded-lg border-2 border-dashed border-gray-600 flex flex-col items-center justify-center p-2">
              {equippedSlots.helmet ? (
                <div
                  className={`w-full h-full rounded-lg border-2 ${getRarityColor(equippedSlots.helmet.rarity)} flex flex-col items-center justify-center cursor-pointer hover:opacity-80 transition-opacity`}
                  onClick={() => handleUnequipItem('helmet')}
                >
                  <Image
                    src={equippedSlots.helmet.image}
                    alt={equippedSlots.helmet.name}
                    className="w-12 h-12 object-contain"
                  />
                  <span className="text-xs text-gray-300 mt-1">
                    {equippedSlots.helmet.name}
                  </span>
                </div>
              ) : (
                <div className="text-center">
                  <div className="text-2xl mb-1">⛑️</div>
                  <span className="text-xs text-gray-500">
                    {t('inventory.slots.helmet')}
                  </span>
                </div>
              )}
            </div>
            <div className="aspect-square bg-gray-700/50 rounded-lg border-2 border-dashed border-gray-600 flex flex-col items-center justify-center p-2">
              {equippedSlots.relic ? (
                <div
                  className={`w-full h-full rounded-lg border-2 ${getRarityColor(equippedSlots.relic.rarity)} flex flex-col items-center justify-center cursor-pointer hover:opacity-80 transition-opacity`}
                  onClick={() => handleUnequipItem('relic')}
                >
                  <Image
                    src={equippedSlots.relic.image}
                    alt={equippedSlots.relic.name}
                    className="w-12 h-12 object-contain"
                  />
                  <span className="text-xs text-gray-300 mt-1">
                    {equippedSlots.relic.name}
                  </span>
                </div>
              ) : (
                <div className="text-center">
                  <div className="text-2xl mb-1">💎</div>
                  <span className="text-xs text-gray-500">
                    {t('inventory.slots.relic')}
                  </span>
                </div>
              )}
            </div>

            {/* Middle Row */}
            <div className="aspect-square bg-gray-700/50 rounded-lg border-2 border-dashed border-gray-600 flex flex-col items-center justify-center p-2">
              {equippedSlots.jetpack ? (
                <div
                  className={`w-full h-full rounded-lg border-2 ${getRarityColor(equippedSlots.jetpack.rarity)} flex flex-col items-center justify-center cursor-pointer hover:opacity-80 transition-opacity`}
                  onClick={() => handleUnequipItem('jetpack')}
                >
                  <Image
                    src={equippedSlots.jetpack.image}
                    alt={equippedSlots.jetpack.name}
                    className="w-12 h-12 object-contain"
                  />
                  <span className="text-xs text-gray-300 mt-1">
                    {equippedSlots.jetpack.name}
                  </span>
                </div>
              ) : (
                <div className="text-center">
                  <div className="text-2xl mb-1">🚀</div>
                  <span className="text-xs text-gray-500">
                    {t('inventory.slots.jetpack')}
                  </span>
                </div>
              )}
            </div>
            <div className="aspect-square bg-gray-700/50 rounded-lg border-2 border-dashed border-gray-600 flex flex-col items-center justify-center p-2">
              {equippedSlots.armour ? (
                <div
                  className={`w-full h-full rounded-lg border-2 ${getRarityColor(equippedSlots.armour.rarity)} flex flex-col items-center justify-center cursor-pointer hover:opacity-80 transition-opacity`}
                  onClick={() => handleUnequipItem('armour')}
                >
                  <Image
                    src={equippedSlots.armour.image}
                    alt={equippedSlots.armour.name}
                    className="w-12 h-12 object-contain"
                  />
                  <span className="text-xs text-gray-300 mt-1">
                    {equippedSlots.armour.name}
                  </span>
                </div>
              ) : (
                <div className="text-center">
                  <div className="text-2xl mb-1">🛡️</div>
                  <span className="text-xs text-gray-500">
                    {t('inventory.slots.armour')}
                  </span>
                </div>
              )}
            </div>
            <div className="aspect-square bg-gray-700/50 rounded-lg border-2 border-dashed border-gray-600 flex flex-col items-center justify-center p-2">
              {equippedSlots.pickaxe ? (
                <div
                  className={`w-full h-full rounded-lg border-2 ${getRarityColor(equippedSlots.pickaxe.rarity)} flex flex-col items-center justify-center cursor-pointer hover:opacity-80 transition-opacity`}
                  onClick={() => handleUnequipItem('pickaxe')}
                >
                  <Image
                    src={equippedSlots.pickaxe.image}
                    alt={equippedSlots.pickaxe.name}
                    className="w-12 h-12 object-contain"
                  />
                  <span className="text-xs text-gray-300 mt-1">
                    {equippedSlots.pickaxe.name}
                  </span>
                </div>
              ) : (
                <div className="text-center">
                  <div className="text-2xl mb-1">⛏️</div>
                  <span className="text-xs text-gray-500">
                    {t('inventory.slots.pickaxe')}
                  </span>
                </div>
              )}
            </div>

            {/* Bottom Row */}
            <div className="aspect-square bg-gray-700/50 rounded-lg border-2 border-dashed border-gray-600 flex flex-col items-center justify-center p-2">
              {equippedSlots.trinket ? (
                <div
                  className={`w-full h-full rounded-lg border-2 ${getRarityColor(equippedSlots.trinket.rarity)} flex flex-col items-center justify-center cursor-pointer hover:opacity-80 transition-opacity`}
                  onClick={() => handleUnequipItem('trinket')}
                >
                  <Image
                    src={equippedSlots.trinket.image}
                    alt={equippedSlots.trinket.name}
                    className="w-12 h-12 object-contain"
                  />
                  <span className="text-xs text-gray-300 mt-1">
                    {equippedSlots.trinket.name}
                  </span>
                </div>
              ) : (
                <div className="text-center">
                  <div className="text-2xl mb-1">💍</div>
                  <span className="text-xs text-gray-500">
                    {t('inventory.slots.trinket')}
                  </span>
                </div>
              )}
            </div>
            <div></div>
            <div className="aspect-square bg-gray-700/50 rounded-lg border-2 border-dashed border-gray-600 flex flex-col items-center justify-center p-2">
              {equippedSlots.belt ? (
                <div
                  className={`w-full h-full rounded-lg border-2 ${getRarityColor(equippedSlots.belt.rarity)} flex flex-col items-center justify-center cursor-pointer hover:opacity-80 transition-opacity`}
                  onClick={() => handleUnequipItem('belt')}
                >
                  <Image
                    src={equippedSlots.belt.image}
                    alt={equippedSlots.belt.name}
                    className="w-12 h-12 object-contain"
                  />
                  <span className="text-xs text-gray-300 mt-1">
                    {equippedSlots.belt.name}
                  </span>
                </div>
              ) : (
                <div className="text-center">
                  <div className="text-2xl mb-1">👔</div>
                  <span className="text-xs text-gray-500">
                    {t('inventory.slots.belt')}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* All Items Section */}
        <div className="bg-gray-800/50 p-8 rounded-lg border border-neutral-950">
          <h2 className="text-2xl font-bold text-cyan-500 mb-6 mythic-text-shadow">
            {t('inventory.allItems.title')}
          </h2>

          {isInventoryLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
              {Array.from({ length: 16 }).map((_, index) => (
                <Skeleton
                  key={index}
                  className="aspect-square bg-gray-600 rounded-xl"
                />
              ))}
            </div>
          ) : inventoryItems.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 max-h-96 overflow-y-auto">
              {inventoryItems.map((item) => (
                <Card
                  key={item.id}
                  isFooterBlurred
                  className={`border-2 ${getRarityColor(item.rarity)} cursor-pointer hover:scale-105 transition-transform`}
                  radius="lg"
                  onClick={() => handleEquipItem(item)}
                >
                  <Image
                    src={item.image || '/assets/images/placeholder.png'}
                    alt={item.name}
                    className="object-contain"
                    height={120}
                    width={120}
                  />
                  <CardFooter className="justify-between border-white/20 border-1 overflow-hidden py-1 absolute rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small z-10">
                    <p className="text-tiny text-white/80 truncate">
                      {item.name}
                    </p>
                    {item.rarity && (
                      <div
                        className={`w-3 h-3 rounded-full ${
                          item.rarity === 'legendary'
                            ? 'bg-orange-500'
                            : item.rarity === 'epic'
                              ? 'bg-purple-500'
                              : item.rarity === 'rare'
                                ? 'bg-blue-500'
                                : 'bg-gray-500'
                        }`}
                      ></div>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-400 py-12">
              <p className="text-lg">{t('inventory.allItems.empty')}</p>
            </div>
          )}
        </div>
      </div>

      {/* Gacha Result Modal */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="lg">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h2 className="text-2xl font-bold text-cyan-500">
                  {t('inventory.gacha.result')}
                </h2>
              </ModalHeader>
              <ModalBody>
                {gachaResult && (
                  <div className="text-center">
                    <div
                      className={`inline-block p-4 rounded-lg border-2 ${getRarityColor(gachaResult.rarity)} mb-4`}
                    >
                      <Image
                        src={
                          gachaResult.image || '/assets/images/placeholder.png'
                        }
                        alt={gachaResult.name}
                        className="object-contain mx-auto"
                        height={150}
                        width={150}
                      />
                    </div>
                    <h3 className="text-xl font-bold text-gray-300 mb-2">
                      {gachaResult.name}
                    </h3>
                    <p className="text-lg text-cyan-400 mb-4">
                      {gachaResult.rarity} {gachaResult.equipmentType}
                    </p>
                    <p className="text-gray-400">
                      {t('inventory.gacha.congratulations')}
                    </p>
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onPress={onClose}>
                  {t('common.close')}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
