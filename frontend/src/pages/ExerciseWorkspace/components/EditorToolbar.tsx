// src/pages/ExerciseWorkspace/components/EditorToolbar.tsx

import { Copy, RotateCcw, Trash2,  } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface EditorToolbarProps {
  language: string;
  onCopy: () => void;
  onClear: () => void;
  onReset: () => void;
  hasUnsavedChanges?: boolean;
}

export default function EditorToolbar({
  language,
  onCopy,
  onClear,
  onReset,
  hasUnsavedChanges = false,
}: EditorToolbarProps) {
  
  const handleCopy = () => {
    onCopy();
    toast.success('Código copiado al portapapeles');
  };

  const handleClear = () => {
    if (window.confirm('¿Estás seguro de borrar todo el código?')) {
      onClear();
      toast.info('Código borrado');
    }
  };

  const handleReset = () => {
    if (window.confirm('¿Estás seguro de resetear al código inicial?')) {
      onReset();
      toast.info('Código reseteado');
    }
  };

  return (
    <div className="flex items-center justify-between p-3 border-b bg-muted/30">
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="font-mono">
          {language}
        </Badge>
        {hasUnsavedChanges && (
          <Badge variant="secondary" className="text-xs">
            <span className="mr-1">●</span> Sin guardar
          </Badge>
        )}
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          title="Copiar código"
        >
          <Copy className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleReset}
          title="Resetear al código inicial"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleClear}
          title="Borrar todo"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}