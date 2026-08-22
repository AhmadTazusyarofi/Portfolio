import { ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";

import { useHashNav } from "@/lib/useHashNav";

const CONTACT_EMAIL = "tazusyaroffiahmad@gmail.com";

/* Href absolut ("/#about"), bukan hash telanjang: dari /work dan /work/:slug,
   "#about" hanya menempel di URL saat ini dan tidak membawa ke mana pun. */
const NAVIGATE = [
  { label: "About", href: "/#about" },
  { label: "Projects", href: "/#projects" },
  { label: "Contact", href: "/#contact" },
];

function jakartaTime() {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Jakarta",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date());
}

export default function Footer() {
  const handleNavClick = useHashNav();
  const [time, setTime] = useState(jakartaTime);

  useEffect(() => {
    const id = window.setInterval(() => setTime(jakartaTime()), 30_000);
    return () => window.clearInterval(id);
  }, []);

  const year = new Date().getFullYear();

  return (
    <footer className="bg-secondary px-6 pb-10 pt-20 text-background md:px-10 md:pt-28">
      <div className="mx-auto max-w-7xl">
        <p className="text-xs font-semibold uppercase tracking-[0.45em] text-background opacity-60">
          Open for freelance — {year}
        </p>

        <div className="mt-6 grid gap-12 md:grid-cols-[minmax(0,1fr)_auto] md:items-start md:gap-16">
          <div>
            <h2 className="font-display max-w-3xl text-4xl leading-[1.05] text-background sm:text-5xl md:text-6xl lg:text-7xl">
              Still here? Let&rsquo;s talk.
            </h2>

            <div className="mt-10 flex flex-wrap gap-3">
              <a
                href={`mailto:${CONTACT_EMAIL}?subject=Project%20Inquiry&body=Hi%20Ahmad%2C%0D%0A`}
                className="inline-flex items-center gap-2 rounded-full bg-background px-6 py-3 text-sm font-semibold uppercase tracking-wide text-secondary transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-background"
              >
                Email me
                <ArrowUpRight className="h-4 w-4" />
              </a>

              <a
                href="/CV/CV ATS - AHMAD TAZUSYAROFI.pdf"
                download="Ahmad-Tazusyarofi-CV.pdf"
                className="inline-flex items-center gap-2 rounded-full border border-background/40 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-background transition-colors duration-200 hover:border-background hover:bg-background hover:text-secondary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-background"
              >
                Download CV
              </a>
            </div>
          </div>

          <nav
            aria-label="Footer"
            className="md:justify-self-end md:text-right"
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-background opacity-50">
              Navigate
            </p>
            <ul className="mt-4 space-y-2">
              {NAVIGATE.map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    onClick={(e) => handleNavClick(href, e)}
                    className="text-sm text-background underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-background"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-16 flex flex-col gap-2 border-t border-background/20 pt-6 text-xs uppercase tracking-[0.2em] text-background opacity-50 sm:flex-row sm:items-center sm:justify-between md:mt-20">
          <p>© {year} Ahmad Tazusyarofi</p>
          <p className="tabular-nums">Jakarta — {time} WIB</p>
        </div>
      </div>
    </footer>
  );
}
