export interface Link {
  id: number;
  code: string;
  original_url: string;
  created_at: string;
}

export interface Click {
  id: number;
  link_id: number;
  clicked_at: string;
  country: string | null;
  city: string | null;
  region: string | null;
  device_type: string | null;
  browser: string | null;
  os: string | null;
  referrer: string | null;
  ip: string | null;
}

export interface AnalyticsResponse {
  link: Omit<Link, "id">;
  total_clicks: number;
  clicks_over_time: { date: string; clicks: number }[];
  countries: { country: string; clicks: number }[];
  browsers: { browser: string; clicks: number }[];
  os: { os: string; clicks: number }[];
  devices: { device_type: string; clicks: number }[];
  referrers: { referrer: string; clicks: number }[];
  recent_clicks: RecentClick[];
}

export interface RecentClick {
  clicked_at: string;
  country: string | null;
  city: string | null;
  browser: string | null;
  os: string | null;
  device_type: string | null;
  referrer: string | null;
}
