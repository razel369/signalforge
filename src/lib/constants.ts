export const REGIONS: Record<number, string> = {
  1: "צפון",
  2: "מרכז",
  3: "דרום",
  4: "ירושלים",
  5: "יהודה ושומרון",
  6: "תל אביב והמרכז",
};

export const TENDER_PURPOSE: Record<number, string> = {
  1: "מגורים",
  2: "מסחר",
  3: "תעשייה",
  4: "משרדים",
  5: "תיירות",
  7: "תחבורה",
  8: "מלונאות ונופש",
  9: "חניה",
  10: "מבני ציבור",
  11: "חקלאות",
  12: "תשתיות",
  13: "אנרגיה",
  16: "שמורת טבע",
  18: "דיור להשכרה",
  20: "מגורים מוגבלים",
  23: "דיור מוגן",
  26: "מסחר ומגורים",
  99: "אחר",
};

/** RMI StatusMichraz: 1=פתוח להגשה, 2=פתוח (שלב מתקדם) */
export const OPEN_TENDER_STATUSES = [1, 2] as const;

export const DATA_GOV_HEADERS = {
  "User-Agent": "SignalForge/1.0 (B2B Intelligence; +https://signalforge.local)",
  Accept: "application/json",
};

export const RMI_HEADERS = {
  "Content-Type": "application/json",
  "User-Agent": "datagov-external-client",
  Origin: "https://apps.land.gov.il",
  Referer: "https://apps.land.gov.il/MichrazimSite/",
};
