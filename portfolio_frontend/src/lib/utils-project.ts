export type ProjectItem = {
  id: string;
  title: string;
  role: string;
  description: string;
  image: string;
  tech: string[];
  liveUrl?: string;
  codeUrl?: string;
  /** Gambar pendukung di halaman detail. Kosongkan kalau belum ada —
   *  section galerinya tidak dirender sama sekali. */
  gallery?: string[];
};

import archistruct from "../assets/project/Archistruct/Screenshot (59).png";
import archistruct1 from "../assets/project/Archistruct/Screenshot (67).png";
import archistruct2 from "../assets/project/Archistruct/Screenshot (68).png";
import archistruct3 from "../assets/project/Archistruct/Screenshot (69).png";
import archistruct4 from "../assets/project/Archistruct/Screenshot (61).png";
import article from "../assets/project/article.webp";
import visitCiremai from "../assets/project/VisitCiremai/Screenshot (73).png";
import visitCiremai1 from "../assets/project/VisitCiremai/Screenshot (74).png";
import visitCiremai2 from "../assets/project/VisitCiremai/Screenshot (76).png";
import visitCiremai3 from "../assets/project/VisitCiremai/Screenshot (77).png";
import visitCiremai4 from "../assets/project/VisitCiremai/Screenshot (78).png";
import visitCiremai5 from "../assets/project/VisitCiremai/Screenshot (79).png";
import burgerBangor from "../assets/project/burger-bangor.webp";
import dashboardKMP from "../assets/project/dashboard-kmp.webp";
import ecommerce from "../assets/project/e-commerce.webp";
import marketplace from "../assets/project/marketplace.webp";
import portalKoperasi from "../assets/project/portal-kmp.webp";
import portalKmp1 from "../assets/project/portalKMP/Capture.png";
import portalKmp2 from "../assets/project/portalKMP/Capture1.png";
import portalKmp3 from "../assets/project/portalKMP/Capture2.png";
import portalKmp4 from "../assets/project/portalKMP/Capture3.png";
import portalKmp5 from "../assets/project/portalKMP/Capture4.png";
import ruyukImg from "../assets/project/ruyuk.webp";
import ruyuk1 from "../assets/project/RuyukOutdoor/Capture.png";
import ruyuk2 from "../assets/project/RuyukOutdoor/Capture2.png";
import ruyuk3 from "../assets/project/RuyukOutdoor/Capture3.png";
import ruyuk4 from "../assets/project/RuyukOutdoor/Capture4.png";
import ruyuk5 from "../assets/project/RuyukOutdoor/Capture5.png";
import sispak from "../assets/project/sispak.webp";
import tkIslam from "../assets/project/tkislam.webp";
import travel from "../assets/project/travel.webp";

export const PROJECTS: ProjectItem[] = [
  {
    id: "ruyuk-outdoor",
    title: "Ruyuk Outdoor",
    role: "Client Project",
    description:
      "A company profile website for an outdoor gear rental service, showcasing equipment, pricing, and brand story. Users can check availability, book rentals, and continue their order via WhatsApp integration.",
    image: ruyukImg,
    tech: [
      "React",
      "TypeScript",
      "Vite",
      "TailwindCSS",
      "Framer Motion",
      "ShadCn",
    ],
    liveUrl: "https://ruyuk-outdoor.vercel.app/",
    codeUrl: "#",
    gallery: [ruyuk1, ruyuk2, ruyuk3, ruyuk4, ruyuk5],
  },
  {
    id: "archistruct",
    title: "Archistruct",
    role: "Client Project",
    description:
      "A company profile website for an architecture and construction firm in Jakarta, spanning four pages: home, services, portfolio, and about. The site presents architectural design, interior design, and construction work through a monochrome layout where large photography and Archivo Black display type carry the weight. Page transitions and scroll reveals keep the browsing calm rather than flashy, and every section is composed to let the projects themselves stay the focus.",
    image: archistruct,
    tech: [
      "React",
      "TypeScript",
      "Vite",
      "TailwindCSS",
      "React Router",
      "Framer Motion",
    ],
    liveUrl: "#",
    codeUrl: "#",
    gallery: [archistruct1, archistruct2, archistruct3, archistruct4],
  },
  {
    id: "visit-ciremai",
    title: "Visit Ciremai",
    role: "Client Project",
    description:
      "A redesign of the existing Visit Ciremai website into a full travel platform for the Mount Ciremai area, covering hiking packages, adventure trips, lodging, transport, and outdoor gear rental. Visitors browse and search packages, submit bookings, and leave testimonials; an admin dashboard behind cookie-based authentication handles package CRUD, image uploads, booking status, and testimonial moderation. Every configuration value lives in environment files rather than in the code, and the build refuses to run when a required one is missing.",
    image: visitCiremai,
    tech: [
      "React",
      "TypeScript",
      "Vite",
      "TailwindCSS",
      "Express.Js",
      "MySQL",
      "Zod",
      "JWT",
    ],
    liveUrl: "#",
    codeUrl: "#",
    gallery: [
      visitCiremai1,
      visitCiremai2,
      visitCiremai3,
      visitCiremai4,
      visitCiremai5,
    ],
  },
  {
    id: "marketplace",
    title: "Marketplace",
    role: "Exploration",
    description:
      "A modern marketplace interface exploring product listing, clean filtering, and grid-based layouts. Built to experiment with e-commerce UI patterns and smooth browsing flows on desktop and mobile.",
    image: marketplace,
    tech: ["React", "TypeScript", "Vite", "TailwindCSS"],
    liveUrl: "https://ahmad-corp-marketplace.netlify.app/",
    codeUrl: "#",
  },
  {
    id: "portal-kmp",
    title: "Portal Koperasi Kelurahan Merah Putih",
    role: "Client Project",
    description:
      "An information portal for the Merah Putih cooperative that aggregates news about the cooperative, local SMEs, and regional updates. Designed as a central hub where members can stay informed and connected to community activities.",
    image: portalKoperasi,
    tech: [
      "React",
      "Vite",
      "Express.Js",
      "Potly",
      "GSAP",
      "TailwindCSS",
      "ShadCn",
    ],
    liveUrl: "https://kmp.roemahprogram.com/",
    codeUrl: "#",
    gallery: [portalKmp1, portalKmp2, portalKmp3, portalKmp4, portalKmp5],
  },
  {
    id: "dashoard-KMP",
    title: "Dashboard Koperasi Merah Putih",
    role: "Freelance",
    description:
      "An admin dashboard for Koperasi Merah Putih that visualizes key metrics such as members, transactions, and financial performance. Charts and summaries help management monitor the cooperative’s health in real time.",
    image: dashboardKMP,
    tech: ["CodeIgniter 4", "TailwindCSS", "Chart.Js"],
    liveUrl: "https://app.roemahprogram.com/kmpcore/public/index.php/login",
    codeUrl: "#",
  },
  {
    id: "sistem-pakar",
    title: "Expert System for Pumpkin Plant Diseases",
    role: "Thesis Project",
    description:
      "A web-based expert system that diagnoses diseases in pumpkin plants using a forward chaining inference method. Farmers answer guided questions and receive probable diagnoses along with suggested treatments.",
    image: sispak,
    tech: ["HTML", "CSS", "Bootstrap 5", "PHP Native"],
    liveUrl: "https://sistem-pakar.free.nf",
    codeUrl: "#",
  },
  {
    id: "travel",
    title: "Travel Ticket Booking Form",
    role: "Training Project",
    description:
      "A final course project where users can explore travel packages, book hotels, and purchase travel tickets in one flow. The system guides users from package selection to checkout, including a dedicated payment step.",
    image: travel,
    tech: ["HTML", "CSS", "Bootstrap 5", "PHP Native"],
    liveUrl: "#",
    codeUrl: "#",
  },
  {
    id: "burger-bangor",
    title: "Online Ordering Website",
    role: "Client Project",
    description:
      "A QR-based ordering system where customers scan a barcode on the table to open the restaurant’s menu on their phone. Users can browse items, place orders, and continue through to payment without leaving their seat.",
    image: burgerBangor,
    tech: ["HTML", "CSS", "Bootstrap 5", "PHP Native"],
    liveUrl: "#",
    codeUrl: "#",
  },
  {
    id: "article",
    title: "Article Blog Website",
    role: "Exploring",
    description:
      "A simple article blog layout focused on readability, clear hierarchy, and responsive typography. Built to experiment with content-first design and a lightweight publishing experience.",
    image: article,
    tech: ["HTML", "CSS", "SCSS", "Bootstrap 5"],
    liveUrl: "https://article-web-ahmad.netlify.app/",
    codeUrl: "#",
  },
  {
    id: "tk-islam",
    title: "School Profile Website",
    role: "Client Project",
    description:
      "A profile website for an Islamic kindergarten that presents programs, facilities, and school activities. It helps parents quickly understand the school’s values, environment, and enrollment information.",
    image: tkIslam,
    tech: ["HTML", "CSS", "Bootstrap 5"],
    liveUrl: "https://tk-kb-islam-raihimpian.netlify.app/",
    codeUrl: "#",
  },
  {
    id: "e-commerce",
    title: "A Simple E-Commerce",
    role: "Exploring",
    description:
      "A basic e-commerce site with product listings, detail pages, and a simple cart workflow. Developed to practice the full flow of an online store from browsing to checkout.",
    image: ecommerce,
    tech: ["HTML", "CSS", "Bootstrap 5", "PHP Native"],
    liveUrl: "#",
    codeUrl: "#",
  },
];
