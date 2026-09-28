"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { categories } from "@/data/mockData";
import { useOverlay } from "@/hooks/useOverlay";
import HeaderSearch from "./HeaderSearch";

export default function SearchPanel({ open, onClose }) {
  useOverlay(open, onClose);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-0 bg-ink/25"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-label="Search products"
            className="absolute inset-x-0 top-full z-10 border-b border-line bg-canvas shadow-[0_24px_40px_-24px_rgba(28,27,25,0.35)]"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <div className="mx-auto max-w-3xl px-4 pb-8 pt-6 sm:px-6">
              <div className="mb-4 flex items-center justify-between">
                <p className="font-serif text-xl text-ink sm:text-2xl">What are you looking for?</p>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-full p-2 text-muted transition hover:bg-cream hover:text-ink"
                  aria-label="Close search"
                >
                  <X className="size-5" />
                </button>
              </div>
              <HeaderSearch autoFocus onNavigate={onClose} />
              <div className="mt-5 flex flex-wrap items-center gap-2 text-xs">
                <span className="mr-1 font-semibold uppercase tracking-[0.14em] text-muted">Popular</span>
                {categories.map((category) => (
                  <Link
                    key={category.slug}
                    href={`/products?category=${category.slug}`}
                    onClick={onClose}
                    className="rounded-full border border-line bg-white px-3 py-1.5 text-ink-soft transition hover:border-ink/40"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
