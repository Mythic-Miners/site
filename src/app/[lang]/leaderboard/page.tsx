'use client';

import { Skeleton } from '@heroui/skeleton';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { useLeaderboardQuery } from '@/api/leaderboard';
import Header from '@/components/ui/Header';

import type { LeaderboardEntry } from '@/api/leaderboard';

const SLOT_ORDER: Array<keyof LeaderboardEntry['equipments']> = [
  'helmet',
  'pickaxe',
  'armour',
  'jetpack',
  'belt',
  'trinket',
  'relic',
];

const rarityStyles: Record<string, string> = {
  timeless: 'border-red-400 bg-red-500/10 text-red-200',
  legendary: 'border-amber-300 bg-amber-400/10 text-amber-200',
  epic: 'border-violet-400 bg-violet-500/10 text-violet-200',
  rare: 'border-cyan-400 bg-cyan-500/10 text-cyan-200',
  uncommon: 'border-emerald-400 bg-emerald-500/10 text-emerald-200',
  common: 'border-slate-500 bg-slate-500/10 text-slate-200',
};

const getRarityClass = (rarity?: string) => {
  if (!rarity) return 'border-slate-700 bg-slate-800/50 text-slate-200';
  return rarityStyles[rarity.toLowerCase()] || 'border-slate-700 bg-slate-800/50 text-slate-200';
};

const formatAddress = (address: string) =>
  address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '';


type VirtualRow =
  | { type: 'entry'; entry: LeaderboardEntry; key: string }
  | { type: 'divider'; label: string; key: string }
  | { type: 'scoring'; key: string };


export default function LeaderboardPage() {
  const { t } = useTranslation();
  const parentRef = useRef<HTMLDivElement>(null);

  const { data, isLoading } = useLeaderboardQuery();

  const rows = useMemo<VirtualRow[]>(() => {
    if (!data?.data) return [];

    const topEntries = data.data.top100 ?? [];
    const aroundEntries = data.data.aroundUser ?? [];

    const virtualRows: VirtualRow[] = [];

    topEntries.forEach((entry) => {
      virtualRows.push({
        type: 'entry',
        entry,
        key: `top-${entry.rank}`,
      });
    });

    const topAddresses = new Set(topEntries.map((entry) => entry.address));
    const dedupAround = aroundEntries.filter(
      (entry) => !topAddresses.has(entry.address),
    );

    if (dedupAround.length > 0) {
      virtualRows.push({
        type: 'divider',
        label: t('leaderboard.aroundYouSection'),
        key: 'divider-around',
      });

      dedupAround.forEach((entry, index) => {
        virtualRows.push({
          type: 'entry',
          entry,
          key: `around-${entry.rank}-${index}`,
        });
      });
    }

    // Adicionar seção de pontuação no final
    virtualRows.push({
      type: 'scoring',
      key: 'scoring-info',
    });

    return virtualRows;
  }, [data?.data, t]);

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: (index) => {
      const row = rows[index];
      if (row?.type === 'divider') return 50;
      return 140;
    },
    overscan: 8,
  });

  useEffect(() => {
    if (!parentRef.current || rows.length === 0) return;

    const index = rows.findIndex(
      (row) => row.type === 'entry' && row.entry.currentUser,
    );

    if (index >= 0) {
      virtualizer.scrollToIndex(index, { align: 'center' });
    }
  }, [rows, virtualizer]);

  const updatedAt = useMemo(() => {
    const iso = data?.data?.updatedAt;
    if (!iso) return null;

    try {
      const date = new Date(iso);
      return new Intl.DateTimeFormat(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(date);
    } catch {
      return null;
    }
  }, [data?.data?.updatedAt]);

  const rarityRows = useMemo(
    () => [
      { label: t('leaderboard.scoring.rarity.uncommon'), value: '50' },
      { label: t('leaderboard.scoring.rarity.rare'), value: '150' },
      { label: t('leaderboard.scoring.rarity.epic'), value: '500' },
      { label: t('leaderboard.scoring.rarity.legendary'), value: '1.700' },
      { label: t('leaderboard.scoring.rarity.timeless'), value: '6.000' },
    ],
    [t],
  );

  const gradeRows = useMemo(
    () => [
      { label: 'C', value: '×1.0' },
      { label: 'B', value: '×1.1' },
      { label: 'A', value: '×1.3' },
      { label: 'S', value: '×1.5' },
      { label: t('leaderboard.scoring.grades.limitedEdition'), value: '×1.8' },
    ],
    [t],
  );

  const typeRows = useMemo(
    () => [
      { label: t('leaderboard.scoring.types.pickaxe'), value: '×1.0' },
      { label: t('leaderboard.scoring.types.helmet'), value: '×1.0' },
      { label: t('leaderboard.scoring.types.armour'), value: '×1.0' },
      { label: t('leaderboard.scoring.types.belt'), value: '×1.25' },
      { label: t('leaderboard.scoring.types.jetpack'), value: '×1.25' },
      { label: t('leaderboard.scoring.types.trinket'), value: '×1.5' },
      { label: t('leaderboard.scoring.types.relic'), value: '×1.8' },
    ],
    [t],
  );


  return (
    <div className="text-neutral-100">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <section className="mb-10">
          <h1 className="text-4xl sm:text-5xl font-bold text-yellow-50 mythic-text-shadow">
            {t('leaderboard.title')}
          </h1>
        </section>

        <section className="bg-indigo-950 border-2 border-black rounded-2xl shadow-lg p-6 sm:p-8">
          <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-semibold text-cyan-300 mythic-text-shadow">
                {t('leaderboard.topHeading')}
              </h2>
              {updatedAt && (
                <p className="mt-2 text-sm text-neutral-400">
                  {t('leaderboard.lastUpdated', { date: updatedAt })}
                </p>
              )}
            </div>

          </header>

          <div
            ref={parentRef}
            className="relative h-[600px] overflow-auto rounded-xl border border-indigo-900 bg-indigo-950/60"
          >
            <div
              style={{ height: `${virtualizer.getTotalSize()}px`, position: 'relative' }}
            >
              {rows.length === 0 && !isLoading ? (
                <div className="absolute inset-0 flex items-center justify-center text-neutral-500">
                  {t('leaderboard.emptyState')}
                </div>
              ) : (
                virtualizer.getVirtualItems().map((virtualRow) => {
                  const row = rows[virtualRow.index];
                  const style = {
                    position: 'absolute' as const,
                    top: 0,
                    left: 0,
                    width: 'calc(100% - 30px)',
                    transform: `translateY(${virtualRow.start}px)`,
                  };

                  if (row.type === 'divider') {
                    return (
                      <div
                        key={row.key}
                        style={{
                          top: 0,
                          left: 16,
                          width: '100%',
                          transform: `translateY(${virtualRow.start}px)`,
                          borderBottom: '2px dashed #53e9fc',
                        }}
                        className="px-4 py-3 text-xs uppercase tracking-wide text-neutral-400"
                      >
                      </div>
                    );
                  }

                  if (row.type === 'entry') {
                    const entry = row.entry;
                    const isCurrentUser = entry.currentUser;
                    const displayName = entry.username || formatAddress(entry.address);
                    const rankColors = getRankColors(entry.rank);

                    return (
                      <div
                        key={row.key}
                        style={style}
                        className={`px-4 py-3 sm:px-6 ${isCurrentUser
                          ? 'bg-cyan-500/10 border-2 border-cyan-400 shadow-[0_0_16px_rgba(34,211,238,0.35)]'
                          : 'border border-indigo-900/80 bg-indigo-950'
                          } rounded-xl mx-4 my-1 transition-colors`}
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-4 flex-1">
                            {/* Posição com cores */}
                            <div
                              className={`flex h-12 w-12 flex-col items-center justify-center rounded-lg border-2 font-bold text-lg ${rankColors}`}
                            >
                              #{entry.rank}
                            </div>

                            {/* Nome e pontuação */}
                            <div className="flex-1">
                              <p className="text-lg font-semibold text-yellow-50">
                                {displayName || t('leaderboard.unknownPlayer')}
                              </p>
                              <p className="text-sm text-neutral-400">
                                {t('leaderboard.scoreLabel', {
                                  value: entry.score.toLocaleString(),
                                })}
                              </p>
                              {isCurrentUser && (
                                <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-cyan-500/20 px-2 py-1 text-xs font-semibold text-cyan-200">
                                  {t('leaderboard.currentPlayer')}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Avatar do personagem */}
                          <CharacterAvatar equipments={entry.equipments} />
                        </div>
                      </div>
                    );
                  }
                })
              )}

              {isLoading && rows.length === 0 && (
                <div className="absolute inset-0 space-y-4 px-4 py-6">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Skeleton
                      key={index}
                      className="h-32 rounded-xl bg-indigo-900/40 before:bg-gradient-to-r before:from-indigo-800 before:via-[#ffffff30] before:to-indigo-900"
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>


        <section className="mt-12 bg-indigo-950 border-2 border-black rounded-2xl shadow-lg p-6 sm:p-8">
          <h2 className="text-3xl font-semibold text-yellow-100 mythic-text-shadow">
            {t('leaderboard.scoring.title')}
          </h2>
          <p className="mt-4 text-neutral-300">{t('leaderboard.scoring.description')}</p>

          <div className="mt-6 space-y-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h3 className="text-xl font-semibold text-cyan-300 mythic-text-shadow">
                {t('leaderboard.scoring.rarityTitle')}
              </h3>
              <div className="mt-3 overflow-hidden rounded-lg border border-indigo-900">
                <table className="min-w-full divide-y divide-indigo-900 text-sm">
                  <thead className="bg-indigo-900/40 text-xs uppercase tracking-wide text-neutral-300">
                    <tr>
                      <th className="px-4 py-2 text-left">
                        {t('leaderboard.scoring.rarityHeader')}
                      </th>
                      <th className="px-4 py-2 text-left">
                        {t('leaderboard.scoring.pointsHeader')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-indigo-900/50">
                    {rarityRows.map((row) => (
                      <tr key={row.label} className="text-neutral-100">
                        <td className="px-4 py-2">{row.label}</td>
                        <td className="px-4 py-2">{row.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-cyan-300 mythic-text-shadow">
                {t('leaderboard.scoring.gradeTitle')}
              </h3>
              <div className="mt-3 overflow-hidden rounded-lg border border-indigo-900">
                <table className="min-w-full divide-y divide-indigo-900 text-sm">
                  <thead className="bg-indigo-900/40 text-xs uppercase tracking-wide text-neutral-300">
                    <tr>
                      <th className="px-4 py-2 text-left">
                        {t('leaderboard.scoring.gradeHeader')}
                      </th>
                      <th className="px-4 py-2 text-left">
                        {t('leaderboard.scoring.multiplierHeader')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-indigo-900/50">
                    {gradeRows.map((row) => (
                      <tr key={row.label} className="text-neutral-100">
                        <td className="px-4 py-2">{row.label}</td>
                        <td className="px-4 py-2">{row.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-cyan-300 mythic-text-shadow">
                {t('leaderboard.scoring.typeTitle')}
              </h3>
              <div className="mt-3 overflow-hidden rounded-lg border border-indigo-900">
                <table className="min-w-full divide-y divide-indigo-900 text-sm">
                  <thead className="bg-indigo-900/40 text-xs uppercase tracking-wide text-neutral-300">
                    <tr>
                      <th className="px-4 py-2 text-left">
                        {t('leaderboard.scoring.typeHeader')}
                      </th>
                      <th className="px-4 py-2 text-left">
                        {t('leaderboard.scoring.multiplierHeader')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-indigo-900/50">
                    {typeRows.map((row) => (
                      <tr key={row.label} className="text-neutral-100">
                        <td className="px-4 py-2">{row.label}</td>
                        <td className="px-4 py-2">{row.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-cyan-300 mythic-text-shadow">
                {t('leaderboard.scoring.monthlyRewardsTitle')}
              </h3>
              <div className="mt-3 overflow-hidden rounded-lg border border-indigo-900">
                <table className="min-w-full divide-y divide-indigo-900 text-sm">
                  <thead className="bg-indigo-900/40 text-xs uppercase tracking-wide text-neutral-300">
                    <tr>
                      <th className="px-4 py-2 text-left">
                        {t('leaderboard.scoring.monthlyRewardsPosition')}
                      </th>
                      <th className="px-4 py-2 text-left">
                        {t('leaderboard.scoring.monthlyRewardsPrize')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-indigo-900/50">
                    <tr className="text-neutral-100">
                      <td className="px-4 py-2">{t('leaderboard.scoring.monthlyRewardsFirst')}</td>
                      <td className="px-4 py-2 text-yellow-400 font-semibold">{t('leaderboard.scoring.monthlyRewardsFirstPrize')}</td>
                    </tr>
                    <tr className="text-neutral-100">
                      <td className="px-4 py-2">{t('leaderboard.scoring.monthlyRewardsSecond')}</td>
                      <td className="px-4 py-2 text-gray-300 font-semibold">{t('leaderboard.scoring.monthlyRewardsSecondPrize')}</td>
                    </tr>
                    <tr className="text-neutral-100">
                      <td className="px-4 py-2">{t('leaderboard.scoring.monthlyRewardsThird')}</td>
                      <td className="px-4 py-2 text-amber-400 font-semibold">{t('leaderboard.scoring.monthlyRewardsThirdPrize')}</td>
                    </tr>
                    <tr className="text-neutral-100">
                      <td className="px-4 py-2">{t('leaderboard.scoring.monthlyRewardsTop10')}</td>
                      <td className="px-4 py-2 text-purple-300 font-semibold">{t('leaderboard.scoring.monthlyRewardsTop10Prize')}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="my-2 text-xs text-neutral-400">
                {t('leaderboard.scoring.monthlyRewardsNote')}
              </p>
              <div className="rounded-xl border border-indigo-900 bg-indigo-950/60 p-3  text-sm text-neutral-200">
                <h3 className="text-md font-semibold text-emerald-300 mythic-text-shadow">
                  {t('leaderboard.scoring.formulaTitle')}
                </h3>
                <p className="mt-2">{t('leaderboard.scoring.formulaDescription')}</p>
              </div>
            </div>


          </div>
        </section>

      </main>
    </div>
  );
}


// Função para obter cores baseadas na posição
const getRankColors = (rank: number) => {
  if (rank === 1) return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-yellow-900 border-yellow-500 mythic-text-shadow-white';
  if (rank === 2) return 'bg-gradient-to-r from-gray-300 to-gray-500 text-gray-900 border-gray-400 mythic-text-shadow-white';
  if (rank === 3) return 'bg-gradient-to-r from-amber-600 to-amber-800 text-amber-100 border-amber-500 mythic-text-shadow';
  if (rank <= 10) return 'bg-gradient-to-r from-purple-500 to-purple-700 text-purple-100 border-purple-400 mythic-text-shadow';
  return 'bg-gradient-to-r from-slate-600 to-slate-800 text-slate-100 border-slate-500 mythic-text-shadow';
};

// Componente para renderizar o personagem com equipamentos
const CharacterAvatar = ({ equipments }: { equipments: LeaderboardEntry['equipments'] }) => {
  return (
    <div style={{ position: 'relative', width: '70px', height: '100px', minWidth: '70px' }}>
      <img
        style={{
          position: 'absolute', zIndex: 10, top: '41px',
          left: '8px'
        }}
        src={getEquipmentImage('armour', equipments)}
        width="50"
        height="50"
        alt="Body"
      />

      <img
        style={{
          position: 'absolute',
          zIndex: 5,
          right: '12px',
          transform: 'rotate(-62deg)',
          top: '54px'
        }}
        src={getEquipmentImage('leftArm', equipments)}
        width="25"
        height="25"
        alt="Left arm"
      />

      <img
        style={{
          position: 'absolute',
          zIndex: 4,
          right: '7px',
          transform: 'rotate(-63deg)',
          top: '62px'
        }}
        src={getEquipmentImage('leftHand', equipments)}
        width="19"
        height="19"
        alt="Left hand"
      />

      <img
        style={{ position: 'absolute', zIndex: 5, right: '19px', top: '72px' }}
        src={getEquipmentImage('leftLeg', equipments)}
        width="20"
        height="20"
        alt="Left leg"
      />

      <img
        style={{
          position: 'absolute',
          zIndex: 15,
          left: '11px',
          transform: 'rotate(4deg)',
          top: '56px'
        }}
        src={getEquipmentImage('rightArm', equipments)}
        width="22"
        height="22"
        alt="Right arm"
      />

      <img
        style={{
          position: 'absolute',
          zIndex: 14,
          left: '11px',
          transform: 'rotate(-15deg)',
          top: '65px'
        }}
        src={getEquipmentImage('rightHand', equipments)}
        width="19"
        height="19"
        alt="Right hand"
      />

      <img
        style={{ position: 'absolute', zIndex: 6, left: '16px', top: '72px' }}
        src={getEquipmentImage('rightLeg', equipments)}
        width="20"
        height="20"
        alt="Right leg"
      />

      <img
        style={{
          position: 'absolute',
          zIndex: -10,
          right: '-16px',
          top: '46px',
          transform: 'rotate(-63deg)'
        }}
        src={getEquipmentImage('pickaxe', equipments)}
        width="50"
        height="35"
        alt="Pickaxe"
      />


      <img
        style={{
          position: 'absolute',
          zIndex: -10,
          left: '6px',
          top: '51px',
          transform: 'rotate(5deg)'
        }}
        src={getEquipmentImage('jetpack', equipments)}
        width="20"
        height="31"
        alt="Jetpack"
      />

      <img
        style={{ position: 'absolute', zIndex: 14, left: '0px', top: '0px' }}
        src={getEquipmentImage('helmet', equipments)}
        width="80"
        height="80"
        alt="Helmet"
      />

      {getEquipmentImage('face', equipments) && (
        <img
          style={{ position: 'absolute', zIndex: 14, left: '18px', top: '23px' }}
          src={getEquipmentImage('face', equipments)}
          width="47"
          height="38"
          alt="Face"
        />
      )}
    </div>
  );
};

const getEquipmentImage = (slot: string, equipments: LeaderboardEntry['equipments']) => {

  let formattedSlot = slot;
  if (slot === 'face') {
    formattedSlot = 'helmet';
  } else if (slot === 'leftArm') {
    formattedSlot = 'armour';
  } else if (slot === 'leftHand') {
    formattedSlot = 'armour';
  } else if (slot === 'leftLeg') {
    formattedSlot = 'armour';
  } else if (slot === 'rightArm') {
    formattedSlot = 'armour';
  } else if (slot === 'rightHand') {
    formattedSlot = 'armour';
  } else if (slot === 'rightLeg') {
    formattedSlot = 'armour';
  }

  // @ts-ignore
  const equipment = equipments?.[formattedSlot];
  let imageMap;
  if (!equipment) {
    imageMap = {
      helmet: '/assets/in-game/helmet/head_common.png',
      pickaxe: '/assets/in-game/pickaxe/pickaxe_common.png',
      armour: '/assets/in-game/armour/common/body.png', // Corpo base
      leftArm: '/assets/in-game/armour/common/left-arm.png', // Corpo base
      leftHand: '/assets/in-game/armour/common/left-hand.png', // Corpo base
      leftLeg: '/assets/in-game/armour/common/left-leg.png', // Corpo base
      rightArm: '/assets/in-game/armour/common/right-arm.png', // Corpo base
      rightHand: '/assets/in-game/armour/common/right-hand.png', // Corpo base
      rightLeg: '/assets/in-game/armour/common/right-leg.png', // Corpo base
      jetpack: '/assets/in-game/jetpack/jet_common.png',
      belt: null, // Belt não tem representação visual específica no HTML fornecido
      trinket: null, // Trinket não tem representação visual específica
      relic: null, // Relic não tem representação visual específica no HTML fornecido
      face: '/assets/in-game/helmet/face.png',
    }
  } else {
    // Check if helmet is epic, timeless, or legendary - hide face for these rarities
    const helmetRarity = equipment.rarity?.toLowerCase();
    const shouldHideFace = (helmetRarity === 'rare' && !equipment.edition) || helmetRarity === 'epic' || helmetRarity === 'timeless' || helmetRarity === 'legendary';

    imageMap = {
      helmet: `/assets/in-game/helmet/head_${equipment.rarity!.toLowerCase()}${equipment.edition ? '_' + equipment.edition.toLowerCase() : ''}.png`,
      pickaxe: `/assets/in-game/pickaxe/pickaxe_${equipment.rarity!.toLowerCase()}${equipment.edition ? '_' + equipment.edition.toLowerCase() : ''}.png`,
      armour: `/assets/in-game/armour/${equipment.rarity!.toLowerCase()}/body${equipment.edition ? '_' + equipment.edition.toLowerCase() : ''}.png`,
      leftArm: `/assets/in-game/armour/${equipment.rarity!.toLowerCase()}/left-arm${equipment.edition ? '_' + equipment.edition.toLowerCase() : ''}.png`, // Corpo base
      leftHand: `/assets/in-game/armour/${equipment.rarity!.toLowerCase()}/left-hand${equipment.edition ? '_' + equipment.edition.toLowerCase() : ''}.png`, // Corpo base
      leftLeg: `/assets/in-game/armour/${equipment.rarity!.toLowerCase()}/left-leg${equipment.edition ? '_' + equipment.edition.toLowerCase() : ''}.png`, // Corpo base
      rightArm: `/assets/in-game/armour/${equipment.rarity!.toLowerCase()}/right-arm${equipment.edition ? '_' + equipment.edition.toLowerCase() : ''}.png`, // Corpo base
      rightHand: `/assets/in-game/armour/${equipment.rarity!.toLowerCase()}/right-hand${equipment.edition ? '_' + equipment.edition.toLowerCase() : ''}.png`, // Corpo base
      rightLeg: `/assets/in-game/armour/${equipment.rarity!.toLowerCase()}/right-leg${equipment.edition ? '_' + equipment.edition.toLowerCase() : ''}.png`, // Corpo base
      jetpack: `/assets/in-game/jetpack/jet_${equipment.rarity!.toLowerCase()}${equipment.edition ? '_' + equipment.edition.toLowerCase() : ''}.png`,
      belt: null, // Belt não tem representação visual específica no HTML fornecido
      trinket: null, // Trinket não tem representação visual específica
      relic: null, // Relic não tem representação visual específica
      face: shouldHideFace ? null : '/assets/in-game/helmet/face.png',
    };
  }

  // Mapear os slots para as imagens corretas

  return imageMap[slot] || '';
};