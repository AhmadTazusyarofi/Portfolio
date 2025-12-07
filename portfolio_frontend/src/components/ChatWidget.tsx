import { MessageCircleMore, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const BACKEND_URL =
  import.meta.env.VITE_CHAT_API_URL ??
  "https://api-ahmad.tubsamy.tech/api/chat";

// Pengetahuan statis tentang Ahmad untuk membantu AI menjawab lebih akurat.
// Silakan EDIT teks ini kalau nanti kamu update isi portfolio (skill / project baru).
const PROFILE_KNOWLEDGE = `
==========================
INFORMASI INTI TENTANG AHMAD TAZUSYAROFI
==========================
Nama lengkap: Ahmad Tazusyarofi  
Nama panggilan: Ahmad / Rofi  
Peran: Creative Web Developer & Fullstack Developer  
Ciri khas: Fokus pada UI halus, animasi interaktif, visual modern, dan pengalaman pengguna yang playful namun fungsional.

Keahlian Utama:
- Frontend modern: HTML, CSS, JavaScript, React, Vue, TypeScript, Vite.
- Styling & UI: TailwindCSS, Bootstrap, SCSS, ShadCN UI.
- Animasi: Framer Motion, GSAP, Motion.
- Backend: Laravel, CodeIgniter 4, Express.js, PHP Native.
- Database & tools: Prisma, REST API.
- Eksplorasi kreatif: 3D Web (Three.js / React Three Fiber), efek visual, micro-interactions.

Gaya desain:
- Bersih, modern, interaktif.
- Mengutamakan pengalaman pengguna yang smooth.
- Suka bereksperimen dengan animasi, layout dinamis, dan elemen visual kreatif.

==========================
GAMBARAN PORTFOLIO WEBSITE
==========================
Bagian Hero:
- Menyambut user dan memperkenalkan Ahmad secara jelas sebagai web developer.

Bagian About:
- Menceritakan perjalanan Ahmad dalam dunia web development.
- Menekankan kecintaan pada desain, interaktivitas, dan meaningful digital experiences.
- Visi: membangun website yang visually appealing, intuitive, dan crafted with care.

Bagian Skills:
- Menampilkan tech stack yang dikuasai Ahmad (HTML, CSS, JS, React, Vue, Laravel, CodeIgniter, Tailwind, Bootstrap).

Bagian Projects:
- Showcase berbagai client project, exploration, dan project personal.
- Format project menampilkan: judul, peran, deskripsi singkat, tech stack, preview image, dan link live.

List project (ringkas):
1. Ruyuk Outdoor – Company profile rental outdoor (React + Tailwind + TS + Motion)
2. Goods Inventory Dashboard – Dashboard stok real-time (React + Express + Prisma)
3. Marketplace Exploration – UI marketplace modern
4. Portal Koperasi Merah Putih – Portal berita & info (React + Express)
5. Dashboard Koperasi MP – Dashboard admin (CodeIgniter)
6. Sistem Pakar Penyakit Labu – Expert system (PHP Native)
7. Travel Booking Form – Booking flow training project
8. QR Ordering Website – Sistem pemesanan restoran berbasis QR
9. Article Blog – Layout blog ringan & responsif
10. School Profile TK Islam – Profil sekolah
11. Simple E-Commerce – Alur belanja dasar

Semua project menampilkan fokus Ahmad pada:
- UI clean & modern  
- Workflow intuitif  
- Penggunaan teknologi yang efektif  
- Kerapian dan kualitas interaksi  

Bagian Certifications:
- Menampilkan grid sertifikasi (berbentuk bola 3D visual) sebagai bukti pembelajaran berkelanjutan.

Bagian Contact:
- Email: tazusyaroifahmad@gmail.com  
- Freelance: Open for collaboration  
- Sosial: Instagram, GitHub, LinkedIn  

==========================
PERILAKU CHATBOT
==========================
Tujuan chatbot:
- Menjawab pertanyaan tentang Ahmad, skillnya, proyeknya, proses kerja, teknologi yang ia kuasai, dan bagaimana ia membangun website.
- Membantu user memahami portfolio tanpa harus membaca seluruh halaman.
- Tetap santai tapi informatif.

Aturan bahasa:
- Ikuti bahasa user (Indonesia atau Inggris).
- Gunakan gaya sopan, profesional, santai, dan ramah — sesuai tone portfolio Ahmad.

Hal yang *boleh* chatbot lakukan:
- Menjelaskan proyek dan skill Ahmad secara detail.
- Memberikan insight tentang proses kerja, tools, tech stack, kenapa memilih teknologi tertentu.
- Memberikan penjelasan UI/UX dan filosofi desain Ahmad.
- Memberikan rekomendasi sesuai kebutuhan user berdasarkan kemampuan Ahmad.
- Menjawab pertanyaan terkait teknis, selama masih dalam ranah ilmu Ahmad.

Hal yang *tidak boleh* chatbot lakukan:
- Memberikan informasi pribadi sensitif (alamat rumah, nomor telepon, gaji, data pribadi, timeline detail pendidikan, dll.)
- Mengarang fakta tentang proyek, client, atau pengalaman yang tidak ada dalam knowledge base.
- Memberikan akses ke file internal atau rahasia.
- Berbohong mengenai skill yang Ahmad tidak miliki.

Jika user bertanya tentang info pribadi atau detail yang tidak tersedia:
- Jawab bahwa chatbot tidak memiliki data tersebut.
- Sarankan user menghubungi Ahmad via email atau sosial media.

==========================
JAWABAN UNTUK PERTANYAAN DI LUAR KNOWLEDGE BASE
==========================
Jika user menanyakan hal yang tidak ada di portfolio atau tidak disediakan Ahmad:
- Katakan bahwa informasi tidak tersedia.
- Jangan mengarang.
- Berikan opsi untuk mengontak Ahmad langsung.

Contoh respons:
- “Kayaknya info itu nggak ada di portfolio Ahmad.”
- “Untuk detail seperti itu, mending langsung hubungi Ahmad lewat email.”

==========================
TUJUAN AKHIR
==========================
Chatbot harus membantu:
- Menjelaskan keahlian Ahmad secara meyakinkan.
- Menjelaskan proyek dengan konteks yang jelas.
- Memberikan gambaran kualitas kerja dan cara berpikir Ahmad.
- Menggantikan peran Ahmad ketika user ingin tahu tentang skill, proses, atau portfolionya.
- Meningkatkan konversi kolaborasi / project baru.

==========================
`;
export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hi! Aku AI assistant Ahmad Tazusyarofi. Ada yang bisa aku bantu?",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const panelRef = useRef<HTMLDivElement | null>(null);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    if (isOpen && panelRef.current) {
      const el = panelRef.current;
      el.scrollTop = el.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const newMessage: ChatMessage = { role: "user", content: input.trim() };
    const nextMessages = [...messages, newMessage];
    setMessages(nextMessages);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch(BACKEND_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content:
                "You are an AI assistant for the portfolio website of Ahmad Tazusyarofi (a web developer). Your knowledge about Ahmad comes ONLY from this description and from what is visible on the website itself. Do NOT make up facts. If you do not know something, clearly say that you don't know and suggest the user to contact Ahmad via the contact section.",
            },
            {
              role: "system",
              content: PROFILE_KNOWLEDGE,
            },
            ...nextMessages,
          ],
        }),
      });

      if (!res.ok) {
        throw new Error(`Request failed with status ${res.status}`);
      }

      const data = (await res.json()) as { reply?: string };
      const reply =
        data.reply ?? "Maaf, terjadi kesalahan saat memproses pesanmu.";

      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (error) {
      console.error("Chat request error", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Maaf, aku tidak bisa terhubung ke server sekarang. Coba lagi beberapa saat lagi.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      className="flex flex-col items-end gap-3"
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 999999,
        pointerEvents: "auto",
      }}
    >
      {isOpen && (
        <div
          ref={panelRef}
          className="w-80 max-w-[90vw] rounded-2xl border border-slate-700/70 bg-slate-900/95 shadow-2xl backdrop-blur-lg text-sm text-slate-100"
          style={{
            pointerEvents: "auto",
            maxHeight: 360,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            className="flex items-center justify-between px-4 py-2.5 border-b border-slate-700/70 bg-slate-900 flex-none"
            style={{
              position: "sticky",
              top: 0,
              zIndex: 1,
              pointerEvents: "auto",
            }}
          >
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-white">
                Assistant AI
              </p>
            </div>
            <button
              type="button"
              onClick={handleToggle}
              style={{ pointerEvents: "auto" }}
              className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-800 text-slate-200 hover:bg-slate-700"
              aria-label="Close chat"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="px-3 py-2 pb-4 space-y-2 flex-1">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3 py-2 text-xs leading-relaxed whitespace-pre-wrap
                  ${
                    msg.role === "user"
                      ? "bg-[#5227ff] text-white rounded-br-sm"
                      : "bg-slate-800/90 text-slate-100 rounded-bl-sm"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="inline-flex items-center gap-2 rounded-2xl bg-slate-800/90 px-3 py-2 text-[11px] text-slate-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Mengetik...</span>
                </div>
              </div>
            )}
          </div>

          <div
            className="border-t border-slate-700/70 bg-slate-900/90 px-3 py-2 flex items-center gap-2 flex-none"
            style={{
              pointerEvents: "auto",
              position: "sticky",
              bottom: 0,
              zIndex: 1,
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Tanyakan apa saja..."
              style={{ pointerEvents: "auto" }}
              className="flex-1 rounded-full bg-slate-800/80 px-3 py-1.5 text-xs text-slate-100 placeholder:text-slate-500 outline-none border border-transparent focus:border-[#5227ff]"
            />
            <button
              type="button"
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="inline-flex items-center justify-center rounded-full bg-[#5227ff] px-3 py-1.5 text-[11px] font-semibold text-white shadow-md shadow-[#5227ff]/40 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Kirim
            </button>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => {
          console.log("chat bubble clicked");
          handleToggle();
        }}
        style={{ pointerEvents: "auto" }}
        className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#5227ff] text-white shadow-lg shadow-[#5227ff]/50 hover:shadow-[#5227ff]/70 hover:-translate-y-0.5 transition-transform"
        aria-label="Open chat"
      >
        <MessageCircleMore className="h-6 w-6" />
      </button>
    </div>
  );
}
