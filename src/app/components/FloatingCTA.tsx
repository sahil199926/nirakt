"use client";

import { useScrollPosition } from "@/app/hooks/useScrollPosition";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Plane } from "lucide-react";

export function FloatingCTA() {
  const scrollPosition = useScrollPosition();
  const isVisible = scrollPosition > 500;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2"
        >
          <a href="#contact" onClick={(e) => { e.preventDefault(); document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" }); }}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-white font-semibold text-sm rounded-full shadow-lg hover:brightness-110 transition-all"
          >
            <Plane className="w-4 h-4" /> Plan My Trip
          </a>
          <a href="https://wa.me/919319053504" target="_blank" rel="noopener noreferrer"
            className="w-12 h-12 flex items-center justify-center bg-[#25D366] text-white rounded-full shadow-lg hover:scale-105 transition-transform" aria-label="Chat on WhatsApp">
            <MessageCircle className="w-5 h-5" />
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
