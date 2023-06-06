import { LatLng } from "react-native-maps"

export function distanceBetweenCoordinates(latLng1: LatLng, latLng2: LatLng) {
  const R = 6371 // km
  const dLat = toRad(latLng2.latitude - latLng1.latitude)
  const dLon = toRad(latLng2.longitude - latLng1.longitude)
  const lat1Rad = toRad(latLng1.latitude)
  const lat2Rad = toRad(latLng2.latitude)

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1Rad) * Math.cos(lat2Rad)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const d = R * c
  return d
}

function sqr(x) {
  return x * x
}
function dist2(v, w) {
  return sqr(v.x - w.x) + sqr(v.y - w.y)
}
function distToSegmentSquared(p, v, w) {
  const l2 = dist2(v, w)
  if (l2 === 0) return dist2(p, v)
  let t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2
  t = Math.max(0, Math.min(1, t))
  return dist2(p, { x: v.x + t * (w.x - v.x), y: v.y + t * (w.y - v.y) })
}

// Using latitude and longitude as x and y is a gross approximation, but it's good enough for our purposes.
export function distanceToSegment(point: LatLng, latLng1: LatLng, latLng2: LatLng) {
  return Math.sqrt(
    distToSegmentSquared(
      { x: point.longitude, y: point.latitude },
      { x: latLng1.longitude, y: latLng1.latitude },
      { x: latLng2.longitude, y: latLng2.latitude },
    ),
  )
}

// Converts numeric degrees to radians
function toRad(Value: number) {
  return (Value * Math.PI) / 180
}
