import NFTCard from './NFTCard';

interface BonusBox {
  title: string;
  description: (percentag?: number) => string;
  image?: string;
  minAmount: number;
  maxAmount: number;
}

interface StackedNFTsProps {
  bonusBoxes: Record<string, BonusBox>;
  currentTier: string;
  bonus?: number;
}

export default function StackedNFTs({
  bonusBoxes,
  currentTier,
  bonus,
}: StackedNFTsProps) {
  const sortedTiers = Object.entries(bonusBoxes).sort(([a], [b]) => {
    if (a === currentTier) return -1;
    if (b === currentTier) return 1;
    return 0;
  });

  return (
    <div className="relative flex w-full items-center justify-center">
      {sortedTiers.map(([tier, box], index) => (
        <NFTCard
          bonus={bonus}
          key={tier}
          {...box}
          isActive={currentTier === tier}
          index={index}
        />
      ))}
    </div>
  );
}
