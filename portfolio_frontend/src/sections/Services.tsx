import { motion } from "motion/react";

import FlowingMenu, { type FlowingMenuItem } from "@/components/FlowingMenu";

/* Peran, bukan paket layanan — sesuai cara Ahmad menyebutkan dirinya.
   Full-Stack Developer punya buktinya di portfolio: Visit Ciremai
   (Express + MySQL + JWT), Goods Inventory Dashboard (Express + Prisma),
   dan Portal Koperasi (Express). */
const SERVICES: FlowingMenuItem[] = [
  { link: "#contact", text: "Web Developer" },
  { link: "#contact", text: "Frontend Developer" },
  { link: "#contact", text: "Mobile Developer" },
  { link: "#contact", text: "Full-Stack Developer" },
];

export default function Services() {
  return (
    <motion.section
      id="services"
      className="relative px-6 py-20 md:px-10 md:py-28"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="mx-auto max-w-6xl">
        <h2 className="font-display text-4xl leading-[1.05] text-secondary sm:text-5xl md:text-6xl lg:text-7xl">
          Services
        </h2>

        {/* FlowingMenu membagi tinggi kontainer rata ke tiap baris lewat
            flex-1, jadi tingginya harus ditentukan di sini — tanpa itu semua
            barisnya kolaps jadi nol. */}
        <div className="mt-12 h-[380px] border-y border-secondary sm:h-[440px] md:h-[520px]">
          <FlowingMenu
            items={SERVICES}
            speed={18}
            textColor="#000000"
            bgColor="#faf7f5"
            marqueeBgColor="#000000"
            marqueeTextColor="#faf7f5"
            borderColor="#000000"
          />
        </div>
      </div>
    </motion.section>
  );
}
