"use client";

import { useId, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowRight, ChevronDown, Search } from "lucide-react";
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

export default function HeaderSearch({ autoFocus = false, onNavigate }) {
  const router = useRouter();
  const id = useId();
  const listboxId = `${id}-results`;
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
    router.push(url);
    onNavigate?.();
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
    } else if (event.key === "Escape" && showPanel) {
      // First Escape closes the suggestions; the next one bubbles up and closes the search panel.
      event.stopPropagation();
      setIsOpen(false);
      setActiveIndex(-1);
    }
  }

  return (
    <div
      className="relative w-full"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setIsOpen(false);
      }}
    >
      <form
        role="search"
        onSubmit={handleSubmit}
        className="flex h-13 items-center rounded-full border border-line bg-white transition focus-within:border-ink/40 focus-within:shadow-[0_0_0_4px_rgba(28,27,25,0.06)]"
      >
        <label htmlFor={`${id}-category`} className="sr-only">
          Category
        </label>
        <div className="relative h-full shrink-0">
          <select
            id={`${id}-category`}
            value={category}
            onChange={(event) => {
              setCategory(event.target.value);
              setActiveIndex(-1);
            }}
            className="h-full max-w-28 cursor-pointer appearance-none truncate rounded-l-full bg-transparent pl-4 pr-7 text-[13px] font-medium text-ink outline-none sm:max-w-none"
          >
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
          <ChevronDown
            className="pointer-events-none absolute right-2 top-1/2 size-3.5 -translate-y-1/2 text-muted"
            aria-hidden="true"
          />
        </div>

        <span className="h-5 w-px shrink-0 bg-line" aria-hidden="true" />

        <label htmlFor={`${id}-query`} className="sr-only">
          Search digital products
        </label>
        <input
          id={`${id}-query`}
          type="search"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setIsOpen(true);
            setActiveIndex(-1);
          }}
          onFocus={() => setIsOpen(true)}
          autoFocus={autoFocus}
          onKeyDown={handleKeyDown}
          placeholder={categoryName ? `Search ${categoryName.toLowerCase()}` : "Search templates, e-books, software…"}
          autoComplete="off"
          role="combobox"
          aria-expanded={showPanel}
          aria-controls={listboxId}
          aria-autocomplete="list"
          aria-activedescendant={activeIndex >= 0 ? `${listboxId}-${activeIndex}` : undefined}
          className="h-full min-w-0 flex-1 bg-transparent px-3 text-sm text-ink outline-none placeholder:text-muted [&::-webkit-search-cancel-button]:hidden"
        />

        <button
          type="submit"
          className="mr-1.5 flex size-10 shrink-0 items-center justify-center rounded-full bg-ink text-white transition hover:bg-ink-soft"
          aria-label="Search"
        >
          <Search className="size-4" strokeWidth={2} />
        </button>
      </form>

      {showPanel && (
        <div className="absolute inset-x-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-line bg-white shadow-[0_18px_50px_-12px_rgba(28,27,25,0.25)]">
          {results.length > 0 ? (
            <ul id={listboxId} role="listbox" aria-label="Suggested products" className="py-2">
              {results.map((product, index) => (
                <li
                  key={product.id}
                  id={`${listboxId}-${index}`}
                  role="option"
                  aria-selected={index === activeIndex}
                >
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
            <div id={listboxId} className="px-4 py-5 text-sm text-muted">
              No matches for <span className="font-medium text-ink">“{query.trim()}”</span>
              {categoryName ? ` in ${categoryName}` : ""}.
              {categoryName && (
                <button
                  type="button"
                  onClick={() => setCategory("")}
                  className="ml-1 font-medium text-accent underline-offset-2 hover:underline"
                >
                  Search all categories
                </button>
              )}
            </div>
          )}
          <button
            type="button"
            onClick={() => navigate(buildSearchUrl(query, category))}
            className="flex w-full items-center justify-between border-t border-line bg-canvas px-4 py-3 text-left text-sm font-medium text-ink transition hover:bg-cream"
          >
            See all results for “{query.trim()}”{categoryName ? ` in ${categoryName}` : ""}
            <ArrowRight className="size-4" />
          </button>
        </div>
      )}
    </div>
  );
}
