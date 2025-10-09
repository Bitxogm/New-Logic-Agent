// src/pages/ExerciseWorkspace/components/OutputConsole.tsx

import { Terminal, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ConsoleOutput {
  type: 'log' | 'error' | 'success' | 'info';
  message: string;
  timestamp: Date;
}

interface OutputConsoleProps {
  outputs: ConsoleOutput[];
  onClear: () => void;
  isVisible: boolean;
}

export default function OutputConsole({
  outputs,
  onClear,
  isVisible,
}: OutputConsoleProps) {
  if (!isVisible) return null;

  const getOutputColor = (type: ConsoleOutput['type']) => {
    switch (type) {
      case 'error':
        return 'text-red-500';
      case 'success':
        return 'text-green-500';
      case 'info':
        return 'text-blue-500';
      default:
        return 'text-foreground';
    }
  };

  const getOutputPrefix = (type: ConsoleOutput['type']) => {
    switch (type) {
      case 'error':
        return '❌';
      case 'success':
        return '✅';
      case 'info':
        return 'ℹ️';
      default:
        return '›';
    }
  };

  return (
    <div className="border-t bg-black/95 text-white">
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4 text-green-400" />
          <span className="text-sm font-medium">Output Console</span>
          {outputs.length > 0 && (
            <span className="text-xs text-gray-400">({outputs.length})</span>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          className="h-7 text-gray-400 hover:text-white"
        >
          <X className="h-3 w-3" />
        </Button>
      </div>

      <ScrollArea className="h-32">
        <div className="p-3 space-y-1 font-mono text-sm">
          {outputs.length === 0 ? (
            <p className="text-gray-500 text-xs">
              No output yet. Run your code to see results here.
            </p>
          ) : (
            outputs.map((output, index) => (
              <div key={index} className="flex items-start gap-2">
                <span className="text-xs text-gray-500 min-w-[60px]">
                  {output.timestamp.toLocaleTimeString()}
                </span>
                <span>{getOutputPrefix(output.type)}</span>
                <span className={getOutputColor(output.type)}>
                  {output.message}
                </span>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}