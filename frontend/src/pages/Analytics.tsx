import { HeatmapCalendar } from '@/components/analytics/HeatmapCalendar';
import { LanguageStats } from '@/components/analytics/LanguageStats';
import { DifficultyDistribution } from '@/components/analytics/DifficultyDistribution';
import { useAuthStore } from '@/store/authStore';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function Analytics() {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated || !user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Authentication Required</AlertTitle>
          <AlertDescription>
            You need to be logged in to view analytics.
            <Link to="/login">
              <Button variant="link" className="px-2">
                Log in here
              </Button>
            </Link>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground mt-2">
          Deep dive into your learning progress and performance
        </p>
      </div>

      {/* Activity Heatmap */}
      <HeatmapCalendar userId={user._id} />

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        <LanguageStats userId={user._id} />
        <DifficultyDistribution userId={user._id} />
      </div>
    </div>
  );
}