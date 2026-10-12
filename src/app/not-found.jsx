import { SearchX } from "lucide-react";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";

export const metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <EmptyState
      icon={SearchX}
      title="We couldn't find that page"
      description="It may have moved, or the link might be mistyped. Try browsing the shop instead."
      className="py-24"
      action={
        <div className="flex flex-wrap justify-center gap-3">
          <Button href="/products">Browse products</Button>
          <Button href="/" variant="secondary">
            Go to home page
          </Button>
        </div>
      }
    />
  );
}
