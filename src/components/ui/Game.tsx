'use client';

import { useEffect, useState } from 'react';
import { Unity, useUnityContext } from 'react-unity-webgl';

export default function Game() {
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const { addEventListener, removeEventListener, unityProvider, isLoaded } =
    useUnityContext({
      loaderUrl: '/assets/game/mythicminers.loader.js',
      dataUrl: '/assets/game/mythicminers.data',
      frameworkUrl: '/assets/game/mythicminers.framework.js',
      codeUrl: '/assets/game/mythicminers.wasm',
    });

  useEffect(() => {
    const handleDataLoadedEvent = () => {
      setIsDataLoaded(true);
    };

    addEventListener('data_loaded', handleDataLoadedEvent);
    return () => removeEventListener('data_loaded', handleDataLoadedEvent);
  }, [addEventListener, removeEventListener]);

  return (
    <div className="relative flex justify-center items-center">
      <Unity
        unityProvider={unityProvider}
        style={{
          width: 800,
          height: 500,
          borderRadius: 20,
          border: '4px solid black',
        }}
      />
      {(!isDataLoaded || !isLoaded) && (
        <div className="absolute top-0 left-0 w-[800px] h-[500px]  rounded-[20px] bg-zinc-950 flex justify-center items-center">
          <svg
            className="animate-spin h-8 w-8 text-cyan-50"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
      )}
    </div>
  );
}
