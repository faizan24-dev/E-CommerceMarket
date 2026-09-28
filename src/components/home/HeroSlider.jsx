"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

// Move to the next product every 3 seconds (the pause button stops it).
const AUTOPLAY_MS = 3000;
const SWIPE_DISTANCE = 80;
const SWIPE_VELOCITY = 500;

const slideVariants = {
  enter: ({ direction, reduceMotion }) =>
    reduceMotion ? { opacity: 0 } : { x: `${direction * 100}%`, opacity: 1 },
  center: { x: 0, opacity: 1 },
  exit: ({ direction, reduceMotion }) =>
    reduceMotion ? { opacity: 0 } : { x: `${direction * -100}%`, opacity: 1 },
};

export default function HeroSlider({ slides }) {
  const reduceMotion = useReducedMotion();
  const [[index, direction], setSlide] = useState([0, 1]);
  const [isPausedByUser, setIsPausedByUser] = useState(false);
  const count = slides.length;
  const slide = slides[index];
  // Reduced-motion visitors still get autoplay, but with a fade instead of a slide.
  const isAutoplaying = !isPausedByUser;

  function goTo(nextIndex, nextDirection) {
    setSlide([(nextIndex + count) % count, nextDirection]);
  }
  const next = () => goTo(index + 1, 1);
  const prev = () => goTo(index - 1, -1);

  // Restart the timer whenever the slide changes, so manual navigation gets a full interval.
  useEffect(() => {
    if (!isAutoplaying) return undefined;
    const timer = setTimeout(() => setSlide(([i]) => [(i + 1) % count, 1]), AUTOPLAY_MS);
    return () => clearTimeout(timer);
  }, [index, isAutoplaying, count]);

  function handleKeyDown(event) {
    if (event.key === "ArrowRight") next();
    if (event.key === "ArrowLeft") prev();
  }

  function handleDragEnd(_event, { offset, velocity }) {
    if (offset.x < -SWIPE_DISTANCE || velocity.x < -SWIPE_VELOCITY) next();
    else if (offset.x > SWIPE_DISTANCE || velocity.x > SWIPE_VELOCITY) prev();
  }

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured products"
      onKeyDown={handleKeyDown}
      className="relative aspect-[4/5] max-h-[calc(100svh-7rem)] min-h-[28rem] w-full overflow-hidden rounded-2xl bg-sand sm:aspect-[16/10] sm:rounded-3xl lg:aspect-[2/1] lg:max-h-[720px]"
    >
      <AnimatePresence initial={false} custom={{ direction, reduceMotion }}>
        <motion.div
          key={index}
          role="group"
          aria-roledescription="slide"
          aria-label={`${index + 1} of ${count}: ${slide.title}`}
          custom={{ direction, reduceMotion }}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ x: { type: "tween", duration: 0.7, ease: [0.32, 0.72, 0, 1] }, opacity: { duration: 0.4 } }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.18}
          onDragEnd={handleDragEnd}
          className="absolute inset-0 cursor-grab touch-pan-y active:cursor-grabbing"
        >
          <Image
            src={slide.image}
            alt=""
            fill
            priority={index === 0}
            draggable={false}
            sizes="(min-width: 1440px) 1360px, 100vw"
            className="pointer-events-none select-none object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent sm:bg-gradient-to-r sm:from-black/65 sm:via-black/25 sm:to-transparent" />

          <div className="absolute inset-x-0 bottom-0 max-w-2xl px-6 pb-16 text-white sm:inset-y-0 sm:flex sm:flex-col sm:justify-center sm:px-12 sm:pb-0 lg:px-16">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/75">
              {slide.tag ?? "Featured"} · {slide.category}
            </p>
            <h2 className="mt-3 font-serif text-[28px] leading-[1.08] tracking-tight sm:text-4xl md:text-5xl xl:text-6xl">
              {slide.headline}
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-white/80 sm:text-base">{slide.subline}</p>
            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link
                href={slide.productHref}
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-ink transition hover:bg-cream"
              >
                Shop now · {slide.price}
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href={slide.categoryHref}
                className="text-sm font-medium text-white underline decoration-white/40 underline-offset-4 transition hover:decoration-white"
              >
                Browse {slide.category}
              </Link>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <p className="sr-only" aria-live={isAutoplaying ? "off" : "polite"} aria-atomic="true">
        Slide {index + 1} of {count}: {slide.title}
      </p>

      <div className="absolute inset-x-0 bottom-5 flex items-center justify-center gap-2 sm:bottom-7">
        {slides.map((item, i) => (
          <button
            key={item.productId}
            type="button"
            onClick={() => goTo(i, i > index ? 1 : -1)}
            className="group flex h-6 items-center"
            aria-label={`Go to slide ${i + 1}: ${item.title}`}
            aria-current={i === index ? "true" : undefined}
          >
            <span
              className={`block h-1.5 rounded-full transition-all duration-500 ${
                i === index ? "w-9 bg-white" : "w-1.5 bg-white/55 group-hover:bg-white/80"
              }`}
            />
          </button>
        ))}
      </div>

      <div className="absolute bottom-4 right-4 flex items-center gap-2 sm:bottom-6 sm:right-6">
        <button
          type="button"
          onClick={() => setIsPausedByUser((paused) => !paused)}
          className="flex size-9 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-md transition hover:bg-white/30"
          aria-label={isPausedByUser ? "Play slideshow" : "Pause slideshow"}
        >
          {isPausedByUser ? <Play className="size-4" /> : <Pause className="size-4" />}
        </button>
        <button
          type="button"
          onClick={prev}
          className="hidden size-10 items-center justify-center rounded-full bg-white text-ink shadow-sm transition hover:bg-cream sm:flex"
          aria-label="Previous slide"
        >
          <ChevronLeft className="size-5" />
        </button>
        <button
          type="button"
          onClick={next}
          className="hidden size-10 items-center justify-center rounded-full bg-white text-ink shadow-sm transition hover:bg-cream sm:flex"
          aria-label="Next slide"
        >
          <ChevronRight className="size-5" />
        </button>
      </div>
    </div>
  );
}
