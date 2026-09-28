import { Suspense } from "react";
import AuthLayout from "@/components/auth/AuthLayout";
import SignupForm from "@/components/auth/SignupForm";
import { FormSkeleton } from "@/components/auth/AuthParts";

export const metadata = {
  title: "Create your account",
  description: "Join Ecommerce Market to buy and sell templates, software, e-books and graphics.",
};

export default function SignupPage() {
  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join thousands of creators buying and selling digital goods."
      quote={{
        text: "Beautifully curated. It feels like browsing a design shop, not a download site.",
        author: "Marcus T.",
        role: "Indie founder",
      }}
    >
      <Suspense fallback={<FormSkeleton fields={3} />}>
        <SignupForm />
      </Suspense>
    </AuthLayout>
  );
}
