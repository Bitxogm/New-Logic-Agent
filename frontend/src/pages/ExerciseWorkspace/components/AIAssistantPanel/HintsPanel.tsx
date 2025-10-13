// frontend/src/pages/ExerciseWorkspace/components/AIAssistantPanel/HintsPanel.tsx

import { useState } from 'react';
import { Lightbulb, Lock, Unlock, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { gamificationService } from '@/services/gamificationService';
import { useAuthStore } from '@/store/authStore';
import { useQueryClient } from '@tanstack/react-query';

interface HintsPanelProps {
  exerciseId: string;
  hints: string[];
}

export default function HintsPanel({ exerciseId, hints }: HintsPanelProps) {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [unlockedHints, setUnlockedHints] = useState<number[]>([]);
  const [isUnlocking, setIsUnlocking] = useState(false);

  if (!hints || hints.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <Lightbulb className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
          <p className="text-muted-foreground">No hints available for this exercise</p>
          <p className="text-xs text-muted-foreground mt-2">
            Try solving it on your own! 💪
          </p>
        </CardContent>
      </Card>
    );
  }

  const handleUnlockHint = async (hintIndex: number) => {
    if (!user) {
      toast.error('Please login to use hints');
      return;
    }

    // Check if previous hints are unlocked
    if (hintIndex > 0 && !unlockedHints.includes(hintIndex - 1)) {
      toast.error('Unlock previous hints first!');
      return;
    }

    // Check if already unlocked
    if (unlockedHints.includes(hintIndex)) {
      return;
    }

    setIsUnlocking(true);

    try {
      const response = await gamificationService.useHint(
        user._id,
        exerciseId,
        hintIndex + 1
      );

      setUnlockedHints([...unlockedHints, hintIndex]);

      toast.warning(`Hint unlocked! -${response.data.xpDeducted} XP`, {
        description: `You now have ${response.data.totalXP} XP`,
      });

      // Refresh stats
      queryClient.invalidateQueries({ queryKey: ['gamification-stats', user._id] });
    } catch (error: any) {
      toast.error(error.message || 'Failed to unlock hint');
    } finally {
      setIsUnlocking(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* Header Info */}
      <Card className="border-yellow-500/20 bg-yellow-500/5">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-500" />
            <CardTitle className="text-sm">Hints System</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="text-xs text-muted-foreground space-y-2">
          <p>💡 Hints help you when you're stuck</p>
          <p>⚠️ Each hint costs <strong>10 XP</strong></p>
          <p>🔒 Unlock hints progressively (1 → 2 → 3)</p>
        </CardContent>
      </Card>

      {/* Hints List */}
      {hints.map((hint, index) => {
        const isLocked = !unlockedHints.includes(index);
        const isPreviousLocked = index > 0 && !unlockedHints.includes(index - 1);
        const canUnlock = !isLocked || !isPreviousLocked;

        return (
          <Card
            key={index}
            className={`${
              isLocked
                ? 'border-dashed opacity-70'
                : 'border-yellow-500/30 bg-yellow-500/5'
            }`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {isLocked ? (
                    <Lock className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Unlock className="h-4 w-4 text-yellow-500" />
                  )}
                  <CardTitle className="text-sm">Hint {index + 1}</CardTitle>
                </div>
                <Badge variant={isLocked ? 'secondary' : 'default'}>
                  {isLocked ? 'Locked' : 'Unlocked'}
                </Badge>
              </div>
            </CardHeader>

            <CardContent>
              {isLocked ? (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground italic">
                    Unlock this hint to see the clue...
                  </p>
                  <Button
                    onClick={() => handleUnlockHint(index)}
                    disabled={!canUnlock || isUnlocking}
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    <Lightbulb className="mr-2 h-4 w-4" />
                    {isPreviousLocked
                      ? 'Unlock previous hints first'
                      : 'Unlock Hint (-10 XP)'}
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm">{hint}</p>
                  <Badge variant="outline" className="text-xs">
                    <Lightbulb className="mr-1 h-3 w-3" />
                    Hint revealed
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}

      {/* Summary */}
      <Card className="border-blue-500/20 bg-blue-500/5">
        <CardContent className="py-3 text-xs text-center text-muted-foreground">
          {unlockedHints.length === 0 ? (
            <p>💪 No hints used yet. You got this!</p>
          ) : unlockedHints.length === hints.length ? (
            <p>🎯 All hints unlocked. Time to solve!</p>
          ) : (
            <p>
              💡 {unlockedHints.length}/{hints.length} hints unlocked (-{unlockedHints.length * 10} XP)
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}