"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Upload } from "lucide-react";
import { CATEGORIES } from "@/config/categories";
import { COMMISSION_RATE, FILE_KIND_LABELS, UPLOAD_LIMITS, calculateCommission } from "@/config/marketplace";
import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";
import { SelectField, TextAreaField, TextField } from "@/components/ui/Field";
import { FileField } from "@/components/ui/FileField";
import { api } from "@/lib/apiClient";
import { formatFileSize, formatMoney } from "@/lib/format";

const PRICE_PATTERN = /^\d+(\.\d{1,2})?$/;

function checkFile(file, rule, label, required) {
  if (!file) return required ? `Please choose a ${label}.` : "";
  if (file.size > rule.maxBytes) return `The ${label} must be ${formatFileSize(rule.maxBytes)} or smaller.`;
  const extension = file.name.split(".").pop()?.toLowerCase();
  if (!rule.accept.split(",").includes(`.${extension}`)) {
    return `The ${label} must be one of: ${rule.kinds.map((k) => FILE_KIND_LABELS[k]).join(", ")}.`;
  }
  return "";
}

/**
 * Create or edit a product. Sends multipart form data: the text fields, a
 * cover image (header) and the downloadable file. When editing, both files
 * are optional and replace the current ones only if chosen.
 */
export default function ProductForm({ product, isAdmin = false, redirectTo = "/sell/products" }) {
  const router = useRouter();
  const isEdit = Boolean(product);
  const [values, setValues] = useState({
    title: product?.title ?? "",
    description: product?.description ?? "",
    price: product ? (product.price / 100).toFixed(2) : "",
    category: product?.category ?? "",
    includes: product?.includes.join("\n") ?? "",
    tag: product?.tag ?? "",
  });
  const [cover, setCover] = useState(null);
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const priceCents = PRICE_PATTERN.test(values.price) ? Math.round(Number(values.price) * 100) : null;
  const split = priceCents !== null ? calculateCommission(priceCents, isAdmin ? 1 : COMMISSION_RATE) : null;

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
  }

  function validate() {
    const next = {
      title: values.title.trim().length < 3 ? "Title must be at least 3 characters." : "",
      description: values.description.trim().length < 20 ? "Description must be at least 20 characters." : "",
      price: priceCents === null ? "Enter a price like 19 or 19.99 (0 for free)." : "",
      category: values.category ? "" : "Choose a category.",
      cover: checkFile(cover, UPLOAD_LIMITS.coverImage, "cover image", !isEdit),
      file: checkFile(file, UPLOAD_LIMITS.productFile, "product file", !isEdit),
    };
    setErrors(next);
    return Object.values(next).every((message) => !message);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError("");
    if (!validate()) return;

    const formData = new FormData();
    for (const key of ["title", "description", "price", "category", "tag"]) formData.set(key, values[key].trim());
    values.includes
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .forEach((line) => formData.append("includes", line));
    if (cover) formData.set("cover", cover);
    if (file) formData.set("file", file);

    setIsSubmitting(true);
    try {
      if (isEdit) await api.patch(`/products/${product.id}`, formData);
      else await api.post("/products", formData);
      router.push(redirectTo);
      router.refresh();
    } catch (error) {
      setFormError(error.message);
      setErrors((current) => ({ ...current, ...error.fieldErrors }));
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {formError && <Alert tone="error">{formError}</Alert>}
      {isEdit && !isAdmin && product.status === "published" && (
        <Alert tone="info">Saving changes sends this product back for a quick review before it goes live again.</Alert>
      )}

      <TextField id="title" label="Title" value={values.title} onChange={handleChange} maxLength={120} error={errors.title} />
      <TextAreaField
        id="description"
        label="Description"
        rows={7}
        value={values.description}
        onChange={handleChange}
        maxLength={5000}
        hint="What buyers get, who it's for and how to use it."
        error={errors.description}
      />

      <div className="grid gap-6 sm:grid-cols-2">
        <TextField
          id="price"
          label={`Price (USD)`}
          inputMode="decimal"
          placeholder="19.99"
          value={values.price}
          onChange={handleChange}
          error={errors.price}
          hint={
            split && priceCents > 0
              ? isAdmin
                ? "Platform product: the full amount is store revenue."
                : `You earn ${formatMoney(split.sellerEarning)} per sale after the ${Math.round(COMMISSION_RATE * 100)}% commission.`
              : "Use 0 to offer it for free."
          }
        />
        <SelectField
          id="category"
          label="Category"
          value={values.category}
          onChange={handleChange}
          placeholder="Choose a category"
          options={CATEGORIES.map((c) => ({ value: c.slug, label: c.name }))}
          error={errors.category}
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <TextAreaField
          id="includes"
          label="What's included (optional)"
          rows={4}
          value={values.includes}
          onChange={handleChange}
          hint="One item per line, up to 10."
          error={errors.includes}
        />
        <TextField
          id="tag"
          label="Badge (optional)"
          placeholder="New, Bestseller..."
          value={values.tag}
          onChange={handleChange}
          maxLength={30}
          error={errors.tag}
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <FileField
          id="cover"
          label="Cover image"
          accept={UPLOAD_LIMITS.coverImage.accept}
          hint={`JPG, PNG or WebP, up to ${formatFileSize(UPLOAD_LIMITS.coverImage.maxBytes)}. Shown as the product header.`}
          file={cover}
          current={isEdit ? "Current cover image" : null}
          onChange={(selected) => {
            setCover(selected);
            setErrors((current) => ({ ...current, cover: "" }));
          }}
          error={errors.cover}
        />
        <FileField
          id="file"
          label="Product file"
          accept={UPLOAD_LIMITS.productFile.accept}
          hint={`PDF or ZIP, up to ${formatFileSize(UPLOAD_LIMITS.productFile.maxBytes)}. Only buyers can download it.`}
          file={file}
          current={product?.file ? `${product.file.filename} (${formatFileSize(product.file.size)})` : null}
          onChange={(selected) => {
            setFile(selected);
            setErrors((current) => ({ ...current, file: "" }));
          }}
          error={errors.file}
        />
      </div>

      <div className="flex flex-wrap items-center gap-3 border-t border-line pt-6">
        <Button type="submit" size="lg" icon={isEdit ? Save : Upload} isLoading={isSubmitting}>
          {isSubmitting ? "Uploading..." : isEdit ? "Save changes" : isAdmin ? "Publish product" : "Submit for review"}
        </Button>
        <Button href={redirectTo} variant="ghost" size="lg">
          Cancel
        </Button>
      </div>
    </form>
  );
}
