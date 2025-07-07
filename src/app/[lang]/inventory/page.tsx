'use client';

import { useMemo, useState } from 'react';

import type { InventoryItem } from '@/api/inventory';
import { useInventoryQuery } from '@/api/inventory';
import EquipedEquipments from '@/components/ui/EquipedEquipments';
import Inventory from '@/components/ui/Inventory';
import ItemDetailsModal from '@/components/ui/ItemDetailsModal';

interface EquippedSlots {
  Helmet?: InventoryItem;
  Relic?: InventoryItem;
  Jetpack?: InventoryItem;
  Pickaxe?: InventoryItem;
  Armour?: InventoryItem;
  Trinket?: InventoryItem;
  Belt?: InventoryItem;
}

export default function InventoryPage() {
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    data: inventoryData,
    isLoading: isInventoryLoading,
    refetch: refetchInventory,
  } = useInventoryQuery();

  // Process inventory data
  const { inventoryItems, equippedSlots } = useMemo(() => {
    if (!inventoryData?.data?.inventory)
      return { inventoryItems: [], equippedSlots: {} };

    const items: InventoryItem[] = [];
    const equipped: EquippedSlots = {};

    // Process inventory items
    inventoryData.data.inventory.forEach((item) => {
      if (item.isEquipped) {
        const slotKey = item.equipmentSlot as keyof EquippedSlots;
        equipped[slotKey] = item;
      } else {
        items.push(item);
      }
    });

    return { inventoryItems: items, equippedSlots: equipped };
  }, [inventoryData]);

  const handleItemClick = (item: InventoryItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="max-w-7xl mx-auto mt-12 px-8">
        {/* Gacha Section */}
        {/* <Gacha onRefetchInventory={refetchInventory} /> */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
          <div className="col-span-1 h-full">
            <EquipedEquipments
              equippedSlots={equippedSlots}
              onItemClick={handleItemClick}
            />
          </div>

          <div className="col-span-1 lg:col-span-2 h-full">
            <Inventory
              inventoryItems={inventoryItems}
              isInventoryLoading={isInventoryLoading}
              onItemClick={handleItemClick}
            />
          </div>
        </div>
      </div>

      {/* Item Details Modal */}
      <ItemDetailsModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        item={selectedItem}
        onEquipSuccess={() => {
          refetchInventory();
        }}
        onUnequipSuccess={() => {
          refetchInventory();
        }}
      />
    </>
  );
}
