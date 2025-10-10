// frontend/src/pages/ExerciseWorkspace/components/ProgressIndicator.tsx

import { CheckCircle2, XCircle, Lightbulb, AlertTriangle, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProgressAnalysis } from '@/services/codeAnalysisService';

interface ProgressIndicatorProps {
  analysis: ProgressAnalysis | null;
  isAnalyzing: boolean;
}

export default function ProgressIndicator({ analysis, isAnalyzing }: ProgressIndicatorProps) {
  // Don't show anything if no analysis yet
  if (!analysis && !isAnalyzing) {
    return null;
  }

  // Loading state
  if (isAnalyzing && !analysis) {
    return (
      <Card className="border-primary/20">
        <CardContent className="py-6">
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">Analyzing your code...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!analysis) return null;

  // Determine color based on progress
  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600 dark:text-green-400';
    if (percentage >= 50) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-blue-600 dark:text-blue-400';
  };

  const getProgressBg = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  return (
    <div className="space-y-3">
      {/* Main Progress Card */}
      <Card className={`${analysis.isComplete
          ? 'border-green-500/50 bg-green-500/5'
          : 'border-primary/20'
        }`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Code Progress</CardTitle>
            {isAnalyzing && (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Completion</span>
              <span className={`text-2xl font-bold ${getProgressColor(analysis.progressPercentage)}`}>
                {analysis.progressPercentage}%
              </span>
            </div>
            <div className="relative h-3 w-full overflow-hidden rounded-full bg-secondary">
              <div
                className={`h-full transition-all duration-500 ${getProgressBg(analysis.progressPercentage)}`}
                style={{ width: `${analysis.progressPercentage}%` }}
              />
            </div>


          </div>

          {/* Complete Badge */}
          {analysis.isComplete && (
            <Badge className="w-full justify-center bg-green-500 hover:bg-green-600">
              <CheckCircle2 className="mr-1 h-3 w-3" />
              Solution Complete! 🎉
            </Badge>
          )}

          {/* Completed Requirements */}
          {analysis.completedRequirements.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                What's Working ({analysis.completedRequirements.length})
              </p>
              <ul className="space-y-1">
                {analysis.completedRequirements.map((req, index) => (
                  <li key={index} className="text-xs text-muted-foreground flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Missing Requirements */}
          {analysis.missingRequirements.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium flex items-center gap-1">
                <XCircle className="h-4 w-4 text-orange-500" />
                Still Needed ({analysis.missingRequirements.length})
              </p>
              <ul className="space-y-1">
                {analysis.missingRequirements.map((req, index) => (
                  <li key={index} className="text-xs text-muted-foreground flex items-start gap-2">
                    <span className="text-orange-500 mt-0.5">○</span>
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Suggestions Card */}
      {analysis.suggestions.length > 0 && (
        <Card className="border-blue-500/20 bg-blue-500/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-blue-500" />
              Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {analysis.suggestions.map((suggestion, index) => (
                <li key={index} className="text-xs text-muted-foreground flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">💡</span>
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Errors Card */}
      {analysis.errors.length > 0 && (
        <Card className="border-red-500/20 bg-red-500/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              Issues Found
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {analysis.errors.map((error, index) => (
                <li key={index} className="text-xs text-red-700 dark:text-red-400 flex items-start gap-2">
                  <span className="mt-0.5">⚠️</span>
                  <span>{error}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}