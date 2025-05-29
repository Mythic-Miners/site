'use client';

import { useQuery } from '@tanstack/react-query';

export interface IcoStatus {
  stage: number;
  bonus: number;
  vestingPeriod: number;
  totalRaised: number;
  apr: number;
}

const useIcoStatusQuery = () =>
  useQuery<{ data: IcoStatus }>({
    queryKey: ['/ico/status'],
  });

export default useIcoStatusQuery;
