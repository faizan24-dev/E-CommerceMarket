"use client";

import { useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2, Search } from "lucide-react";
import { CATEGORIES, getCategory } from "@/config/categories";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { api } from "@/lib/apiClient";
import { formatPrice } from "@/lib/format";
import { productsUrl, productUrl } from "@/lib/routes";

const MAX_SUGGESTIONS = 5;
const CATEGORY_CHIPS = [{ slug: "", name: "All" }, ...CATEGORIES];

/**
 * Inline header search. Matching products are fetched from the API as you type
 * (debounced) and shown in a dropdown with category chips to narrow them;
 * Enter (or the icon) opens the full results page.
 */
export default function HeaderSearch({ className = "" }) {
  const router = useRouter();
  const id = useId();
  const listboxId = `${id}-results`;
  const inputRef = useRef(null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [search, setSearch] = useState({ key: "", results: [], error: "" });

  const trimmed = query.trim();
  const debouncedQuery = useDebouncedValue(trimmed, 220);
  const requestKey = `${debouncedQuery}|${category}`;
  const hasQuery = trimmed.length > 0;
  const isLoading = hasQuery && search.key !== `${trimmed}|${category}`;
  const results = search.key === requestKey ? search.results : [];
  const showPanel = isOpen && hasQuery;
  const categoryName = getCategory(category)?.name;

  useEffect(() => {
    if (!debouncedQuery) return undefined;
    const controller = new AbortController();
    const params = new URLSearchParams({ q: debouncedQuery, limit: String(MAX_SUGGESTIONS) });
    if (category) params.set("category", category);
    api
      .get(`/products?${params}`, { signal: controller.signal })
      .then(({ products }) => setSearch({ key: requestKey, results: products, error: "" }))
      .catch((error) => {
        if (error.name !== "AbortError") setSearch({ key: requestKey, results: [], error: error.message });
      });
    return () => controller.abort();
  }, [debouncedQuery, category, requestKey]);

  function navigate(url) {
    setIsOpen(false);
    setActiveIndex(-1);
    inputRef.current?.blur();
    router.push(url);
  }

  function handleSubmit(event) {
    event.preventDefault();
    const active = results[activeIndex];
    navigate(active ? productUrl(active.slug) : productsUrl({ q: query, category }));
  }

  function handleKeyDown(event) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setIsOpen(true);
      setActiveIndex((i) => (results.length ? (i + 1) % results.length : -1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((i) => (results.length ? (i <= 0 ? results.length - 1 : i - 1) : -1));
    } else if (event.key === "Escape") {
      setIsOpen(false);
      setActiveIndex(-1);
    }
  }

  return (
    <div
      className={`relative ${className}`}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setIsOpen(false);
      }}
    >
      <form
        role="search"
        onSubmit={handleSubmit}
        className="flex items-center border-b border-ink/60 transition-colors focus-within:border-ink hover:border-ink"
      >
        <label htmlFor={`${id}-query`} className="sr-only">
          Search products
        </label>
        <input
          ref={inputRef}
          id={`${id}-query`}
          type="search"
          value={query}
          maxLength={80}
          onChange={(event) => {
            setQuery(event.target.value);
            setIsOpen(true);
            setActiveIndex(-1);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search"
          autoComplete="off"
          role="combobox"
          aria-expanded={showPanel}
          aria-controls={listboxId}
          aria-autocomplete="list"
          aria-activedescendant={activeIndex >= 0 ? `${listboxId}-${activeIndex}` : undefined}
          className="h-9 min-w-0 flex-1 bg-transparent text-[15px] tracking-wide text-ink outline-none placeholder:text-ink-soft [&::-webkit-search-cancel-button]:hidden"
        />
        <button
          type="submit"
          className="-mr-1 flex size-8 shrink-0 items-center justify-center text-ink-soft transition hover:text-ink"
          aria-label="Search"
        >
          <Search className="size-5" strokeWidth={1.5} aria-hidden="true" />
        </button>
      </form>

      {showPanel && (
        <div
          // Keep focus in the input while clicking inside the dropdown (needed for Safari).
          onMouseDown={(event) => event.preventDefault()}
          className="absolute inset-x-0 top-full z-50 mt-3 overflow-hidden rounded-2xl border border-line bg-white shadow-[0_18px_50px_-12px_rgba(28,27,25,0.25)] md:left-auto md:w-[26rem]"
        >
          <div className="flex gap-1.5 overflow-x-auto border-b border-line px-3 py-2.5 [scrollbar-width:none]">
            {CATEGORY_CHIPS.map((c) => (
              <button
                key={c.slug || "all"}
                type="button"
                onClick={() => {
                  setCategory(c.slug);
                  setActiveIndex(-1);
                }}
                aria-pressed={category === c.slug}
                className={`shrink-0 rounded-full px-3 py-1 text-xs transition ${
                  category === c.slug ? "bg-ink text-white" : "bg-canvas text-ink-soft hover:bg-cream"
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>

          {isLoading ? (
            <p className="flex items-center gap-2 px-4 py-5 text-sm text-muted" role="status">
              <Loader2 className="size-4 animate-spin" aria-hidden="true" /> Searching...
            </p>
          ) : search.error ? (
            <p className="px-4 py-5 text-sm text-danger" role="alert">
              {search.error}
            </p>
          ) : results.length > 0 ? (
            <ul id={listboxId} role="listbox" aria-label="Suggested products" className="py-1.5">
              {results.map((product, index) => (
                <li key={product.id} id={`${listboxId}-${index}`} role="option" aria-selected={index === activeIndex}>
                  <button
                    type="button"
                    onClick={() => navigate(productUrl(product.slug))}
                    onMouseEnter={() => setActiveIndex(index)}
                    className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition ${
                      index === activeIndex ? "bg-canvas" : ""
                    }`}
                  >
                    <span className="relative size-11 shrink-0 overflow-hidden rounded-md bg-cream">
                      {product.coverUrl && <Image src={product.coverUrl} alt="" fill sizes="44px" className="object-cover" />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-ink">{product.title}</span>
                      <span className="block text-xs text-muted">
                        {getCategory(product.category)?.name} | {product.fileType}
                      </span>
                    </span>
                    <span className="text-sm font-medium text-ink">{formatPrice(product.price)}</span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p id={listboxId} className="px-4 py-5 text-sm text-muted">
              No matches for <span className="font-medium text-ink">&ldquo;{trimmed}&rdquo;</span>
              {categoryName ? ` in ${categoryName}` : ""}.
            </p>
          )}

          <button
            type="button"
            onClick={() => navigate(productsUrl({ q: query, category }))}
            className="flex w-full items-center justify-between border-t border-line bg-canvas px-4 py-3 text-left text-sm font-medium text-ink transition hover:bg-cream"
          >
            <span className="truncate">
              See all results for &ldquo;{trimmed}&rdquo;{categoryName ? ` in ${categoryName}` : ""}
            </span>
            <ArrowRight className="size-4 shrink-0" aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}
