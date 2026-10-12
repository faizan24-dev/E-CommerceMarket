import { Download } from "lucide-react";
import { buttonClasses } from "@/components/ui/Button";
import { downloadUrl } from "@/lib/routes";

/**
 * Downloads a product file. A plain <a> (not next/link), because the target is
 * an API route that returns a file, not a page.
 */
export default function DownloadLink({ productId, label = "Download", variant = "primary", size = "sm" }) {
  return (
    <a href={downloadUrl(productId)} className={buttonClasses({ variant, size })} download>
      <Download className="size-4" aria-hidden="true" /> {label}
    </a>
  );
}
