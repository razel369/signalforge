export type CityPage = {
  slug: string;
  name: string;
  region: string;
  keywords: string[];
};

export type NichePage = {
  slug: string;
  name: string;
  description: string;
  keywords: string[];
};

export const CITY_PAGES: CityPage[] = [
  { slug: "tel-aviv", name: "תל אביב", region: "תל אביב והמרכז", keywords: ["מכרזים תל אביב", "מכרזים עיריית תל אביב"] },
  { slug: "haifa", name: "חיפה", region: "צפון", keywords: ["מכרזים חיפה", "מכרזים עיריית חיפה"] },
  { slug: "jerusalem", name: "ירושלים", region: "ירושלים", keywords: ["מכרזים ירושלים", "מכרזים עיריית ירושלים"] },
  { slug: "beer-sheva", name: "באר שבע", region: "דרום", keywords: ["מכרזים באר שבע", "מכרזים עיריית באר שבע"] },
  { slug: "rishon-lezion", name: "ראשון לציון", region: "מרכז", keywords: ["מכרזים ראשון לציון"] },
  { slug: "petah-tikva", name: "פתח תקווה", region: "מרכז", keywords: ["מכרזים פתח תקווה"] },
  { slug: "netanya", name: "נתניה", region: "מרכז", keywords: ["מכרזים נתניה"] },
  { slug: "ashdod", name: "אשדוד", region: "דרום", keywords: ["מכרזים אשדוד"] },
  { slug: "herzliya", name: "הרצליה", region: "מרכז", keywords: ["מכרזים הרצליה"] },
  { slug: "holon", name: "חולון", region: "מרכז", keywords: ["מכרזים חולון"] },
  { slug: "ramat-gan", name: "רמת גן", region: "מרכז", keywords: ["מכרזים רמת גן"] },
  { slug: "modiin", name: "מודיעין", region: "מרכז", keywords: ["מכרזים מודיעין"] },
  { slug: "kfar-saba", name: "כפר סבא", region: "מרכז", keywords: ["מכרזים כפר סבא"] },
  { slug: "raanana", name: "רעננה", region: "מרכז", keywords: ["מכרזים רעננה"] },
  { slug: "ashkelon", name: "אשקלון", region: "דרום", keywords: ["מכרזים אשקלון"] },
];

export const NICHE_PAGES: NichePage[] = [
  {
    slug: "nikayon",
    name: "מכרזי ניקיון",
    description: "מכרזי ניקיון ואחזקה מרשויות מקומיות וממשלתיות — סינון חכם והתראות לפני סגירה.",
    keywords: ["מכרז ניקיון", "מכרזי ניקיון עירייה"],
  },
  {
    slug: "bituach",
    name: "מכרזי ביטוח",
    description: "מכרזי ביטוח ופנסיה מגופים ציבוריים — עקוב אחרי הזדמנויות חדשות.",
    keywords: ["מכרז ביטוח", "מכרזי ביטוח ממשלתיים"],
  },
  {
    slug: "mishari",
    name: "מכרזי מקרקעין",
    description: "מכרזי קרקע ודיור מרמ״י — דירוג לפי יחידות דיור, אזור ודחיפות.",
    keywords: ["מכרזי מקרקעין", "מכרזים ממשלתיים"],
  },
  {
    slug: "bniya",
    name: "מכרזי בנייה",
    description: "מכרזי בנייה וקבלנות — סיגנלים מדורגים לקבלנים וספקי B2B.",
    keywords: ["מכרזי בנייה", "מכרז בנייה עירייה"],
  },
  {
    slug: "rechesh",
    name: "מכרזי רכש",
    description: "מכרזי רכש ממשלתיים ועירוניים — התאמה לספקים ויועצי מכרזים.",
    keywords: ["מכרזי רכש", "מכרז רכש ממשלתי"],
  },
];

export function getCityBySlug(slug: string): CityPage | undefined {
  return CITY_PAGES.find((c) => c.slug === slug);
}

export function getNicheBySlug(slug: string): NichePage | undefined {
  return NICHE_PAGES.find((n) => n.slug === slug);
}

export function cityMatchesText(city: CityPage, text: string): boolean {
  const hay = text.toLowerCase();
  return (
    hay.includes(city.name) ||
    hay.includes(city.region.toLowerCase()) ||
    city.keywords.some((k) => hay.includes(k.replace("מכרזים ", "").replace("מכרז ", "")))
  );
}
