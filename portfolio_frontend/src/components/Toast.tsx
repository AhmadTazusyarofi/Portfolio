import { motion } from "motion/react";

export default function Toast({
  message,
  isVisible,
  onClose,
}: {
  message: string;
  isVisible: boolean;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="pointer-events-none fixed bottom-4 left-0 right-0 z-1000 px-4 sm:bottom-6"
    >
      <div className="pointer-events-auto mx-auto flex w-full max-w-lg items-start gap-3 rounded-2xl border border-secondary bg-background px-4 py-3">
        <div className="flex-1">
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.25em] text-secondary opacity-60">
            Info
          </p>
          <p className="text-sm text-secondary">{message}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="ml-2 cursor-pointer text-xs font-medium uppercase tracking-wide text-secondary hover:underline"
        >
          Close
        </button>
      </div>
    </motion.div>
  );
}
