import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '@/services/analyticsService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface LanguageStatsProps {
  userId: string;
}

const LANGUAGE_COLORS: Record<string, string> = {
  javascript: '#f7df1e',
  typescript: '#3178c6',
  python: '#3776ab',
  java: '#007396',
  cpp: '#00599c',
  c: '#a8b9cc',
  csharp: '#239120',
  go: '#00add8',
  rust: '#ce422b',
  php: '#777bb4',
  ruby: '#cc342d',
};

export function LanguageStats({ userId }: LanguageStatsProps) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['language-stats', userId],
    queryFn: () => analyticsService.getLanguageStats(userId),
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
          <CardTitle>Language Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Failed to load language stats</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Language Statistics</CardTitle>
          <CardDescription>No data yet</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            Complete exercises to see your language statistics
          </p>
        </CardContent>
      </Card>
    );
  }

  const totalExercises = data.reduce((sum, lang) => sum + lang.count, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Language Statistics</CardTitle>
        <CardDescription>
          {totalExercises} exercises completed across {data.length} languages
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="language" 
              className="text-xs"
              tick={{ fill: 'currentColor' }}
            />
            <YAxis 
              className="text-xs"
              tick={{ fill: 'currentColor' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
              labelStyle={{ color: 'hsl(var(--foreground))' }}
              formatter={(value: number, name: string) => {
                if (name === 'count') return [value, 'Exercises'];
                if (name === 'totalXP') return [value, 'Total XP'];
                if (name === 'avgTime') return [`${value}s`, 'Avg Time'];
                return [value, name];
              }}
            />
            <Bar dataKey="count" radius={[8, 8, 0, 0]}>
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={LANGUAGE_COLORS[entry.language] || '#8884d8'} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        {/* Legend with detailed stats */}
        <div className="mt-6 space-y-2">
          {data.map((lang) => (
            <div 
              key={lang.language} 
              className="flex items-center justify-between text-sm p-2 rounded hover:bg-muted/50"
            >
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-sm" 
                  style={{ backgroundColor: LANGUAGE_COLORS[lang.language] || '#8884d8' }}
                />
                <span className="font-medium capitalize">{lang.language}</span>
              </div>
              <div className="flex gap-4 text-muted-foreground">
                <span>{lang.count} exercises</span>
                <span>{lang.totalXP} XP</span>
                <span>{lang.avgTime}s avg</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}