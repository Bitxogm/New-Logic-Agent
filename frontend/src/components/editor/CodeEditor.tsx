import { useState, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Play, Copy, Trash2, Check } from 'lucide-react';
import { toast } from 'sonner';

interface CodeEditorProps {
  defaultLanguage?: string;
  defaultValue?: string;
  onRun?: (code: string, language: string) => void;
  height?: string;
}

/**
 * Monaco Code Editor Component
 * Editor de código con syntax highlighting y autocompletado
 */
export default function CodeEditor({
  defaultLanguage = 'javascript',
  defaultValue = '// Escribe tu código aquí\n',
  onRun,
  height = '400px',
}: CodeEditorProps) {
  const [language, setLanguage] = useState(defaultLanguage);
  const [code, setCode] = useState(defaultValue);
  const [copied, setCopied] = useState(false);
  const editorRef = useRef<any>(null);

  // Cuando el editor está montado
  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
    editor.focus();
  };

  // Ejecutar código
  const handleRun = () => {
    if (onRun) {
      onRun(code, language);
    } else {
      toast.info('Ejecutar código', {
        description: 'Esta funcionalidad se implementará pronto',
      });
    }
  };

  // Copiar código
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success('Código copiado al portapapeles');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Error al copiar el código');
    }
  };

  // Limpiar editor
  const handleClear = () => {
    if (window.confirm('¿Seguro que quieres limpiar el editor?')) {
      setCode('');
      editorRef.current?.focus();
      toast.success('Editor limpiado');
    }
  };

  // Cambiar lenguaje
  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    toast.info(`Lenguaje cambiado a ${getLanguageLabel(newLanguage)}`);
  };

  // Helper: Obtener label del lenguaje
  const getLanguageLabel = (lang: string) => {
    const labels: Record<string, string> = {
      javascript: 'JavaScript',
      typescript: 'TypeScript',
      python: 'Python',
      java: 'Java',
      cpp: 'C++',
      csharp: 'C#',
      go: 'Go',
      rust: 'Rust',
      php: 'PHP',
      ruby: 'Ruby',
    };
    return labels[lang] || lang;
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-gray-100 dark:bg-gray-900 border-b">
        {/* Selector de lenguaje */}
        <Select value={language} onValueChange={handleLanguageChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Seleccionar lenguaje" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="javascript">JavaScript</SelectItem>
            <SelectItem value="typescript">TypeScript</SelectItem>
            <SelectItem value="python">Python</SelectItem>
            <SelectItem value="java">Java</SelectItem>
            <SelectItem value="cpp">C++</SelectItem>
            <SelectItem value="csharp">C#</SelectItem>
            <SelectItem value="go">Go</SelectItem>
            <SelectItem value="rust">Rust</SelectItem>
            <SelectItem value="php">PHP</SelectItem>
            <SelectItem value="ruby">Ruby</SelectItem>
          </SelectContent>
        </Select>

        {/* Acciones */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
          >
            {copied ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Copiado
              </>
            ) : (
              <>
                <Copy className="mr-2 h-4 w-4" />
                Copiar
              </>
            )}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleClear}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Limpiar
          </Button>

          <Button
            variant="default"
            size="sm"
            onClick={handleRun}
          >
            <Play className="mr-2 h-4 w-4" />
            Ejecutar
          </Button>
        </div>
      </div>

      {/* Editor */}
      <Editor
        height={height}
        language={language}
        value={code}
        onChange={(value) => setCode(value || '')}
        onMount={handleEditorDidMount}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
          roundedSelection: false,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          wordWrap: 'on',
          padding: { top: 16, bottom: 16 },
        }}
      />
    </div>
  );
}