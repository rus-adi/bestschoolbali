import { slugify } from "./slug";

export function bannerForAreaName(area: string): string {
  const a = (area || "").toLowerCase();

  const ubud = ["ubud", "gianyar", "tabanan", "payangan", "tegalalang", "abiansemal"];
  const canggu = [
    "canggu",
    "umalas",
    "kerobokan",
    "sembung",
    "berawa",
    "pererenan",
    "kedungu",
    "semenyak",
    "seminyak",
    "mengwi",
    "seseh",
  ];
  const sanur = ["sanur", "denpasar", "renon", "kuta"];
  const bukit = ["uluwatu", "jimbaran", "nusa dua", "pecatu", "bingin", "bukit"];

  const has = (list: string[]) => list.some((k) => a.includes(k));
  if (has(ubud)) return "/img/banners/ubud.webp";
  if (has(canggu)) return "/img/banners/canggu.webp";
  if (has(sanur)) return "/img/banners/sanur.webp";
  if (has(bukit)) return "/img/banners/bukit.webp";
  return "/img/banners/hero.webp";
}

export function areaCardImage(area: string): string {
  const slug = slugify(area);
  const supported = new Set([
    "amed",
    "bukit-region",
    "canggu",
    "canggu-sanur",
    "denpasar",
    "sanur",
    "ubud",
  ]);
  return supported.has(slug) ? `/img/areas/${slug}.webp` : bannerForAreaName(area);
}
