import {
  ArrowUpRight,
  Github,
  Instagram,
  Linkedin,
  Twitter,
} from "lucide-react";
import { motion } from "motion/react";

const CONTACT_EMAIL = "tazusyaroffiahmad@gmail.com";

const SOCIALS = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/ahmdrr_/",
    Icon: Instagram,
  },
  { label: "Twitter", href: "https://twitter.com", Icon: Twitter },
  {
    label: "GitHub",
    href: "https://github.com/AhmadTazusyarofi",
    Icon: Github,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/ahmad-tazusyarofi-92b1a0341/",
    Icon: Linkedin,
  },
];

export default function Contact() {
  const mailtoHref = `mailto:${CONTACT_EMAIL}?subject=Project%20Inquiry&body=Hi%20Ahmad%2C%0D%0A`;

  return (
    <motion.section
      id="contact"
      className="relative px-6 py-20 md:px-10 md:py-28"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.25 }}
    >
      <div className="mx-auto max-w-4xl">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-secondary">
          Get in touch
        </p>

        <h2 className="font-display mt-4 text-3xl md:text-5xl lg:text-6xl text-secondary">
          Let&rsquo;s work on something cool together.
        </h2>

        <p className="mt-6 max-w-2xl text-sm md:text-lg text-secondary">
          I&rsquo;m a web developer focused on smooth, playful interfaces and
          clean user experiences. If you have an idea or a product in mind,
          I&rsquo;d love to help you turn it into something real on the web.
        </p>

        <dl className="mt-12 grid gap-8 border-t border-secondary pt-8 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary opacity-60">
              Availability
            </dt>
            <dd className="mt-2 text-sm text-secondary">
              Open for freelance &amp; collaboration projects.
            </dd>
          </div>

          <div>
            <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary opacity-60">
              Email
            </dt>
            <dd className="mt-2">
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-sm text-secondary underline underline-offset-4"
              >
                {CONTACT_EMAIL}
              </a>
            </dd>
          </div>
        </dl>

        <div className="mt-12 flex flex-col gap-8 border-t border-secondary pt-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary opacity-60">
              Social
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {SOCIALS.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-secondary px-3 py-1.5 text-xs font-medium uppercase tracking-wide text-secondary transition-colors hover:bg-secondary hover:text-background"
                >
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                </a>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <a
              href={mailtoHref}
              className="inline-flex items-center justify-center rounded-full bg-secondary px-6 py-3 text-sm font-semibold uppercase tracking-wide text-background transition-transform duration-200 hover:-translate-y-0.5"
            >
              Say hello
            </a>

            <a
              href="/CV/CV ATS - AHMAD TAZUSYAROFI.pdf"
              download="Ahmad-Tazusyarofi-CV.pdf"
              className="inline-flex items-center justify-center rounded-full border border-secondary px-5 py-3 text-sm font-semibold uppercase tracking-wide text-secondary transition-colors hover:bg-secondary hover:text-background"
            >
              Download CV
              <ArrowUpRight className="ml-1.5 h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
