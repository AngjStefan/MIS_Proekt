export function getDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  // Returns distance in meters using Haversine formula
  const earthRadiusMeters = 6371e3;
  const toRadians = Math.PI / 180;

  const lat1Rad = lat1 * toRadians;
  const lat2Rad = lat2 * toRadians;
  const deltaLat = (lat2 - lat1) * toRadians;
  const deltaLon = (lon2 - lon1) * toRadians;

  const a = Math.sin(deltaLat / 2) ** 2 +
            Math.cos(lat1Rad) * Math.cos(lat2Rad) *
            Math.sin(deltaLon / 2) ** 2;
  
  const c = 2 * Math.asin(Math.sqrt(a));

  return earthRadiusMeters * c;
}
