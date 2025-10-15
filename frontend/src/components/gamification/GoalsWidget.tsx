// frontend/src/components/gamification/GoalsWidget.tsx

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, CheckCircle2 } from 'lucide-react';
import type { ProgressStats } from '@/services/gamificationService';

interface GoalsWidgetProps {
  stats: ProgressStats | undefined;
}

export default function GoalsWidget({ stats }: GoalsWidgetProps) {
  if (!stats) {
    return null;
  }

  const { daily, weekly } = stats.goals;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Your Goals
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Daily Goal */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Daily Goal</span>
              {daily.percentage >= 100 && (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              )}
            </div>
            <span className="text-sm text-muted-foreground">
              {daily.current} / {daily.target} XP
            </span>
          </div>
          <div className="relative h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                daily.percentage >= 100
                  ? 'bg-green-500'
                  : daily.percentage >= 75
                  ? 'bg-blue-500'
                  : daily.percentage >= 50
                  ? 'bg-yellow-500'
                  : 'bg-orange-500'
              }`}
              style={{ width: `${Math.min(daily.percentage, 100)}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            {daily.percentage >= 100
              ? '🎉 Goal completed!'
              : `${daily.target - daily.current} XP to go`}
          </p>
        </div>

        {/* Weekly Goal */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Weekly Goal</span>
              {weekly.percentage >= 100 && (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              )}
            </div>
            <span className="text-sm text-muted-foreground">
              {weekly.current} / {weekly.target} XP
            </span>
          </div>
          <div className="relative h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                weekly.percentage >= 100
                  ? 'bg-green-500'
                  : weekly.percentage >= 75
                  ? 'bg-blue-500'
                  : weekly.percentage >= 50
                  ? 'bg-yellow-500'
                  : 'bg-orange-500'
              }`}
              style={{ width: `${Math.min(weekly.percentage, 100)}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            {weekly.percentage >= 100
              ? '🔥 Crushing it this week!'
              : `${weekly.target - weekly.current} XP to reach your goal`}
          </p>
        </div>

        {/* Motivational Message */}
        {daily.percentage === 0 && weekly.percentage === 0 && (
          <div className="mt-4 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
            <p className="text-xs text-blue-700 dark:text-blue-400">
              💪 Start today! Solve exercises to reach your goals.
            </p>
          </div>
        )}

        {daily.percentage >= 100 && weekly.percentage >= 100 && (
          <div className="mt-4 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
            <p className="text-xs text-green-700 dark:text-green-400">
              🏆 Amazing! You've completed all your goals!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}