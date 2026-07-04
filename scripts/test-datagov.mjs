const COMPANIES_RESOURCE = "f004176c-b85f-4542-8901-7b3176f9a054";

const headers = {
  "User-Agent": "SignalForge/1.0 (B2B Intelligence; +https://signalforge.local)",
  Accept: "application/json",
};

async function test(name, url) {
  const res = await fetch(url, { headers });
  console.log(name, res.status);
  if (res.ok) {
    const j = await res.json();
    console.log("  records", j.result?.records?.length ?? j.result?.total);
  }
}

const filters = encodeURIComponent(JSON.stringify({ "סטטוס חברה": "פעילה" }));
await test(
  "search",
  `https://data.gov.il/api/3/action/datastore_search?resource_id=${COMPANIES_RESOURCE}&limit=3&filters=${filters}`,
);

const year = new Date().getFullYear();
const sql = `SELECT "שם חברה", "מספר חברה" FROM "${COMPANIES_RESOURCE}" WHERE "סטטוס חברה" = 'פעילה' LIMIT 3`;
await test(
  "sql",
  `https://data.gov.il/api/3/action/datastore_search_sql?sql=${encodeURIComponent(sql)}`,
);
