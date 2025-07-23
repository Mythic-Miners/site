'use client';

import { Unity, useUnityContext } from 'react-unity-webgl';

export default function Game() {
  const { unityProvider } = useUnityContext({
    loaderUrl: '/assets/game/mythicminers.loader.js',
    dataUrl: '/assets/game/mythicminers.data',
    frameworkUrl: '/assets/game/mythicminers.framework.js',
    codeUrl: '/assets/game/mythicminers.wasm',
  });

  return (
    <Unity
      unityProvider={unityProvider}
      style={{
        width: 800,
        height: 500,
        borderRadius: 20,
        border: '4px solid black',
      }}
    />
  );
}
