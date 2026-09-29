"use client";

import { useId, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowRight, Search } from "lucide-react";
import { categories } from "@/data/mockData";
import { filterProducts, formatPrice, getCategoryBySlug } from "@/lib/catalog";

const MAX_SUGGESTIONS = 5;

function buildSearchUrl(query, category) {
  const params = new URLSearchParams();
  if (query.trim()) params.set("q", query.trim());
  if (category) params.set("category", category);
  const qs = params.toString();
  return qs ? `/products?${qs}` : "/products";
}

/**
 * Inline header search: a minimal underlined field you type into directly.
 * Matching products appear in a dropdown with category chips to narrow them;
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

  const hasQuery = query.trim().length > 0;
  const results = hasQuery ? filterProducts({ query, category }).slice(0, MAX_SUGGESTIONS) : [];
  const showPanel = isOpen && hasQuery;
  const categoryName = getCategoryBySlug(category)?.name;

  function navigate(url) {
    setIsOpen(false);
    setActiveIndex(-1);
    inputRef.current?.blur();
    router.push(url);
  }

  function handleSubmit(event) {
    event.preventDefault();
    const active = results[activeIndex];
    navigate(active ? `/products/${active.id}` : buildSearchUrl(query, category));
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

  function selectCategory(slug) {
    setCategory(slug);
    setActiveIndex(-1);
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
          <Search className="size-5" strokeWidth={1.5} />
        </button>
      </form>

      {showPanel && (
        <div
          // Keep focus in the input while clicking inside the dropdown (needed for Safari).
          onMouseDown={(event) => event.preventDefault()}
          className="absolute inset-x-0 top-full z-50 mt-3 overflow-hidden rounded-2xl border border-line bg-white shadow-[0_18px_50px_-12px_rgba(28,27,25,0.25)] md:left-auto md:w-[26rem]"
        >
          <div className="flex gap-1.5 overflow-x-auto border-b border-line px-3 py-2.5 [scrollbar-width:none]">
            {[{ slug: "", name: "All" }, ...categories].map((c) => (
              <button
                key={c.slug || "all"}
                type="button"
                onClick={() => selectCategory(c.slug)}
                aria-pressed={category === c.slug}
                className={`shrink-0 rounded-full px-3 py-1 text-xs transition ${
                  category === c.slug ? "bg-ink text-white" : "bg-canvas text-ink-soft hover:bg-cream"
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>

          {results.length > 0 ? (
            <ul id={listboxId} role="listbox" aria-label="Suggested products" className="py-1.5">
              {results.map((product, index) => (
                <li key={product.id} id={`${listboxId}-${index}`} role="option" aria-selected={index === activeIndex}>
                  <button
                    type="button"
                    onClick={() => navigate(`/products/${product.id}`)}
                    onMouseEnter={() => setActiveIndex(index)}
                    className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition ${
                      index === activeIndex ? "bg-canvas" : ""
                    }`}
                  >
                    <span className="relative size-11 shrink-0 overflow-hidden rounded-md bg-cream">
                      <Image src={product.image} alt="" fill sizes="44px" className="object-cover" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-ink">{product.title}</span>
                      <span className="block text-xs text-muted">
                        {product.category} · {product.fileType}
                      </span>
                    </span>
                    <span className="text-sm font-medium text-ink">{formatPrice(product.price)}</span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p id={listboxId} className="px-4 py-5 text-sm text-muted">
              No matches for <span className="font-medium text-ink">“{query.trim()}”</span>
              {categoryName ? ` in ${categoryName}` : ""}.
            </p>
          )}

          <button
            type="button"
            onClick={() => navigate(buildSearchUrl(query, category))}
            className="flex w-full items-center justify-between border-t border-line bg-canvas px-4 py-3 text-left text-sm font-medium text-ink transition hover:bg-cream"
          >
            <span className="truncate">
              See all results for “{query.trim()}”{categoryName ? ` in ${categoryName}` : ""}
            </span>
            <ArrowRight className="size-4 shrink-0" />
          </button>
        </div>
      )}
    </div>
  );
}
