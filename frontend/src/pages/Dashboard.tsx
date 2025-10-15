// frontend/src/pages/Dashboard.tsx

import { useAuthStore } from '@/store/authStore';
import { useGamification } from '@/hooks/useGamification';
import { useProgressStats } from '@/hooks/useProgressStats';
import StatsWidget from '@/components/gamification/StatsWidget';
import ProgressChart from '@/components/gamification/ProgressChart';
import GoalsWidget from '@/components/gamification/GoalsWidget';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Code, Trophy, TrendingUp, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useAuthStore();
  const { stats, isLoading } = useGamification(user?._id || null);
  const { data: progressStats } = useProgressStats(user?._id || null);

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Welcome back, {user?.username}! 👋</h1>
        <p className="text-muted-foreground mt-1">
          Continue your learning journey
        </p>
      </div>

      {/* Stats Widget */}
      <div className="grid gap-6 md:grid-cols-3">
        <StatsWidget stats={stats} />

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button asChild className="w-full justify-start">
              <Link to="/exercises">
                <BookOpen className="mr-2 h-4 w-4" />
                Browse Exercises
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link to="/exercises?difficulty=easy">
                <Code className="mr-2 h-4 w-4" />
                Start Easy
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link to="/analytics">
                <BarChart3 className="mr-2 h-4 w-4" />
                View Analytics
              </Link>
            </Button>


          </CardContent>
        </Card>
      </div>

      {/* Progress Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total XP</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '...' : stats?.totalXP.toLocaleString() || '0'}
            </div>
            <p className="text-xs text-muted-foreground">
              Level {stats?.level || 1}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Exercises Solved</CardTitle>
            <Code className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '...' : stats?.completedExercises || '0'}
            </div>
            <p className="text-xs text-muted-foreground">
              Keep going!
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Achievements</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '...' : stats?.achievements.length || '0'}
            </div>
            <p className="text-xs text-muted-foreground">
              Badges unlocked
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <ProgressChart stats={progressStats} />
        </div>
        <GoalsWidget stats={progressStats} />
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Your Learning Path</CardTitle>
          <CardDescription>
            Start solving exercises to track your progress here
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No recent activity yet</p>
            <Button asChild className="mt-4">
              <Link to="/exercises">Start Your First Exercise</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}