// frontend/src/hooks/useGamification.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { gamificationService } from '@/services/gamificationService';
import type { UserStats, CompleteExerciseResponse, Achievement } from '@/services/gamificationService';
import { toast } from 'sonner';
import { useConfetti } from './useConfetti';

export const useGamification = (userId: string | null) => {
  const queryClient = useQueryClient();
  const { celebrateExerciseComplete, celebrateAchievement } = useConfetti();

  // Get user stats
  const { data: stats, isLoading } = useQuery<UserStats>({
    queryKey: ['gamification-stats', userId],
    queryFn: () => gamificationService.getUserStats(userId!),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Complete exercise mutation
  const completeExerciseMutation = useMutation<
    CompleteExerciseResponse,
    Error,
    {
      exerciseId: string;
      difficulty: string;
      timeSpent?: number;
      perfectScore?: boolean;
    }
  >({
    mutationFn: ({
      exerciseId,
      difficulty,
      timeSpent,
      perfectScore,
    }) => gamificationService.completeExercise(userId!, exerciseId, difficulty, timeSpent, perfectScore),
    onSuccess: (data: CompleteExerciseResponse) => {
      // Invalidate stats to refetch
      queryClient.invalidateQueries({ queryKey: ['gamification-stats', userId] });

      // Show XP gained
      toast.success(`+${data.data.xpAwarded} XP earned! 🎉`);

      // Celebrate exercise completion
      celebrateExerciseComplete();

      // Level up notification
      if (data.data.leveledUp) {
        toast.success(`🎊 Level Up! You're now level ${data.data.level}!`, {
          duration: 5000,
        });
      }

      // New achievements
      if (data.data.newAchievements && data.data.newAchievements.length > 0) {
        data.data.newAchievements.forEach((achievement: Achievement) => {
          toast.success(`🏆 Achievement Unlocked: ${achievement.name}!`, {
            description: achievement.description,
            duration: 5000,
          });
          celebrateAchievement();
        });
      }

      // Streak notification
      if (data.data.currentStreak > 1) {
        toast.info(`🔥 ${data.data.currentStreak} day streak!`);
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to save progress');
    },
  });

  return {
    stats,
    isLoading,
    completeExercise: completeExerciseMutation.mutate,
    isCompleting: completeExerciseMutation.isPending,
  };
};