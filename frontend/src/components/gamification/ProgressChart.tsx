// frontend/src/components/gamification/ProgressChart.tsx

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';
import type { ProgressStats } from '@/services/gamificationService';

interface ProgressChartProps {
  stats: ProgressStats | undefined;
}

export default function ProgressChart({ stats }: ProgressChartProps) {
  if (!stats || !stats.recentActivity || stats.recentActivity.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Weekly Activity
          </CardTitle>
          <CardDescription>Your XP earned over the last 7 days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-48 flex items-center justify-center text-muted-foreground">
            <p className="text-sm">No activity data yet. Start solving exercises!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Find max XP for scaling
  const maxXP = Math.max(...stats.recentActivity.map(d => d.xpEarned), 1);
  const totalXP = stats.recentActivity.reduce((sum, d) => sum + d.xpEarned, 0);

  // Get day labels
  const getDayLabel = (date: Date) => {
    const d = new Date(date);
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[d.getDay()];
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Weekly Activity
        </CardTitle>
        <CardDescription>
          {totalXP} XP earned in the last 7 days
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Bar Chart */}
          <div className="flex items-end justify-between gap-2 h-40">
            {stats.recentActivity.map((activity, index) => {
              const heightPercent = (activity.xpEarned / maxXP) * 100;
              const hasActivity = activity.xpEarned > 0;

              return (
                <div
                  key={index}
                  className="flex-1 flex flex-col items-center gap-2"
                >
                  {/* Bar */}
                  <div className="w-full flex flex-col items-center justify-end h-32">
                    <div
                      className={`w-full rounded-t transition-all ${
                        hasActivity
                          ? 'bg-gradient-to-t from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600'
                          : 'bg-muted'
                      }`}
                      style={{ height: `${Math.max(heightPercent, 5)}%` }}
                      title={`${activity.xpEarned} XP`}
                    />
                  </div>
                  
                  {/* XP Label */}
                  {hasActivity && (
                    <span className="text-xs font-medium text-foreground">
                      {activity.xpEarned}
                    </span>
                  )}
                  
                  {/* Day Label */}
                  <span className="text-xs text-muted-foreground">
                    {getDayLabel(activity.date)}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-3 gap-3 pt-3 border-t">
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">{totalXP}</p>
              <p className="text-xs text-muted-foreground">Total XP</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">
                {stats.recentActivity.reduce((sum, d) => sum + d.exercisesCompleted, 0)}
              </p>
              <p className="text-xs text-muted-foreground">Exercises</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">
                {Math.round(totalXP / 7)}
              </p>
              <p className="text-xs text-muted-foreground">Avg/Day</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}