import { getCategory } from "@/config/categories";
import { heroSlides } from "@/content/home";
import { formatPrice } from "@/lib/format";
import { productsUrl, productUrl } from "@/lib/routes";
import HeroSlider from "./HeroSlider";

/**
 * Builds the slider from the marketing slides. Slides whose product is
 * published get a "Shop now" link with the live price; the rest link to their category.
 */
export default function Hero({ products }) {
  const bySlug = new Map(products.map((product) => [product.slug, product]));
  const slides = heroSlides.map((slide) => {
    const product = bySlug.get(slide.productSlug);
    const category = getCategory(product?.category ?? slide.category);
    return {
      key: slide.productSlug,
      image: slide.image,
      headline: slide.headline,
      subline: slide.subline,
      title: product?.title ?? slide.headline,
      eyebrow: `${product?.tag ?? "Featured"} | ${category?.name ?? "Shop"}`,
      categoryName: category?.name ?? "all products",
      categoryHref: productsUrl({ category: category?.slug }),
      primaryHref: product ? productUrl(product.slug) : productsUrl({ category: category?.slug }),
      primaryLabel: product ? `Shop now | ${formatPrice(product.price)}` : "Explore",
    };
  });

  return (
    <section className="mx-auto max-w-[90rem] px-4 pt-4 sm:px-6 sm:pt-6 lg:px-10">
      <h1 className="sr-only">Ecommerce Market: templates, e-books, software and vector packs</h1>
      <HeroSlider slides={slides} />
    </section>
  );
}
