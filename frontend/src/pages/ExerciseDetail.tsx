// ============================================
// src/pages/ExerciseDetail.tsx
// ============================================
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ExerciseDetail() {
  const { id } = useParams();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Detalle del Ejercicio</h1>
        <p className="text-gray-600 mt-2">ID: {id}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información del Ejercicio</CardTitle>
          <CardDescription>Descripción, código y soluciones</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-600 py-8">
            Detalle del ejercicio en construcción...
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
