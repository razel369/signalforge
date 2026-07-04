import { TENDER_PURPOSE } from "./constants";
import type { CompanyRecord } from "./datagov";
import { cityToZone } from "./regions";
import type { TenderRecord } from "./rmi";
import type { Signal } from "./types";
import { yeshuvName } from "./yeshuv";

function urgencyFromDays(days: number): Signal["urgency"] {
  if (days <= 14) return "critical";
  if (days <= 30) return "high";
  if (days <= 90) return "medium";
  return "low";
}

function resolveTenderCity(t: TenderRecord): string {
  const fromCode = yeshuvName(t.KodYeshuv);
  if (fromCode) return fromCode;
  const hood = t.Shchuna?.trim();
  if (hood) return hood;
  return "ישראל";
}

export function scoreTender(t: TenderRecord): Signal {
  const close = new Date(t.SgiraDate);
  const daysLeft = Math.ceil((close.getTime() - Date.now()) / 86_400_000);
  const city = resolveTenderCity(t);
  const zone = cityToZone(city);
  const purpose = TENDER_PURPOSE[t.KodYeudMichraz] ?? "מכרז קרקע";

  let score = 20;

  if (daysLeft <= 7) score += 40;
  else if (daysLeft <= 14) score += 35;
  else if (daysLeft <= 30) score += 28;
  else if (daysLeft <= 60) score += 18;
  else if (daysLeft <= 120) score += 8;
  else score -= 10;

  if (t.YechidotDiur >= 100) score += 18;
  else if (t.YechidotDiur >= 50) score += 14;
  else if (t.YechidotDiur >= 10) score += 8;

  if (t.PublishedChoveret) score += 8;
  if (t.Mekuvan) score += 4;
  if (t.StatusMichraz === 1) score += 5;

  const hood = t.Shchuna?.trim();
  const subtitle = hood ? `${purpose} · ${city} · ${hood}` : `${purpose} · ${city}`;

  return {
    id: `tender-${t.MichrazID}`,
    type: "tender",
    title: `רמ״י ${t.MichrazName} · ${purpose}`,
    subtitle,
    score: Math.min(Math.max(score, 1), 99),
    urgency: urgencyFromDays(daysLeft),
    region: zone,
    city,
    zone,
    actionUrl: `https://apps.land.gov.il/MichrazimSite/#/michraz/${t.MichrazID}`,
    meta: {
      daysLeft,
      housingUnits: t.YechidotDiur,
      openDate: t.PtichaDate,
      closeDate: t.SgiraDate,
      publishedBooklet: t.PublishedChoveret,
      status: t.StatusMichraz,
      kodYeshuv: t.KodYeshuv,
    },
    fetchedAt: new Date().toISOString(),
  };
}

export function scoreCompany(c: CompanyRecord): Signal {
  let score = 25;
  const year = new Date().getFullYear();
  const incorporated = c["תאריך התאגדות"] ?? "";
  const city = c["שם עיר"]?.trim() || "לא ידוע";
  const zone = cityToZone(city);
  const companyNo = c["מספר חברה"];

  if (incorporated.includes(String(year))) score += 35;
  else if (incorporated.includes(String(year - 1))) score += 12;
  else score -= 15;

  if (city !== "לא ידוע") score += 8;
  if (c["שם רחוב"]?.trim()) score += 5;
  if (c["שנה אחרונה של דוח שנתי (שהוגש)"] === year) score += 10;

  return {
    id: `company-${companyNo}`,
    type: "company",
    title: c["שם חברה"],
    subtitle: `חברה חדשה · ${city} · מס׳ ${companyNo}`,
    score: Math.min(Math.max(score, 1), 99),
    urgency: incorporated.includes(String(year)) ? "high" : "medium",
    region: zone,
    city,
    zone,
    actionUrl: `https://www.gov.il/he/departments/ica`,
    meta: {
      companyNumber: companyNo,
      incorporated,
      city,
      lastAnnualReport: c["שנה אחרונה של דוח שנתי (שהוגש)"],
      purpose: c["מטרת החברה"] ?? "",
    },
    fetchedAt: new Date().toISOString(),
  };
}

export function rankSignals(signals: Signal[]): Signal[] {
  return [...signals].sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    const aDays = Number(a.meta.daysLeft ?? 999);
    const bDays = Number(b.meta.daysLeft ?? 999);
    return aDays - bDays;
  });
}
