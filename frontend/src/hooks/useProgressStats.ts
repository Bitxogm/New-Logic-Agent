// frontend/src/hooks/useProgressStats.ts

import { useQuery } from '@tanstack/react-query';
import { gamificationService } from '@/services/gamificationService';
import type { ProgressStats } from '@/services/gamificationService';

export const useProgressStats = (userId: string | null, days = 7) => {
  return useQuery<ProgressStats>({
    queryKey: ['progress-stats', userId, days],
    queryFn: () => gamificationService.getProgressStats(userId!, days),
    enabled: !!userId,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};