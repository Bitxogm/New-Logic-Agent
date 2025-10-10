// src/pages/ExerciseWorkspace/ExerciseWorkspace.tsx

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { exerciseService } from '@/services/exerciseService';
import EditorPanel from './components/EditorPanel';
import ExplanationTab from './components/AIAssistantPanel/ExplanationTab';
import FlowchartTab from './components/AIAssistantPanel/FlowchartTab';
import TestsTab from './components/AIAssistantPanel/TestsTab';
import ChatTab from './components/AIAssistantPanel/ChatTab';

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
  const [activeTab, setActiveTab] = useState<'explanation' | 'flowchart' | 'chat' | 'tests'>('explanation');

  // Initialize code when exercise loads
  useEffect(() => {
    if (exercise) {
      // Priority: starterCode > solution > default template
      const initialCode =
        exercise.starterCode ||
        exercise.solution ||
        `// Write your ${exercise.language} solution here\n`;

      setCode(initialCode);
      setHasUnsavedChanges(false);
    }
  }, [exercise]);

  // Handle code changes
  const handleCodeChange = (newCode: string) => {
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
    // TestsTab maneja internamente los resultados
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

        <div className="flex items-center gap-2">
          <Badge className={getDifficultyColor(exercise.difficulty)}>
            {exercise.difficulty}
          </Badge>
          <Badge variant="outline">{exercise.language}</Badge>
        </div>
      </header>

      {/* Main Content - Split Panels */}
      <div className="flex-1 overflow-hidden">
        <PanelGroup direction="horizontal">
          {/* Left Panel: Editor */}
          <Panel defaultSize={60} minSize={30}>
            <EditorPanel
              code={code}
              language={exercise.language}
              starterCode={exercise.starterCode || exercise.solution || ''}
              onChange={handleCodeChange}
              hasUnsavedChanges={hasUnsavedChanges}
            />
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
                  {['explanation', 'flowchart', 'chat', 'tests'].map((tab) => (
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
            <Button variant="default" size="sm">
              Check Progress
            </Button>
            <Button variant="outline" size="sm">
              Run Tests
            </Button>
            <Button variant="outline" size="sm">
              Reset Code
            </Button>
          </div>

          <div className="flex gap-2">
            <Button variant="ghost" size="sm">
              Save Snapshot
            </Button>
            <Button variant="secondary" size="sm">
              View Solution
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
}

