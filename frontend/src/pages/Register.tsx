// ============================================
// src/pages/Register.tsx
// ============================================
import RegisterForm from '@/components/auth/RegisterForm';

export default function Register() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
      <RegisterForm />
    </div>
  );
}