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

export async function fetchActiveTenders(): Promise<TenderRecord[]> {
  const res = await fetch(
    "https://apps.land.gov.il/MichrazimSite/api/SearchApi/Search",
    {
      method: "POST",
      headers: RMI_HEADERS,
      body: JSON.stringify({ PageIndex: 1, PageSize: 100, StatusMichraz: 1 }),
      cache: "no-store",
    },
  );

  if (!res.ok) {
    throw new Error(`RMI API ${res.status}`);
  }

  const rows = (await res.json()) as TenderRecord[];
  const now = Date.now();

  return rows
    .filter((t) => isOpenTender(t, now))
    .sort(
      (a, b) =>
        new Date(a.SgiraDate).getTime() - new Date(b.SgiraDate).getTime(),
    );
}

export function tenderUrl(id: number): string {
  return `https://apps.land.gov.il/MichrazimSite/#/michraz/${id}`;
}
