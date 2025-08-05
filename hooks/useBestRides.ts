// hooks/useBestRides.ts
import { fetchAPI } from '@/lib/fecth'
import {
    calculateRideScore,
    isFree,
    isTimeCompatible
} from '@/services/rideService'
import { Ride, UserInput } from '@/types/types'
import { useEffect, useState } from 'react'

export function useBestRides(userInput: UserInput) {
  const [rides, setRides] = useState<Ride[]>([])
  const [topRides, setTopRides] = useState<Ride[]>([])

  useEffect(() => {
    fetchRides()
  }, [])

  useEffect(() => {
    if (rides.length > 0) {
      const filtradas = rides
        .filter((ride) => isTimeCompatible(ride.ride_time.toString(), userInput.userTime))
        .filter((ride) => (userInput.onlyFree ? isFree(ride) : true))

      const pontuadas = filtradas
        .map((ride) => ({
          ...ride,
          score: calculateRideScore(ride, userInput)
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 5)

      setTopRides(pontuadas)
    }
  }, [rides, userInput])

  async function fetchRides() {
    try {
      const res = await fetchAPI('/(api)/(ride)/route')
      console.log('Rides fetched:', res)
      if (!res.ok) {
        console.error('Erro ao buscar rides:', res.statusText)
      }
      const data = await res.json()
      setRides(data)
    } catch (error) {
      console.error('Erro ao buscar rides', error)
    }
  }

  return { topRides, loading: rides.length === 0 }
}
