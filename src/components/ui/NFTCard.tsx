import Image from 'next/image';

interface NFTCardProps {
  title: string;
  description: (percentag?: number) => string;
  image?: string;
  minAmount: number;
  isActive: boolean;
  index: number;
  bonus?: number;
}

export default function NFTCard({
  title,
  description,
  image,
  minAmount,
  isActive,
  index,
  bonus,
}: NFTCardProps) {
  console.log(isActive);
  return (
    <div
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
        {image && (
          <Image
            src={image}
            alt={`Founders Pack Pickaxe`}
            width={300}
            height={150}
            className=" object-cover"
            draggable={false}
          />
        )}
        <div className="flex-1 text-center">
          <h3 className="text-2xl font-bold mt-2 mb-2 text-cyan-400 mythic-text-shadow">
            {title}
          </h3>
          <p className="text-gray-300 max-w-md px-8 mt-4 mb-10">
            {description(bonus)}
          </p>
          <p className="text-sm text-gray-400 mt-2">
            {minAmount === 0
              ? 'Starting from 15 POL'
              : `Requires ${minAmount} POL`}
          </p>
        </div>
      </div>
    </div>
  );
}
