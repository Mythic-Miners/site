'use client';

import { useQuery } from '@tanstack/react-query';

export interface Game {
  hasBetaKey: number;
}

const useGameQuery = () =>
  useQuery<{ data: Game }>({
    queryKey: ['/game'],
  });

export default useGameQuery;
