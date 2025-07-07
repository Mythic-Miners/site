'use client';

import {
  Button,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from '@heroui/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

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

interface GachaProps {
  onRefetchInventory: () => void;
}

export default function Gacha({ onRefetchInventory }: GachaProps) {
  const { t } = useTranslation();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isGachaPlaying, setIsGachaPlaying] = useState(false);
  const [gachaResult, setGachaResult] = useState<InventoryItem | null>(null);
  const [vouchers, setVouchers] = useState(5); // Mock voucher count

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
      onRefetchInventory();
    }, 3000);
  };

  const handleBuyVouchers = () => {
    // Implement voucher purchase logic
    console.log('Buy vouchers');
  };

  return (
    <>
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
            onPress={handleGachaPlay}
            isDisabled={vouchers <= 0 || isGachaPlaying}
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
            onPress={handleBuyVouchers}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all"
          >
            {t('inventory.gacha.buyVouchers')}
          </Button>
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
    </>
  );
}
