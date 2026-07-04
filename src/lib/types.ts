export type SignalType = "tender" | "company";

export type Signal = {
  id: string;
  type: SignalType;
  title: string;
  subtitle: string;
  score: number;
  urgency: "critical" | "high" | "medium" | "low";
  region: string;
  city: string;
  zone: string;
  actionUrl: string;
  meta: Record<string, string | number | boolean | null>;
  fetchedAt: string;
};

export type SignalBundle = {
  signals: Signal[];
  stats: {
    tenders: number;
    companies: number;
    avgScore: number;
    lastSync: string | null;
  };
};
