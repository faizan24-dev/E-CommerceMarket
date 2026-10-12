"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";
import { TextField } from "@/components/ui/Field";
import { loginUrl } from "@/lib/routes";
import { getSafeRedirect, PASSWORD_MIN_LENGTH, validateEmail, validateName, validateNewPassword } from "@/lib/validation";
import { useAuthStore } from "@/store/authStore";
import { FormSkeleton, PasswordStrength, PasswordToggle, SIGNUP_EMAIL_KEY, SignedInNotice } from "./AuthParts";

export default function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = getSafeRedirect(searchParams.get("next"));
  const { signup, user, status: authStatus } = useAuthStore();

  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const [values, setValues] = useState({ name: "", email: "", password: "" });
  const [touched, setTouched] = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | submitting | success
  const [formError, setFormError] = useState("");
  const [serverErrors, setServerErrors] = useState({});

  const errors = {
    name: validateName(values.name) || serverErrors.name,
    email: validateEmail(values.email) || serverErrors.email,
    password: validateNewPassword(values.password) || serverErrors.password,
  };
  const visibleError = (field) => (touched[field] || submitAttempted ? errors[field] : "");

  if (authStatus === "loading") return <FormSkeleton fields={3} />;
  if (user && status === "idle") return <SignedInNotice redirectTo={redirectTo} />;

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setServerErrors((current) => ({ ...current, [name]: undefined }));
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
      await signup({ name: values.name.trim(), email: values.email.trim(), password: values.password });
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
      setServerErrors(error.fieldErrors ?? {});
      setStatus("idle");
    }
  }

  return (
    <>
      {formError && (
        <Alert tone="error" className="mb-6">
          {formError}
        </Alert>
      )}
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <TextField
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
        <TextField
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
          <TextField
            ref={passwordRef}
            id="password"
            label="Password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder={`At least ${PASSWORD_MIN_LENGTH} characters`}
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            error={visibleError("password")}
            hint={`Use ${PASSWORD_MIN_LENGTH}+ characters with at least one letter and one number.`}
            trailing={<PasswordToggle visible={showPassword} onToggle={() => setShowPassword((v) => !v)} />}
          />
          <PasswordStrength password={values.password} />
        </div>
        <Button type="submit" size="lg" fullWidth isLoading={status === "submitting"} disabled={status === "success"}>
          {status === "success"
            ? "Account created. Taking you to log in..."
            : status === "submitting"
              ? "Creating your account..."
              : "Create account"}
        </Button>
        <p className="text-center text-xs leading-relaxed text-muted">
          By creating an account, you agree to Ecommerce Market&apos;s Terms of Service and Privacy Policy.
        </p>
      </form>

      <p className="mt-8 text-center text-sm text-muted">
        Already have an account?{" "}
        <Link href={loginUrl(redirectTo)} className="font-medium text-ink underline underline-offset-4 hover:text-accent">
          Log in
        </Link>
      </p>
    </>
  );
}
