"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Store } from "lucide-react";
import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";
import { TextAreaField, TextField } from "@/components/ui/Field";
import { api } from "@/lib/apiClient";
import { useAuthStore } from "@/store/authStore";

/**
 * Opens a seller shop (`mode="create"`) or edits the store profile (`mode="edit"`).
 */
export default function StoreForm({ mode = "create", initial = { storeName: "", bio: "" } }) {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [saved, setSaved] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isCreate = mode === "create";

  function handleChange(event) {
    setValues((current) => ({ ...current, [event.target.name]: event.target.value }));
    setErrors({});
    setSaved(false);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError("");
    if (values.storeName.trim().length < 2) {
      setErrors({ storeName: "Store name must be at least 2 characters." });
      return;
    }

    setIsSubmitting(true);
    try {
      const { user } = isCreate ? await api.post("/seller/store", values) : await api.patch("/seller/store", values);
      setUser(user);
      if (isCreate) router.push("/sell/products/new");
      else setSaved(true);
      router.refresh();
    } catch (error) {
      setFormError(error.message);
      setErrors(error.fieldErrors);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {formError && <Alert tone="error">{formError}</Alert>}
      {saved && <Alert tone="success">Store profile saved.</Alert>}
      <TextField
        id="storeName"
        label="Store name"
        placeholder="Studio North"
        value={values.storeName}
        onChange={handleChange}
        maxLength={60}
        error={errors.storeName}
        hint={isCreate ? "Shown on your products and your public store page." : undefined}
      />
      <TextAreaField
        id="bio"
        label="About your store (optional)"
        rows={4}
        value={values.bio}
        onChange={handleChange}
        maxLength={600}
        error={errors.bio}
      />
      <Button type="submit" icon={isCreate ? Store : undefined} isLoading={isSubmitting} size={isCreate ? "lg" : "md"}>
        {isCreate ? "Open my shop" : "Save store profile"}
      </Button>
    </form>
  );
}
