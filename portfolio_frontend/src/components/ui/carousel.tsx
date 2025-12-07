"use client";

import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from "embla-carousel-react";
import * as React from "react";
// import { ArrowLeft, ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { ArrowLeft, ArrowRight } from "lucide-react";
// import { Button } from "@/components/ui/button";

type CarouselApi = UseEmblaCarouselType[1];
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>;
type CarouselOptions = UseCarouselParameters[0];
type CarouselPlugin = UseCarouselParameters[1];

type CarouselProps = {
  opts?: CarouselOptions;
  plugins?: CarouselPlugin;
  orientation?: "horizontal" | "vertical";
  setApi?: (api: CarouselApi) => void;
  autoPlay?: boolean;
  autoPlayInterval?: number;
};

type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0];
  api: ReturnType<typeof useEmblaCarousel>[1];
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
} & CarouselProps;

const CarouselContext = React.createContext<CarouselContextProps | null>(null);

function useCarousel() {
  const context = React.useContext(CarouselContext);

  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />");
  }

  return context;
}

function Carousel({
  orientation = "horizontal",
  opts,
  setApi,
  plugins,
  className,
  children,
  autoPlay = true,
  autoPlayInterval = 3000,
  ...props
}: React.ComponentProps<"div"> & CarouselProps) {
  const [carouselRef, api] = useEmblaCarousel(
    {
      ...opts,
      axis: orientation === "horizontal" ? "x" : "y",
    },
    plugins
  );

  const [canScrollPrev, setCanScrollPrev] = React.useState(false);
  const [canScrollNext, setCanScrollNext] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false); // ⬅️ untuk pause on hover

  const onSelect = React.useCallback((api: CarouselApi) => {
    if (!api) return;
    setCanScrollPrev(api.canScrollPrev());
    setCanScrollNext(api.canScrollNext());
  }, []);

  const scrollPrev = React.useCallback(() => {
    api?.scrollPrev();
  }, [api]);

  const scrollNext = React.useCallback(() => {
    api?.scrollNext();
  }, [api]);

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        scrollPrev();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        scrollNext();
      }
    },
    [scrollPrev, scrollNext]
  );

  React.useEffect(() => {
    if (!api) return;

    setApi?.(api);

    onSelect(api);
    api.on("reInit", onSelect);
    api.on("select", onSelect);

    return () => {
      api.off("reInit", onSelect);
      api.off("select", onSelect);
    };
  }, [api, onSelect, setApi]);

  const loop = opts?.loop ?? false;

  // AUTOPLAY + PAUSE ON HOVER
  React.useEffect(() => {
    if (!api || !autoPlay) return;
    if (typeof window === "undefined") return;

    // kalau di-hover, jangan buat interval
    if (isHovered) return;

    const play = () => {
      if (!api) return;

      if (!loop && !api.canScrollNext()) {
        api.scrollTo(0);
      } else {
        api.scrollNext();
      }
    };

    const id = window.setInterval(play, autoPlayInterval);

    return () => {
      window.clearInterval(id);
    };
  }, [api, autoPlay, autoPlayInterval, loop, isHovered]);

  return (
    <CarouselContext.Provider
      value={{
        carouselRef,
        api,
        opts,
        orientation:
          orientation || (opts?.axis === "y" ? "vertical" : "horizontal"),
        scrollPrev,
        scrollNext,
        canScrollPrev,
        canScrollNext,
        autoPlay,
        autoPlayInterval,
      }}
    >
      <div
        onKeyDownCapture={handleKeyDown}
        onMouseEnter={() => setIsHovered(true)} // ⬅️ pause autoplay
        onMouseLeave={() => setIsHovered(false)} // ⬅️ resume autoplay
        className={cn("relative", className)}
        role="region"
        aria-roledescription="carousel"
        data-slot="carousel"
        {...props}
      >
        {children}
      </div>
    </CarouselContext.Provider>
  );
}

function CarouselContent({ className, ...props }: React.ComponentProps<"div">) {
  const { carouselRef, orientation } = useCarousel();

  return (
    <div
      ref={carouselRef}
      className="overflow-hidden"
      data-slot="carousel-content"
    >
      <div
        className={cn(
          "flex",
          orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col",
          className
        )}
        {...props}
      />
    </div>
  );
}

function CarouselItem({ className, ...props }: React.ComponentProps<"div">) {
  const { orientation } = useCarousel();

  return (
    <div
      role="group"
      aria-roledescription="slide"
      data-slot="carousel-item"
      className={cn(
        "min-w-0 shrink-0 grow-0 basis-full",
        orientation === "horizontal" ? "pl-4" : "pt-4",
        className
      )}
      {...props}
    />
  );
}

// optional: tetap export ini kalau dipakai di tempat lain, tapi kamu sekarang tidak menggunakannya
function CarouselPrevious(
  props: React.ButtonHTMLAttributes<HTMLButtonElement>
) {
  const { scrollPrev } = useCarousel();

  return (
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation();
        scrollPrev();
      }}
      className={cn(
        "pointer-events-auto absolute left-2 top-1/2 z-40 -translate-y-1/2 inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-700/70 bg-slate-900/80 text-slate-100 shadow-md backdrop-blur-md transition hover:border-slate-400 hover:text-white",
        props.className
      )}
      aria-label="Previous slide"
      {...props}
    >
      <ArrowLeft className="h-4 w-4" />
    </button>
  );
}

function CarouselNext(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { scrollNext } = useCarousel();

  return (
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation();
        scrollNext();
      }}
      className={cn(
        "pointer-events-auto absolute right-2 top-1/2 z-40 -translate-y-1/2 inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-700/70 bg-slate-900/80 text-slate-100 shadow-md backdrop-blur-md transition hover:border-slate-400 hover:text-white",
        props.className
      )}
      aria-label="Next slide"
      {...props}
    >
      <ArrowRight className="h-4 w-4" />
    </button>
  );
}

export {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
};
