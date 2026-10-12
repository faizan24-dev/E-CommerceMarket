"use client";

import ErrorView from "@/components/layout/ErrorView";

export default function Error({ error, retry }) {
  return <ErrorView error={error} retry={retry} />;
}
