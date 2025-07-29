'use client';

import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import useGameQuery from '@/api/game';

export default function GamePage() {
  const { t } = useTranslation();
  const { data: game, isPending } = useGameQuery();

  useEffect(() => {
    const checkAndReload = () => {
      const now = new Date();
      const utcHours = now.getUTCHours();
      const utcMinutes = now.getUTCMinutes();

      if (utcHours === 0 && utcMinutes === 0) {
        window.location.reload();
      }
    };

    const timeout = setTimeout(() => {
      checkAndReload();
      const interval = setInterval(checkAndReload, 30000);

      return () => clearInterval(interval);
    }, 60000);

    return () => clearTimeout(timeout);
  }, []);

  if (true) {
    return (
      <div className="max-w-7xl mx-auto mt-12 px-8">
        <div className="my-20 flex justify-center items-center">
          <div className="w-[800px] h-[500px] border-4 border-black rounded-[20px] bg-indigo-950 flex flex-col justify-center items-center text-center px-8">
            <p className="text-2xl text-white mb-4">{t('game.maintenance')}</p>
            <p className="text-lg text-gray-300">
              {t('game.maintenanceDescription')}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // if (isPending) {
  //   return (
  //     <div className="max-w-7xl mx-auto mt-12 px-8">
  //       <div className="my-20 flex justify-center items-center">
  //         <div className="w-[800px] h-[500px] border-4 border-black rounded-[20px] bg-indigo-950 flex justify-center items-center">
  //           <svg
  //             className="animate-spin h-8 w-8 text-cyan-50"
  //             xmlns="http://www.w3.org/2000/svg"
  //             fill="none"
  //             viewBox="0 0 24 24"
  //           >
  //             <circle
  //               className="opacity-25"
  //               cx="12"
  //               cy="12"
  //               r="10"
  //               stroke="currentColor"
  //               strokeWidth="4"
  //             ></circle>
  //             <path
  //               className="opacity-75"
  //               fill="currentColor"
  //               d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
  //             ></path>
  //           </svg>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  // if (!game?.data.hasBetaKey) {
  //   return (
  //     <div className="max-w-7xl mx-auto mt-12 px-8">
  //       <div className="my-20 flex justify-center items-center">
  //         <div className="w-[800px] h-[500px] border-4 border-black rounded-[20px] bg-indigo-950 flex flex-col justify-center items-center text-center px-8">
  //           <p className="text-2xl text-white mb-4">{t('game.noBetaKey')}</p>
  //           <p className="text-lg text-gray-300">
  //             {t('game.noBetaKeyDescription')}
  //           </p>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  // // if (game?.data.isDead) {
  // //   return (
  // //     <div className="max-w-7xl mx-auto mt-12 px-8">
  // //       <div className="my-20 flex justify-center items-center">
  // //         <div className="w-[800px] h-[500px] border-4 border-black rounded-[20px] bg-indigo-950 flex flex-col justify-center items-center text-center px-8">
  // //           <p className="text-2xl text-white mb-4">{t('game.isDead')}</p>
  // //           <p className="text-lg text-gray-300">
  // //             {t('game.isDeadDescription')}
  // //           </p>
  // //         </div>
  // //       </div>
  // //     </div>
  // //   );
  // // }

  // return (
  //   <div className="max-w-7xl mx-auto mt-12 px-8">
  //     <div className="my-20 flex justify-center items-center">
  //       <Game />
  //     </div>
  //   </div>
  // );
}
