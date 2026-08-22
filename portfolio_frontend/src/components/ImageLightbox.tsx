import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef } from "react";

import { setScrollLocked } from "@/lib/useSmoothScroll";

export default function ImageLightbox({
  src,
  alt,
  isOpen,
  onClose,
}: {
  src: string;
  alt: string;
  isOpen: boolean;
  onClose: () => void;
}) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    setScrollLocked(true);
    // Fokus dipindah ke tombol tutup supaya Esc dan Tab punya tempat berpijak
    // di dalam overlay, bukan tertinggal di tombol gambar di belakangnya.
    closeButtonRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      setScrollLocked(false);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={alt}
          onClick={onClose}
          className="fixed inset-0 z-1000 flex items-center justify-center bg-secondary/90 p-4 md:p-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Tutup gambar"
            className="absolute right-4 top-4 inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-background text-background transition-colors hover:bg-background hover:text-secondary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-background md:right-8 md:top-8"
          >
            <X className="h-5 w-5" />
          </button>

          <motion.img
            src={src}
            alt={alt}
            // Klik pada gambar tidak ikut menutup — hanya latar di sekitarnya.
            onClick={(e) => e.stopPropagation()}
            className="max-h-full max-w-full cursor-default object-contain"
            initial={{ scale: 0.96 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.96 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
