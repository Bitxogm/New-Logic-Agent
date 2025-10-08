import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Code2, Brain, Lightbulb, Zap, ArrowRight } from 'lucide-react';
import { useIsAuthenticated } from '@/store/authStore';

/**
 * Página de inicio (Home)
 */
export default function Home() {
  const isAuthenticated = useIsAuthenticated();

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-6 py-12">
        <div className="inline-flex items-center justify-center p-2 bg-blue-100 dark:bg-blue-900 rounded-full mb-4">
          <Code2 className="h-8 w-8 text-blue-600 dark:text-blue-400" />
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
          Aprende Programación con{' '}
          <span className="text-blue-600">Inteligencia Artificial</span>
        </h1>
        
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          Plataforma educativa potenciada por Gemini AI para ayudarte a dominar 
          la lógica de programación a través de ejercicios interactivos
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          {isAuthenticated ? (
            <>
              <Button size="lg" asChild>
                <Link to="/exercises">
                  Ver Ejercicios <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/dashboard">Mi Dashboard</Link>
              </Button>
            </>
          ) : (
            <>
              <Button size="lg" asChild>
                <Link to="/register">
                  Comenzar Gratis <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/login">Iniciar Sesión</Link>
              </Button>
            </>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <Brain className="h-8 w-8 text-blue-600 mb-2" />
            <CardTitle>IA Avanzada</CardTitle>
            <CardDescription>
              Gemini 2.0 te ayuda a generar, analizar y mejorar tu código
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <Code2 className="h-8 w-8 text-green-600 mb-2" />
            <CardTitle>Múltiples Lenguajes</CardTitle>
            <CardDescription>
              Python, JavaScript, Java, C++, TypeScript y más
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <Lightbulb className="h-8 w-8 text-yellow-600 mb-2" />
            <CardTitle>Explicaciones Claras</CardTitle>
            <CardDescription>
              Comprende cada concepto con ejemplos y tutoriales personalizados
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <Zap className="h-8 w-8 text-purple-600 mb-2" />
            <CardTitle>Aprende Rápido</CardTitle>
            <CardDescription>
              Ejercicios adaptados a tu nivel con feedback instantáneo
            </CardDescription>
          </CardHeader>
        </Card>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-50 dark:bg-blue-950 rounded-lg p-12 text-center">
        <h2 className="text-3xl font-bold mb-4">
          ¿Listo para mejorar tus habilidades?
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
          Únete a miles de estudiantes que están aprendiendo programación de forma más efectiva
        </p>
        {!isAuthenticated && (
          <Button size="lg" asChild>
            <Link to="/register">
              Crear Cuenta Gratis <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        )}
      </section>
    </div>
  );
}