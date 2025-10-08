// ============================================
// src/pages/Register.tsx
// ============================================
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Register() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Crear Cuenta</CardTitle>
          <CardDescription>Únete a AgentLogic y comienza a aprender</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-600">
            Formulario de registro en construcción...
          </p>
        </CardContent>
      </Card>
    </div>
  );
}