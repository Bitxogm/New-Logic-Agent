// ============================================
// src/pages/Dashboard.tsx
// ============================================
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser } from '@/store/authStore';

export default function Dashboard() {
  const user = useUser();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-600 mt-2">Bienvenido de nuevo, {user?.name}!</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Ejercicios Completados</CardTitle>
            <CardDescription>Total de ejercicios resueltos</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">0</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Soluciones Generadas</CardTitle>
            <CardDescription>Con ayuda de IA</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">0</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Análisis de Código</CardTitle>
            <CardDescription>Revisiones con IA</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">0</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Actividad Reciente</CardTitle>
          <CardDescription>Tus últimas acciones</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">No hay actividad reciente</p>
        </CardContent>
      </Card>
    </div>
  );
}
