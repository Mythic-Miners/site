import Image from 'next/image';
import { useTranslation } from 'react-i18next';

interface BonusBox {
  title: string;
  description: string;
  image?: string;
  minAmount: string;
  amout: number;
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
  const { t } = useTranslation();

  const sortedTiers = Object.entries(bonusBoxes).sort(([a], [b]) => {
    if (a === currentTier) return -1;
    if (b === currentTier) return 1;
    return 0;
  });

  return (
    <div className="relative flex w-full items-center justify-center">
      {sortedTiers.map(([key, box], index) => {
        const isActive = key === currentTier;
        return (
          <div
            key={key}
            className={`w-full lg:w-auto transition-all duration-500 h-[550px] md:h-[500px] lg:absolute  bg-linear-to-b from-slate-900 to-stone-900  border-2 border-neutral-950 bg-gray-800 rounded-xl shadow-xl flex items-center justify-center translate-x-0 translate-y-0 ${
              isActive ? 'block' : 'hidden lg:block'
            }`}
            style={{
              transform: `translateX(${index * 20}px) translateY(${index * 20}px)`,
              zIndex: isActive ? 10 : 9 - index,
            }}
          >
            <div
              className="p-6 flex flex-col justify-center items-center gap-6"
              style={{ visibility: isActive ? 'visible' : 'hidden' }}
            >
              {box.image && (
                <Image
                  src={box.image}
                  alt={t(box.title)}
                  width={currentTier === 'tier5' ? 360 : 300}
                  height={currentTier === 'tier5' ? 180 : 150}
                  className="object-cover"
                  draggable={false}
                />
              )}
              <div className="flex-1 text-center">
                <h3 className="text-2xl font-bold mt-2 mb-2 text-cyan-400 mythic-text-shadow">
                  {t(box.title)}
                </h3>
                <p className="text-gray-300 max-w-md px-8 mt-4 mb-10">
                  {t(box.description, { percentage: bonus ?? 'X' })}
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  {t(box.minAmount.toString())}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
