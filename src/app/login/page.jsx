import { Suspense } from "react";
import AuthLayout from "@/components/auth/AuthLayout";
import LoginForm from "@/components/auth/LoginForm";
import { FormSkeleton } from "@/components/auth/AuthParts";

export const metadata = {
  title: "Log in",
  description: "Log in to your Ecommerce Market account to access your digital downloads.",
};

export default function LoginPage() {
  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Log in to access your library and check out faster."
      quote={{
        text: "Every file I've bought here was ready before my coffee finished brewing.",
        author: "Priya N.",
        role: "Product designer",
      }}
    >
      <Suspense fallback={<FormSkeleton fields={2} />}>
        <LoginForm />
      </Suspense>
    </AuthLayout>
  );
}
