import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '@/services/analyticsService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface HeatmapCalendarProps {
  userId: string;
}

export function HeatmapCalendar({ userId }: HeatmapCalendarProps) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['heatmap', userId],
    queryFn: () => analyticsService.getHeatmapData(userId, 90), // Last 90 days
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (isError || !data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Activity Calendar</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Failed to load activity data</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  // Get max value for color scaling
  const maxValue = Math.max(...data.map(d => d.value), 1);

  // Calculate color intensity based on XP
  const getColor = (value: number) => {
    if (value === 0) return 'bg-gray-100 dark:bg-gray-800';
    const intensity = Math.min(Math.floor((value / maxValue) * 4) + 1, 4);
    const colors = [
      'bg-green-200 dark:bg-green-900',
      'bg-green-300 dark:bg-green-700',
      'bg-green-400 dark:bg-green-600',
      'bg-green-500 dark:bg-green-500',
    ];
    return colors[intensity - 1];
  };

  // Fill missing dates with 0 values
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 90);

  const dateMap = new Map(data.map(d => [d.date, d]));
  const filledData = [];

  for (let i = 0; i < 90; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];
    filledData.push(dateMap.get(dateStr) || { date: dateStr, value: 0, count: 0 });
  }

  // Calculate total activity
  const totalXP = data.reduce((sum, d) => sum + d.value, 0);
  const totalExercises = data.reduce((sum, d) => sum + d.count, 0);
  const activeDays = data.filter(d => d.value > 0).length;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Calendar</CardTitle>
        <CardDescription>
          Last 90 days • {totalXP} XP earned • {totalExercises} exercises completed • {activeDays} active days
        </CardDescription>
      </CardHeader>
      <CardContent>

        <div className="grid gap-1" style={{
          gridTemplateColumns: 'repeat(auto-fill, minmax(12px, 1fr))',
          maxHeight: '200px'
        }}>
          {filledData.map((day) => (
            <div
              key={day.date}
              className={`w-3 h-3 rounded-sm ${getColor(day.value)} transition-colors cursor-pointer hover:ring-2 hover:ring-primary`}
              title={`${day.date}: ${day.value} XP, ${day.count} exercises`}
            />
          ))}
        </div>
        <div className="flex items-center justify-between mt-4 text-xs text-muted-foreground">
          <span>Less</span>
          <div className="flex gap-1">
            <div className="w-3 h-3 rounded-sm bg-gray-100 dark:bg-gray-800" />
            <div className="w-3 h-3 rounded-sm bg-green-200 dark:bg-green-900" />
            <div className="w-3 h-3 rounded-sm bg-green-300 dark:bg-green-700" />
            <div className="w-3 h-3 rounded-sm bg-green-400 dark:bg-green-600" />
            <div className="w-3 h-3 rounded-sm bg-green-500 dark:bg-green-500" />
          </div>
          <span>More</span>
        </div>
      </CardContent>
    </Card>
  );
}