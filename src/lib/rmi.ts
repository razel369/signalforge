import { OPEN_TENDER_STATUSES, RMI_HEADERS } from "./constants";

export type TenderRecord = {
  MichrazID: number;
  MichrazName: string;
  KodMerchav: number;
  StatusMichraz: number;
  KodYeudMichraz: number;
  KodYeshuv: number;
  KodSugMichraz: number;
  PublishedChoveret: boolean;
  Mekuvan: boolean;
  YechidotDiur: number;
  Shchuna: string;
  PirsumDate: string;
  PtichaDate: string;
  SgiraDate: string;
  VaadaDate: string | null;
};

function isOpenTender(t: TenderRecord, now: number): boolean {
  if (!t.SgiraDate || !t.PtichaDate) return false;
  const close = new Date(t.SgiraDate).getTime();
  const open = new Date(t.PtichaDate).getTime();
  if (close <= now) return false;
  if (open > now) return false;
  return (OPEN_TENDER_STATUSES as readonly number[]).includes(t.StatusMichraz);
}

const RMI_ENDPOINT =
  "https://apps.land.gov.il/MichrazimSite/api/SearchApi/Search";

async function fetchRmiPage(pageIndex: number, pageSize: number): Promise<TenderRecord[]> {
  try {
    const res = await fetch(RMI_ENDPOINT, {
      method: "POST",
      headers: RMI_HEADERS,
      body: JSON.stringify({
        PageIndex: pageIndex,
        PageSize: pageSize,
        StatusMichraz: 1,
      }),
      next: { revalidate: 1800 },
    });
    if (!res.ok) return [];
    const data = (await res.json()) as TenderRecord[] | TenderRecord;
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

/**
 * Fetch the broadest realistic set of currently-open RMI tenders.
 *
 * - Tries PageSize=200 first. RMI caps PageSize at 100, so if it isn't taking
 *   the hint the response will simply come back the same size as a 100-page.
 * - If PageSize=200 returns ≤100 rows, falls back to fetching pages 1-3 of
 *   PageSize=100 in parallel and dedupes by MichrazID.
 */
export async function fetchActiveTenders(): Promise<TenderRecord[]> {
  const primary = await fetchRmiPage(1, 200);

  let combined: TenderRecord[];
  if (primary.length > 100) {
    combined = primary;
  } else {
    const pages = await Promise.all([
      fetchRmiPage(1, 100),
      fetchRmiPage(2, 100),
      fetchRmiPage(3, 100),
    ]);

    const byId = new Map<number, TenderRecord>();
    for (const page of pages) {
      for (const row of page) {
        if (!byId.has(row.MichrazID)) byId.set(row.MichrazID, row);
      }
    }
    combined = Array.from(byId.values());
  }

  const now = Date.now();

  return combined
    .filter((t) => isOpenTender(t, now))
    .sort(
      (a, b) =>
        new Date(a.SgiraDate).getTime() - new Date(b.SgiraDate).getTime(),
    );
}

export function tenderUrl(id: number): string {
  return `https://apps.land.gov.il/MichrazimSite/#/michraz/${id}`;
}
