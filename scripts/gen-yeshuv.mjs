import fs from "fs";
import https from "https";

const url = "https://raw.githubusercontent.com/barvhaim/remy-mcp/master/data/kod_yeshuv.py";

https.get(url, (res) => {
  let data = "";
  res.on("data", (c) => (data += c));
  res.on("end", () => {
    const map = {};
    for (const m of data.matchAll(/(\d+):\s*"([^"]+)"/g)) {
      map[Number(m[1])] = m[2];
    }
    const body = `export const YESHUV_BY_CODE: Record<number, string> = ${JSON.stringify(map, null, 2)};

export function yeshuvName(code: number): string | undefined {
  return YESHUV_BY_CODE[code];
}
`;
    fs.writeFileSync(new URL("../src/lib/yeshuv.ts", import.meta.url), body);
    console.log("wrote", Object.keys(map).length, "settlements");
  });
});
