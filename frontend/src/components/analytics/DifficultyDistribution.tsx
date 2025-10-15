import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '@/services/analyticsService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface DifficultyDistributionProps {
  userId: string;
}

const DIFFICULTY_COLORS = {
  easy: '#10b981',    // green-500
  medium: '#f59e0b',  // amber-500
  hard: '#ef4444',    // red-500
};

export function DifficultyDistribution({ userId }: DifficultyDistributionProps) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['difficulty-stats', userId],
    queryFn: () => analyticsService.getDifficultyStats(userId),
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (isError || !data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Difficulty Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Failed to load difficulty stats</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const totalExercises = data.reduce((sum, diff) => sum + diff.count, 0);

  if (totalExercises === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Difficulty Distribution</CardTitle>
          <CardDescription>No data yet</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            Complete exercises to see difficulty distribution
          </p>
        </CardContent>
      </Card>
    );
  }

  // Filter out difficulties with 0 count for cleaner pie chart
  const chartData = data.filter(d => d.count > 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Difficulty Distribution</CardTitle>
        <CardDescription>
          {totalExercises} exercises completed
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="difficulty"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label={({ difficulty, percentage }) => 
                `${difficulty}: ${percentage}%`
              }
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={DIFFICULTY_COLORS[entry.difficulty as keyof typeof DIFFICULTY_COLORS]} 
                />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
              labelStyle={{ color: 'hsl(var(--foreground))' }}
              formatter={(value: number, name: string, props: any) => {
                if (name === 'count') {
                  return [
                    `${value} exercises (${props.payload.percentage}%)`,
                    props.payload.difficulty.toUpperCase()
                  ];
                }
                return [value, name];
              }}
            />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              formatter={(value: string) => value.toUpperCase()}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Detailed stats */}
        <div className="mt-6 space-y-3">
          {data.map((diff) => (
            <div key={diff.difficulty} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-sm" 
                    style={{ backgroundColor: DIFFICULTY_COLORS[diff.difficulty as keyof typeof DIFFICULTY_COLORS] }}
                  />
                  <span className="font-medium capitalize">{diff.difficulty}</span>
                </div>
                <span className="text-muted-foreground">
                  {diff.count} ({diff.percentage}%)
                </span>
              </div>
              <div className="flex gap-4 text-xs text-muted-foreground ml-5">
                <span>{diff.totalXP} XP earned</span>
                <span>{diff.avgTime}s avg time</span>
              </div>
              {/* Progress bar */}
              <div className="h-2 bg-muted rounded-full overflow-hidden ml-5">
                <div 
                  className="h-full transition-all"
                  style={{ 
                    width: `${diff.percentage}%`,
                    backgroundColor: DIFFICULTY_COLORS[diff.difficulty as keyof typeof DIFFICULTY_COLORS]
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}