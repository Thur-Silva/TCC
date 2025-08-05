import { Coordenada, Ride, UserInput } from '@/types/types'

const EARTH_RADIUS_KM = 6371

export function haversineDistance(pontoA: Coordenada, pontoB: Coordenada): number {
  const toRad = (value: number) => (value * Math.PI) / 180

  const dLat = toRad(pontoB.latitude - pontoA.latitude)
  const dLon = toRad(pontoB.longitude - pontoA.longitude)

  const latA = toRad(pontoA.latitude)
  const latB = toRad(pontoB.latitude)

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(latA) * Math.cos(latB) * Math.sin(dLon / 2) ** 2

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return EARTH_RADIUS_KM * c
}

export function isTimeCompatible(rideTime: string, userTime: string): boolean {
  return new Date(rideTime).getTime() >= new Date(userTime).getTime()
}

export function isFree(ride: Ride): boolean {
  return ride.fare_price === 0
}

export function calculateDetourKm(ride: Ride, userDestination: Coordenada): number {
  return haversineDistance(
    { latitude: ride.destination_latitude, longitude: ride.destination_longitude },
    userDestination
  )
}

export function calculateRideScore(ride: Ride, user: UserInput): number {
  const origemUser = user.origin
  const destinoUser = user.destination

  const distanciaOrigem = haversineDistance(origemUser, {
    latitude: ride.origin_latitude,
    longitude: ride.origin_longitude
  })

  const desvio = calculateDetourKm(ride, destinoUser)
  const preco = ride.fare_price

  const pesoDist = 0.3
  const pesoPreco = 0.3
  const pesoDesvio = 0.4

  return (
    (1 / (distanciaOrigem + 0.001)) * pesoDist +
    (1 / (preco + 1)) * pesoPreco +
    (1 / (desvio + 0.001)) * pesoDesvio
  )
}
