import * as geoip from 'geoip-lite';

export interface GeoLocation {
  country?: string;
  countryCode?: string;
  city?: string;
  region?: string;
}

export function getIpLocation(ip: string): GeoLocation | null {
  try {
    const result = geoip.lookup(ip);
    if (!result) return null;

    return {
      country: result.country,
      countryCode: result.country,
      city: result.city,
      region: result.region,
    };
  } catch (error) {
    return null;
  }
}
