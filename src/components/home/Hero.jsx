import { heroSlides } from "@/data/mockData";
import { formatPrice, getCategoryByName, getProductById } from "@/lib/catalog";
import HeroSlider from "./HeroSlider";

const slides = heroSlides.map((slide) => {
  const product = getProductById(slide.productId);
  const category = getCategoryByName(product.category);
  return {
    ...slide,
    title: product.title,
    tag: product.tag,
    category: product.category,
    categoryHref: `/products?category=${category.slug}`,
    productHref: `/products/${product.id}`,
    price: formatPrice(product.price),
  };
});

export default function Hero() {
  return (
    <section className="mx-auto max-w-[90rem] px-4 pt-4 sm:px-6 sm:pt-6 lg:px-10">
      <h1 className="sr-only">Ecommerce Market: templates, software, e-books and vector packs</h1>
      <HeroSlider slides={slides} />
    </section>
  );
}
