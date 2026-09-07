/**
 * Curated ticker/name → website map for companies whose legal name doesn't
 * cleanly resolve to their domain. Keeps logo coverage high for well-known
 * brands without needing a paid data source.
 *
 * Format: keys are UPPERCASE tickers OR lowercased legal-name substrings.
 * The lookup is: exact ticker match → any name substring match → null.
 */

const TICKER_TO_DOMAIN: Record<string, string> = {
  // Mega-cap tech
  AAPL: "apple.com",
  MSFT: "microsoft.com",
  GOOGL: "google.com",
  GOOG: "google.com",
  AMZN: "amazon.com",
  META: "meta.com",
  NVDA: "nvidia.com",
  TSLA: "tesla.com",
  // Berkshire, big banks, big pharma
  "BRK.A": "berkshirehathaway.com",
  "BRK.B": "berkshirehathaway.com",
  JPM: "jpmorganchase.com",
  BAC: "bankofamerica.com",
  WFC: "wellsfargo.com",
  GS: "goldmansachs.com",
  MS: "morganstanley.com",
  C: "citigroup.com",
  V: "visa.com",
  MA: "mastercard.com",
  AXP: "americanexpress.com",
  PYPL: "paypal.com",
  BLK: "blackrock.com",
  SCHW: "schwab.com",
  // Retail / consumer
  WMT: "walmart.com",
  COST: "costco.com",
  HD: "homedepot.com",
  LOW: "lowes.com",
  TGT: "target.com",
  KO: "coca-cola.com",
  PEP: "pepsico.com",
  MCD: "mcdonalds.com",
  SBUX: "starbucks.com",
  NKE: "nike.com",
  DIS: "disney.com",
  ABNB: "airbnb.com",
  UBER: "uber.com",
  LYFT: "lyft.com",
  SPOT: "spotify.com",
  NFLX: "netflix.com",
  // Health
  JNJ: "jnj.com",
  UNH: "unitedhealthgroup.com",
  PFE: "pfizer.com",
  LLY: "lilly.com",
  MRK: "merck.com",
  ABBV: "abbvie.com",
  ABT: "abbott.com",
  CVS: "cvshealth.com",
  // Energy / industrials
  XOM: "exxonmobil.com",
  CVX: "chevron.com",
  BA: "boeing.com",
  GE: "ge.com",
  GM: "gm.com",
  F: "ford.com",
  CAT: "caterpillar.com",
  // Telecom / media
  T: "att.com",
  VZ: "verizon.com",
  CMCSA: "comcast.com",
  TMUS: "t-mobile.com",
  // Enterprise software
  ORCL: "oracle.com",
  CRM: "salesforce.com",
  ADBE: "adobe.com",
  IBM: "ibm.com",
  CSCO: "cisco.com",
  INTC: "intel.com",
  AMD: "amd.com",
  QCOM: "qualcomm.com",
  TXN: "ti.com",
  AVGO: "broadcom.com",
  NOW: "servicenow.com",
  SNOW: "snowflake.com",
  DDOG: "datadoghq.com",
  SHOP: "shopify.com",
  SQ: "block.xyz",
  // P&G
  PG: "pg.com",
};

/** Case-sensitive keys are already lowercase; matched by substring. */
const NAME_TO_DOMAIN: Array<[string, string]> = [
  ["alphabet", "google.com"],
  ["meta platforms", "meta.com"],
  ["berkshire hathaway", "berkshirehathaway.com"],
  ["johnson & johnson", "jnj.com"],
  ["procter & gamble", "pg.com"],
  ["exxon mobil", "exxonmobil.com"],
  ["jpmorgan", "jpmorganchase.com"],
  ["bank of america", "bankofamerica.com"],
  ["wells fargo", "wellsfargo.com"],
  ["goldman sachs", "goldmansachs.com"],
  ["morgan stanley", "morganstanley.com"],
  ["walt disney", "disney.com"],
  ["home depot", "homedepot.com"],
  ["coca-cola", "coca-cola.com"],
  ["coca cola", "coca-cola.com"],
  ["general motors", "gm.com"],
  ["general electric", "ge.com"],
  ["international business machines", "ibm.com"],
  ["advanced micro devices", "amd.com"],
  ["unitedhealth", "unitedhealthgroup.com"],
  ["verizon", "verizon.com"],
  ["at&t", "att.com"],
  ["eli lilly", "lilly.com"],
  ["salesforce", "salesforce.com"],
  ["snowflake", "snowflake.com"],
  ["datadog", "datadoghq.com"],
  ["shopify", "shopify.com"],
  ["stripe", "stripe.com"],
  ["airbnb", "airbnb.com"],
];

export function domainFor({
  ticker,
  name,
}: {
  ticker?: string | null;
  name?: string | null;
}): string | null {
  if (ticker) {
    const hit = TICKER_TO_DOMAIN[ticker.toUpperCase()];
    if (hit) return hit;
  }
  if (name) {
    const low = name.toLowerCase();
    for (const [needle, domain] of NAME_TO_DOMAIN) {
      if (low.includes(needle)) return domain;
    }
  }
  return null;
}
