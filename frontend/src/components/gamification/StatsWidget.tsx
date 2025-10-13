// frontend/src/components/gamification/StatsWidget.tsx

import { Trophy, Zap, Flame, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UserStats, Achievement } from '@/services/gamificationService';

interface StatsWidgetProps {
  stats: UserStats | undefined;
  compact?: boolean;
}

export default function StatsWidget({ stats, compact = false }: StatsWidgetProps) {
  if (!stats) return null;

  // Calculate XP for next level
  const xpForNextLevel = Math.pow(stats.level, 2) * 100;
  const xpProgress = (stats.totalXP % xpForNextLevel) / xpForNextLevel * 100;

  if (compact) {
    return (
      <div className="flex items-center gap-3 p-2 bg-card/50 rounded-lg border">
        {/* Level */}
        <div className="flex items-center gap-1.5">
          <Star className="h-4 w-4 text-yellow-500" />
          <span className="text-sm font-medium">Lv {stats.level}</span>
        </div>

        {/* XP Progress */}
        <div className="flex-1 min-w-[60px]">
          <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
              style={{ width: `${xpProgress}%` }}
            />
          </div>
        </div>

        {/* Streak */}
        {stats.currentStreak > 0 && (
          <div className="flex items-center gap-1">
            <Flame className="h-4 w-4 text-orange-500" />
            <span className="text-xs font-medium">{stats.currentStreak}</span>
          </div>
        )}

        {/* Achievements */}
        {stats.achievements.length > 0 && (
          <Badge variant="secondary" className="text-xs px-2">
            <Trophy className="h-3 w-3 mr-1" />
            {stats.achievements.length}
          </Badge>
        )}
      </div>
    );
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Level and XP */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                <span className="font-semibold text-lg">Level {stats.level}</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {stats.totalXP.toLocaleString()} XP
              </span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                style={{ width: `${xpProgress}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {Math.floor(xpProgress)}% to next level
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-3">
            {/* Exercises */}
            <div className="text-center p-2 bg-secondary/50 rounded">
              <Zap className="h-4 w-4 mx-auto mb-1 text-blue-500" />
              <p className="text-lg font-bold">{stats.completedExercises}</p>
              <p className="text-xs text-muted-foreground">Solved</p>
            </div>

            {/* Streak */}
            <div className="text-center p-2 bg-secondary/50 rounded">
              <Flame className="h-4 w-4 mx-auto mb-1 text-orange-500" />
              <p className="text-lg font-bold">{stats.currentStreak}</p>
              <p className="text-xs text-muted-foreground">Day Streak</p>
            </div>

            {/* Achievements */}
            <div className="text-center p-2 bg-secondary/50 rounded">
              <Trophy className="h-4 w-4 mx-auto mb-1 text-yellow-500" />
              <p className="text-lg font-bold">{stats.achievements.length}</p>
              <p className="text-xs text-muted-foreground">Badges</p>
            </div>
          </div>

          {/* Recent Achievements */}
          {stats.achievements.length > 0 && (
            <div>
              <p className="text-xs font-medium mb-2">Recent Achievements</p>
              <div className="flex flex-wrap gap-1">
                {stats.achievements.slice(0, 5).map((achievement: Achievement) => (
                  <Badge
                    key={achievement.id}
                    variant="secondary"
                    className="text-xs"
                    title={achievement.description}
                  >
                    {achievement.icon} {achievement.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}