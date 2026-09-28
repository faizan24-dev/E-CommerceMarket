"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  getPasswordStrength,
  getSafeRedirect,
  validateEmail,
  validateName,
  validateNewPassword,
} from "@/lib/validation";
import FormField from "./FormField";
import {
  FormAlert,
  FormSkeleton,
  PasswordToggle,
  SIGNUP_EMAIL_KEY,
  SignedInNotice,
  SubmitButton,
} from "./AuthParts";

const strengthColors = ["bg-sand", "bg-danger", "bg-amber-500", "bg-lime-600", "bg-success"];

function PasswordStrength({ password }) {
  const { score, label } = getPasswordStrength(password);
  if (!password) return null;
  return (
    <div className="mt-2.5" aria-live="polite">
      <div className="flex gap-1.5">
        {[1, 2, 3, 4].map((step) => (
          <span
            key={step}
            className={`h-1 flex-1 rounded-full transition-colors ${
              score >= step ? strengthColors[score] : "bg-line"
            }`}
          />
        ))}
      </div>
      <p className="mt-1.5 text-xs text-muted">
        Password strength: <span className="font-medium text-ink">{label}</span>
      </p>
    </div>
  );
}

export default function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = getSafeRedirect(searchParams.get("next"));
  const { signup, user, isReady } = useAuth();

  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const [values, setValues] = useState({ name: "", email: "", password: "" });
  const [touched, setTouched] = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | submitting | success
  const [formError, setFormError] = useState("");

  const errors = {
    name: validateName(values.name),
    email: validateEmail(values.email),
    password: validateNewPassword(values.password),
  };
  const visibleError = (field) => (touched[field] || submitAttempted ? errors[field] : "");

  if (!isReady) return <FormSkeleton fields={3} />;
  if (user && status === "idle") return <SignedInNotice redirectTo={redirectTo} />;

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    if (formError) setFormError("");
  }

  function handleBlur(event) {
    const { name } = event.target;
    setTouched((current) => ({ ...current, [name]: true }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitAttempted(true);
    setFormError("");

    if (errors.name) return nameRef.current?.focus();
    if (errors.email) return emailRef.current?.focus();
    if (errors.password) return passwordRef.current?.focus();

    setStatus("submitting");
    try {
      await signup(values);
      setStatus("success");
      try {
        sessionStorage.setItem(SIGNUP_EMAIL_KEY, values.email.trim());
      } catch {
        // Storage unavailable: the login page just starts with an empty email field.
      }
      const params = new URLSearchParams({ registered: "1" });
      if (redirectTo !== "/") params.set("next", redirectTo);
      router.push(`/login?${params}`);
    } catch (error) {
      setFormError(error.message);
      setStatus("idle");
    }
  }

  return (
    <>
      <FormAlert message={formError} />
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <FormField
          ref={nameRef}
          id="name"
          label="Full name"
          autoComplete="name"
          placeholder="Jordan Lee"
          value={values.name}
          onChange={handleChange}
          onBlur={handleBlur}
          error={visibleError("name")}
        />
        <FormField
          ref={emailRef}
          id="email"
          label="Email address"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          error={visibleError("email")}
        />
        <div>
          <FormField
            ref={passwordRef}
            id="password"
            label="Password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="At least 8 characters"
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            error={visibleError("password")}
            hint="Use 8+ characters with at least one letter and one number."
            trailing={<PasswordToggle visible={showPassword} onToggle={() => setShowPassword((v) => !v)} />}
          />
          <PasswordStrength password={values.password} />
        </div>
        <SubmitButton
          isSubmitting={status === "submitting"}
          isSuccess={status === "success"}
          submittingLabel="Creating your account…"
          successLabel="Account created! Taking you to log in…"
        >
          Create account
        </SubmitButton>
        <p className="text-center text-xs leading-relaxed text-muted">
          By creating an account, you agree to Ecommerce Market&apos;s Terms of Service and Privacy Policy.
        </p>
      </form>

      <p className="mt-8 text-center text-sm text-muted">
        Already have an account?{" "}
        <Link
          href={redirectTo === "/" ? "/login" : `/login?next=${encodeURIComponent(redirectTo)}`}
          className="font-medium text-ink underline underline-offset-4 hover:text-accent"
        >
          Log in
        </Link>
      </p>
    </>
  );
}
