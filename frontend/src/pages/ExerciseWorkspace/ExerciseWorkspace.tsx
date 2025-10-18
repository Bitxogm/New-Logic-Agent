// src/pages/ExerciseWorkspace/ExerciseWorkspace.tsx

import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { exerciseService } from '@/services/exerciseService';
import { useCodeAnalysis } from './hooks/useCodeAnalysis';
import { useAuthStore } from '@/store/authStore';
import { useGamification } from '@/hooks/useGamification';
import StatsWidget from '@/components/gamification/StatsWidget';
import ProgressIndicator from './components/ProgressIndicator';
import EditorPanel from './components/EditorPanel';
import ExplanationTab from './components/AIAssistantPanel/ExplanationTab';
import FlowchartTab from './components/AIAssistantPanel/FlowchartTab';
import TestsTab from './components/AIAssistantPanel/TestsTab';
import HintsPanel from './components/AIAssistantPanel/HintsPanel';
import ChatTab from './components/AIAssistantPanel/ChatTab';
import { TemplateSelector } from '@/components/workspace/TemplateSelector';
import { toast } from 'sonner';

export default function ExerciseWorkspace() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Fetch exercise data
  const { data: exercise, isLoading, error } = useQuery({
    queryKey: ['exercise', id],
    queryFn: () => exerciseService.getById(id!),
    enabled: !!id,
  });

  // State
  const [code, setCode] = useState('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [activeTab, setActiveTab] = useState<'explanation' | 'flowchart' | 'chat' | 'tests' | 'hints'>('explanation');
  const [triggerTests, setTriggerTests] = useState(false);
  const [startTime, setStartTime] = useState<number>(Date.now());

  // Real-time code analysis
  const { analysis, isAnalyzing } = useCodeAnalysis({
    exerciseId: id!,
    code,
    language: exercise?.language || 'javascript',
    enabled: !!exercise && code.trim().length > 0,
    debounceMs: 5000,
  });

  // Gamification
  const { user } = useAuthStore();
  const { completeExercise, stats } = useGamification(user?._id || null);

  // Initialize code when exercise loads
  useEffect(() => {
    if (exercise) {
      const initialCode =
        exercise.starterCode ||
        exercise.solution ||
        `// Write your ${exercise.language} solution here\n`;

      setCode(initialCode);
      setHasUnsavedChanges(false);
      setStartTime(Date.now());
    }
  }, [exercise]);

  // Load saved snapshot on mount
  useEffect(() => {
    if (exercise?._id) {
      try {
        const saved = localStorage.getItem(`exercise_${exercise._id}`);
        if (saved) {
          const snapshot = JSON.parse(saved);
          if (window.confirm('Found saved progress. Load it?')) {
            setCode(snapshot.code);
            toast.success('Progress restored! 📂');
          }
        }
      } catch (error) {
        console.error('Error loading snapshot:', error);
      }
    }
  }, [exercise?._id]);

  // Handle code changes
  const handleCodeChange = useCallback((newCode: string) => {
    setCode(newCode);
    setHasUnsavedChanges(true);
  }, []);

  // Handle template insertion
  const handleInsertTemplate = (templateCode: string) => {
    // Insert template at the end of current code
    const newCode = code.trim() ? `${code}\n\n${templateCode}` : templateCode;
    setCode(newCode);
    setHasUnsavedChanges(true);
  };

  // Handle running tests
  const handleRunTests = async () => {
    if (!exercise?.testCases || exercise.testCases.length === 0) {
      console.warn('No test cases available');
      return;
    }
    console.log('Running tests with code:', code);
  };

  // Handle all tests passed - Gamification trigger
  const handleAllTestsPassed = useCallback(() => {
    if (!exercise || !user) return;

    const timeSpent = Math.floor((Date.now() - startTime) / 1000 / 60); // minutes

    completeExercise({
      exerciseId: exercise._id,
      difficulty: exercise.difficulty,
      timeSpent,
      perfectScore: true,
    });
  }, [exercise, user, startTime, completeExercise]);

  // Handle reset code
  const handleResetCode = () => {
    if (!exercise) return;

    if (!hasUnsavedChanges || window.confirm('Reset code to initial state? All changes will be lost.')) {
      const initialCode =
        exercise.starterCode ||
        exercise.solution ||
        `// Write your ${exercise.language} solution here\n`;

      setCode(initialCode);
      setHasUnsavedChanges(false);
      toast.success('Code reset to initial state');
    }
  };

  // Handle save snapshot
  const handleSaveSnapshot = () => {
    if (!exercise?._id) return;

    try {
      const snapshot = {
        exerciseId: exercise._id,
        code,
        timestamp: new Date().toISOString(),
        language: exercise.language,
      };

      localStorage.setItem(`exercise_${exercise._id}`, JSON.stringify(snapshot));
      setHasUnsavedChanges(false);
      toast.success('Snapshot saved successfully! 💾');
    } catch (error) {
      console.error('Error saving snapshot:', error);
      toast.error('Failed to save snapshot');
    }
  };

  // Handle view solution
  const handleViewSolution = () => {
    if (!exercise?.solution) {
      toast.error('No solution available for this exercise');
      return;
    }

    if (window.confirm('View the solution? This will replace your current code.')) {
      setCode(exercise.solution);
      setHasUnsavedChanges(false);
      toast.info('Solution loaded. Study it carefully! 📚');
    }
  };

  // Handle run tests from footer
  const handleRunTestsFromFooter = () => {
    setActiveTab('tests');
    setTriggerTests(true);
    setTimeout(() => setTriggerTests(false), 100);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <Sparkles className="h-12 w-12 animate-pulse mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading workspace...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !exercise) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <p className="text-destructive mb-4">Failed to load exercise</p>
          <Button onClick={() => navigate('/exercises')}>
            Back to Exercises
          </Button>
        </div>
      </div>
    );
  }

  // Helper function for difficulty color
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'bg-green-500/10 text-green-700 dark:text-green-400';
      case 'medium': return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400';
      case 'hard': return 'bg-red-500/10 text-red-700 dark:text-red-400';
      default: return 'bg-gray-500/10 text-gray-700 dark:text-gray-400';
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b bg-card px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(`/exercises/${id}`)}
            title="Exit Academy Mode"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>

          <div className="flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-primary" />
            <div>
              <h1 className="font-semibold text-lg leading-none">{exercise.title}</h1>
              <p className="text-sm text-muted-foreground mt-1">Academy Workspace</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Stats Widget Compact */}
          {user && stats && <StatsWidget stats={stats} compact />}

          {/* Exercise Info */}
          <div className="flex items-center gap-2">
            <Badge className={getDifficultyColor(exercise.difficulty)}>
              {exercise.difficulty}
            </Badge>
            <Badge variant="outline">{exercise.language}</Badge>
          </div>
        </div>
      </header>
      {/* Main Content - Split Panels */}
      <div className="flex-1 overflow-hidden">
        <PanelGroup direction="horizontal">
          {/* Left Panel: Editor */}
          <Panel defaultSize={60} minSize={30}>
            <div className="h-full flex flex-col">
              {/* Editor */}
              <div className="flex-1 overflow-hidden">
                <EditorPanel
                  code={code}
                  language={exercise.language}
                  starterCode={exercise.starterCode || exercise.solution || ''}
                  onChange={handleCodeChange}
                />
              </div>

              {/* Progress Indicator - Fixed at bottom */}
              <div className="border-t bg-card p-3 max-h-[40%] overflow-y-auto">
                <ProgressIndicator analysis={analysis} isAnalyzing={isAnalyzing} />
              </div>
            </div>
          </Panel>

          {/* Resize Handle */}
          <PanelResizeHandle className="w-1 bg-border hover:bg-primary transition-colors" />

          {/* Right Panel: AI Assistant */}
          <Panel defaultSize={40} minSize={30}>
            <div className="h-full flex flex-col bg-background">
              <div className="p-4 border-b">
                <h2 className="font-semibold flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  AI Assistant
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Your personal coding tutor
                </p>
              </div>

              {/* Tabs */}
              <div className="border-b">
                <div className="flex gap-1 px-2">
                  {['explanation', 'flowchart', 'chat', 'tests', 'hints'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab as any)}
                      className={`px-4 py-2 text-sm font-medium capitalize transition-colors ${activeTab === tab
                        ? 'text-primary border-b-2 border-primary'
                        : 'text-muted-foreground hover:text-foreground'
                        }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              <div className="flex-1 p-4 overflow-auto">
                {activeTab === 'explanation' && <ExplanationTab exerciseId={id!} />}
                {activeTab === 'flowchart' && <FlowchartTab exerciseId={id!} />}
                {activeTab === 'chat' && <ChatTab exerciseId={id!} currentCode={code} />}
                {activeTab === 'tests' && (
                  <TestsTab
                    testCases={exercise.testCases || []}
                    currentCode={code}
                    language={exercise.language}
                    onRunTests={handleRunTests}
                    triggerRun={triggerTests}
                    onAllTestsPassed={handleAllTestsPassed}

                  />
                )}
                {activeTab === 'hints' && (
                  <HintsPanel
                    exerciseId={id!}
                    hints={exercise.hints || []}
                  />
                )}
              </div>
            </div>
          </Panel>
        </PanelGroup>
      </div>

      {/* Action Bar (Bottom) */}
      <footer className="border-t bg-card px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Button variant="default" size="sm" onClick={handleRunTestsFromFooter}>
              Run Tests
            </Button>
            <Button variant="outline" size="sm" onClick={handleResetCode}>
              Reset Code
            </Button>
            <TemplateSelector
              language={exercise.language}
              onSelectTemplate={handleInsertTemplate}
            />
          </div>

          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={handleSaveSnapshot}>
              Save Snapshot
            </Button>
            <Button variant="secondary" size="sm" onClick={handleViewSolution}>
              View Solution
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
}