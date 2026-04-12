import geoip from "geoip-lite";

export interface GeoResult {
  country: string | null;
  city: string | null;
  region: string | null;
}

export function geoLookup(ip: string): GeoResult {
  const geo = geoip.lookup(ip);
  if (!geo) {
    return { country: null, city: null, region: null };
  }
  return {
    country: geo.country || null,
    city: geo.city || null,
    region: geo.region || null,
  };
}
