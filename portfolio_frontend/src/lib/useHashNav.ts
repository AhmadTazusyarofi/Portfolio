import type { MouseEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { scrollToHash, scrollToTop } from "./useSmoothScroll";

/**
 * Handler klik untuk tautan menu berbentuk "/#about".
 *
 * Href tetap ditulis absolut supaya elemennya jadi tautan sungguhan — bisa
 * dibuka di tab baru dan tujuannya terlihat di status bar. Yang diambil alih
 * hanya klik biasa:
 *
 * - sudah di halaman tujuan  -> cukup gulir ke section-nya
 * - di halaman lain          -> pindah lewat router, tanpa memuat ulang
 *
 * Hash telanjang ("#about") tidak dipakai karena dari /work ia hanya menempel
 * di URL saat ini dan tidak membawa ke mana pun.
 */
export function useHashNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (href: string, event: MouseEvent<HTMLAnchorElement>) => {
    // Biarkan browser menangani klik tengah / ctrl-klik (buka di tab baru).
    if (event.defaultPrevented || event.metaKey || event.ctrlKey) return;

    const [rawPath, hash] = href.split("#");
    const path = rawPath || "/";

    event.preventDefault();

    if (location.pathname === path) {
      if (hash) scrollToHash(hash);
      else scrollToTop();
      return;
    }

    navigate(hash ? { pathname: path, hash: `#${hash}` } : path);
  };
}
