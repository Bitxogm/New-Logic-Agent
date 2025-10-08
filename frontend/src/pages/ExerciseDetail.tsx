import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { exerciseService } from '@/services/exerciseService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  ArrowLeft, 
  Code2, 
  Calendar, 
  Sparkles, 
  Search, 
  Lightbulb,
  CheckCircle2,
  Edit,
  Trash2
} from 'lucide-react';
import { useIsAuthenticated } from '@/store/authStore';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { toast } from 'sonner';

/**
 * Página de detalle del ejercicio
 */
export default function ExerciseDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isAuthenticated = useIsAuthenticated();

  const {
    data: exercise,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['exercise', id],
    queryFn: () => exerciseService.getById(id!),
    enabled: !!id,
  });

  // Handlers de IA (por ahora solo muestran toast)
  const handleGenerateSolution = () => {
    toast.info('Generando solución con IA...', {
      description: 'Esta funcionalidad se implementará pronto'
    });
  };

  const handleAnalyzeCode = () => {
    toast.info('Analizando código...', {
      description: 'Esta funcionalidad se implementará pronto'
    });
  };

  const handleExplainConcept = () => {
    toast.info('Explicando concepto...', {
      description: 'Esta funcionalidad se implementará pronto'
    });
  };

  const handleDelete = async () => {
    if (!window.confirm('¿Estás seguro de eliminar este ejercicio?')) return;
    
    try {
      await exerciseService.delete(id!);
      toast.success('Ejercicio eliminado exitosamente');
      navigate('/exercises');
    } catch (error) {
      toast.error('Error al eliminar el ejercicio');
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  // Error state
  if (isError || !exercise) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          No se pudo cargar el ejercicio.
          <Button variant="outline" size="sm" className="ml-4" onClick={() => navigate('/exercises')}>
            Volver a ejercicios
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  // Helpers
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'hard': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    const labels: Record<string, string> = {
      easy: 'Fácil',
      medium: 'Medio',
      hard: 'Difícil'
    };
    return labels[difficulty] || difficulty;
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Button variant="ghost" size="sm" onClick={() => navigate('/exercises')}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Volver a ejercicios
      </Button>

      {/* Header del ejercicio */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{exercise.title}</h1>
            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <Code2 className="h-4 w-4" />
                <span>{exercise.language}</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>
                  Creado {formatDistanceToNow(new Date(exercise.createdAt), { addSuffix: true, locale: es })}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge className={getDifficultyColor(exercise.difficulty)}>
              {getDifficultyLabel(exercise.difficulty)}
            </Badge>
            {isAuthenticated && (
              <>
                <Button variant="outline" size="sm" asChild>
                  <Link to={`/exercises/${id}/edit`}>
                    <Edit className="mr-2 h-4 w-4" />
                    Editar
                  </Link>
                </Button>
                <Button variant="destructive" size="sm" onClick={handleDelete}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Eliminar
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Tags */}
        {exercise.tags && exercise.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {exercise.tags.map((tag, index) => (
              <Badge key={index} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Descripción */}
      <Card>
        <CardHeader>
          <CardTitle>Descripción</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
            {exercise.description}
          </p>
        </CardContent>
      </Card>

      {/* Test Cases */}
      {exercise.testCases && exercise.testCases.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Casos de Prueba</CardTitle>
            <CardDescription>
              Tu solución debe pasar estos casos de prueba
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {exercise.testCases.map((testCase, index) => (
              <div key={index} className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span>Caso de prueba #{index + 1}</span>
                </div>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Input:</span>
                    <pre className="mt-1 p-2 bg-white dark:bg-gray-950 rounded border overflow-x-auto">
                      {JSON.stringify(testCase.input, null, 2)}
                    </pre>
                  </div>
                  <div>
                    <span className="font-medium">Output esperado:</span>
                    <pre className="mt-1 p-2 bg-white dark:bg-gray-950 rounded border overflow-x-auto">
                      {JSON.stringify(testCase.expectedOutput, null, 2)}
                    </pre>
                  </div>
                </div>
                {testCase.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {testCase.description}
                  </p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Hints */}
      {exercise.hints && exercise.hints.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Pistas</CardTitle>
            <CardDescription>
              Algunas ideas para resolver el ejercicio
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {exercise.hints.map((hint, index) => (
                <li key={index} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                  <Lightbulb className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <span>{hint}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Acciones de IA */}
      {isAuthenticated && (
        <Card>
          <CardHeader>
            <CardTitle>Ayuda con IA</CardTitle>
            <CardDescription>
              Usa Gemini 2.0 para obtener ayuda con este ejercicio
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button onClick={handleGenerateSolution} variant="default">
              <Sparkles className="mr-2 h-4 w-4" />
              Generar Solución
            </Button>
            <Button onClick={handleAnalyzeCode} variant="outline">
              <Search className="mr-2 h-4 w-4" />
              Analizar mi Código
            </Button>
            <Button onClick={handleExplainConcept} variant="outline">
              <Lightbulb className="mr-2 h-4 w-4" />
              Explicar Concepto
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Editor de código (próximamente) */}
      <Card>
        <CardHeader>
          <CardTitle>Editor de Código</CardTitle>
          <CardDescription>
            Escribe tu solución aquí
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gray-100 dark:bg-gray-900 rounded-lg flex items-center justify-center text-gray-500">
            <div className="text-center">
              <Code2 className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Monaco Editor se integrará aquí próximamente</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}