"use client";

import { useState } from "react";
import { PasswordStrength, PasswordToggle } from "@/components/auth/AuthParts";
import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";
import { TextField } from "@/components/ui/Field";
import { useAsyncAction } from "@/hooks/useAsyncAction";
import { api } from "@/lib/apiClient";
import { validateLoginPassword, validateNewPassword } from "@/lib/validation";

const EMPTY = { currentPassword: "", newPassword: "" };

/** Changing the password signs out every other device (handled by the API). */
export default function ChangePasswordForm() {
  const [values, setValues] = useState(EMPTY);
  const [showPasswords, setShowPasswords] = useState(false);
  const [clientErrors, setClientErrors] = useState({});
  const [message, setMessage] = useState("");
  const { run, isPending, errorMessage, fieldErrors } = useAsyncAction();

  function handleChange(event) {
    setValues((current) => ({ ...current, [event.target.name]: event.target.value }));
    setClientErrors({});
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    const errors = {
      currentPassword: validateLoginPassword(values.currentPassword),
      newPassword: validateNewPassword(values.newPassword),
    };
    setClientErrors(errors);
    if (errors.currentPassword || errors.newPassword) return;

    const result = await run(() => api.put("/account/password", values));
    if (result) {
      setValues(EMPTY);
      setMessage(result.message);
    }
  }

  const toggle = <PasswordToggle visible={showPasswords} onToggle={() => setShowPasswords((v) => !v)} />;

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {errorMessage && <Alert tone="error">{errorMessage}</Alert>}
      {message && <Alert tone="success">{message}</Alert>}
      <TextField
        id="currentPassword"
        label="Current password"
        type={showPasswords ? "text" : "password"}
        autoComplete="current-password"
        value={values.currentPassword}
        onChange={handleChange}
        error={clientErrors.currentPassword || fieldErrors.currentPassword}
        trailing={toggle}
      />
      <div>
        <TextField
          id="newPassword"
          label="New password"
          type={showPasswords ? "text" : "password"}
          autoComplete="new-password"
          value={values.newPassword}
          onChange={handleChange}
          error={clientErrors.newPassword || fieldErrors.newPassword}
        />
        <PasswordStrength password={values.newPassword} />
      </div>
      <Button type="submit" isLoading={isPending}>
        Update password
      </Button>
    </form>
  );
}
