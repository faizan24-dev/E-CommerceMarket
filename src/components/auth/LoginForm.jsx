"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getSafeRedirect, validateEmail, validateLoginPassword } from "@/lib/validation";
import FormField from "./FormField";
import {
  FormAlert,
  FormSkeleton,
  FormSuccess,
  PasswordToggle,
  SIGNUP_EMAIL_KEY,
  SignedInNotice,
  SubmitButton,
} from "./AuthParts";

function readSignupEmail() {
  try {
    return sessionStorage.getItem(SIGNUP_EMAIL_KEY) ?? "";
  } catch {
    return "";
  }
}

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = getSafeRedirect(searchParams.get("next"));
  const justRegistered = searchParams.get("registered") === "1";
  const { login, user, isReady } = useAuth();

  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  // After sign-up, pre-fill the new account's email so the user only needs their password.
  const [values, setValues] = useState(() => ({
    email: justRegistered && typeof window !== "undefined" ? readSignupEmail() : "",
    password: "",
  }));
  const [touched, setTouched] = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | submitting | success
  const [formError, setFormError] = useState("");

  const errors = {
    email: validateEmail(values.email),
    password: validateLoginPassword(values.password),
  };
  const visibleError = (field) => (touched[field] || submitAttempted ? errors[field] : "");

  if (!isReady) return <FormSkeleton fields={2} />;
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

    if (errors.email) return emailRef.current?.focus();
    if (errors.password) return passwordRef.current?.focus();

    setStatus("submitting");
    try {
      await login(values);
      setStatus("success");
      try {
        sessionStorage.removeItem(SIGNUP_EMAIL_KEY);
      } catch {
        // Nothing to clean up if storage is unavailable.
      }
      router.push(redirectTo);
    } catch (error) {
      setFormError(error.message);
      setStatus("idle");
    }
  }

  return (
    <>
      {justRegistered && !formError && status !== "success" && (
        <FormSuccess message="Account created successfully! Please log in to continue." />
      )}
      <FormAlert message={formError} />
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
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
        <FormField
          ref={passwordRef}
          id="password"
          label="Password"
          type={showPassword ? "text" : "password"}
          autoComplete="current-password"
          placeholder="Enter your password"
          autoFocus={justRegistered && Boolean(values.email)}
          value={values.password}
          onChange={handleChange}
          onBlur={handleBlur}
          error={visibleError("password")}
          trailing={<PasswordToggle visible={showPassword} onToggle={() => setShowPassword((v) => !v)} />}
        />
        <SubmitButton
          isSubmitting={status === "submitting"}
          isSuccess={status === "success"}
          submittingLabel="Logging in…"
          successLabel="Signed in, redirecting…"
        >
          Log in
        </SubmitButton>
      </form>

      <p className="mt-8 text-center text-sm text-muted">
        New to Ecommerce Market?{" "}
        <Link
          href={redirectTo === "/" ? "/signup" : `/signup?next=${encodeURIComponent(redirectTo)}`}
          className="font-medium text-ink underline underline-offset-4 hover:text-accent"
        >
          Create an account
        </Link>
      </p>
    </>
  );
}
