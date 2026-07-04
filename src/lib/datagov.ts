import { DATA_GOV_HEADERS } from "./constants";

const COMPANIES_RESOURCE = "f004176c-b85f-4542-8901-7b3176f9a054";

export type CompanyRecord = {
  "מספר חברה": number;
  "שם חברה": string;
  "סטטוס חברה": string;
  "תאריך התאגדות": string;
  "שם עיר": string;
  "שם רחוב": string;
  "מספר בית": string;
  "שנה אחרונה של דוח שנתי (שהוגש)": number | null;
  "מטרת החברה": string;
};

type SearchResult = {
  result: { records: CompanyRecord[] };
};

async function dataGovFetch<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(path, {
      headers: DATA_GOV_HEADERS,
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

function isRecentIncorporation(dateStr: string, year: number): boolean {
  if (!dateStr) return false;
  return dateStr.includes(String(year)) || dateStr.includes(String(year - 1));
}

/** Recent companies via datastore_search (SQL endpoint returns 403). */
export async function fetchRecentCompanies(limit = 25): Promise<CompanyRecord[]> {
  const year = new Date().getFullYear();
  const filters = encodeURIComponent(JSON.stringify({ "סטטוס חברה": "פעילה" }));
  const sort = encodeURIComponent("תאריך התאגדות desc");
  const fetchLimit = Math.min(limit * 4, 120);

  const url = `https://data.gov.il/api/3/action/datastore_search?resource_id=${COMPANIES_RESOURCE}&limit=${fetchLimit}&filters=${filters}&sort=${sort}`;
  const data = await dataGovFetch<SearchResult>(url);

  if (data?.result?.records?.length) {
    const recent = data.result.records.filter((c) =>
      isRecentIncorporation(c["תאריך התאגדות"] ?? "", year),
    );
    if (recent.length > 0) return recent.slice(0, limit);
    return data.result.records.slice(0, limit);
  }

  return fetchActiveCompaniesSample(limit);
}

export async function fetchActiveCompaniesSample(limit = 15): Promise<CompanyRecord[]> {
  const filters = encodeURIComponent(JSON.stringify({ "סטטוס חברה": "פעילה" }));
  const sort = encodeURIComponent("תאריך התאגדות desc");
  const url = `https://data.gov.il/api/3/action/datastore_search?resource_id=${COMPANIES_RESOURCE}&limit=${limit}&filters=${filters}&sort=${sort}`;
  const data = await dataGovFetch<SearchResult>(url);
  return data?.result?.records ?? [];
}