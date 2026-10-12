"use client";

import { useState } from "react";
import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";
import { TextField } from "@/components/ui/Field";
import { useAsyncAction } from "@/hooks/useAsyncAction";
import { api } from "@/lib/apiClient";
import { NAME_MAX_LENGTH, validateName } from "@/lib/validation";
import { useAuthStore } from "@/store/authStore";

export default function ProfileForm({ initialName, email }) {
  const [name, setName] = useState(initialName);
  const [clientError, setClientError] = useState("");
  const [saved, setSaved] = useState(false);
  const setUser = useAuthStore((state) => state.setUser);
  const { run, isPending, errorMessage, fieldErrors } = useAsyncAction();

  async function handleSubmit(event) {
    event.preventDefault();
    setSaved(false);
    const error = validateName(name);
    setClientError(error);
    if (error) return;
    const result = await run(() => api.patch("/account/profile", { name }));
    if (result) {
      setUser(result.user);
      setSaved(true);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {errorMessage && <Alert tone="error">{errorMessage}</Alert>}
      {saved && <Alert tone="success">Profile saved.</Alert>}
      <TextField
        id="name"
        label="Full name"
        autoComplete="name"
        value={name}
        maxLength={NAME_MAX_LENGTH}
        onChange={(event) => setName(event.target.value)}
        error={clientError || fieldErrors.name}
      />
      <TextField id="email" label="Email address" value={email} disabled hint="Contact support to change your email." />
      <Button type="submit" isLoading={isPending}>
        Save profile
      </Button>
    </form>
  );
}
