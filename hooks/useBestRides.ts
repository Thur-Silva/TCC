// hooks/useBestRides.ts
import { fetchAPI } from '@/lib/fecth'
import {
  calculateRideScore,
  isFree,
  isTimeCompatible
} from '@/services/rideService'
import { Ride, UserInput } from '@/types/types'
import { useEffect, useState } from 'react'

interface UseBestRidesReturn {
  topRides: Ride[]
  loading: boolean
  error: string | null
  isEmpty: boolean
}

export function useBestRides(userInput: UserInput): UseBestRidesReturn {
  const [rides, setRides] = useState<Ride[]>([])
  const [topRides, setTopRides] = useState<Ride[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dataFetched, setDataFetched] = useState(false)

  useEffect(() => {
    fetchRides()
  }, [])

  useEffect(() => {
    if (dataFetched) {
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
      } else {
        setTopRides([])
      }
    }
  }, [rides, userInput.userTime, userInput.onlyFree, dataFetched])

  async function fetchRides() {
    try {
      setLoading(true)
      setError(null)
      
      const res = await fetchAPI('/(api)/(ride)/route')
      console.log('Response received:', res)
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`)
      }
      
      const data = await res.json()
      console.log('Parsed data:', data)
      
      // Verifica se a API retornou uma mensagem de erro ou array vazio
      if (typeof data === 'string') {
        // API retornou uma string (mensagem de erro ou "Nenhuma ride encontrada")
        console.log('API returned message:', data)
        setRides([])
        setError(data)
      } else if (Array.isArray(data)) {
        // API retornou um array (pode estar vazio ou com dados)
        setRides(data)
        if (data.length === 0) {
          setError('Nenhuma carona disponível no momento')
        }
      } else {
        // Formato inesperado
        console.error('Unexpected data format:', data)
        setRides([])
        setError('Formato de dados inesperado')
      }
      
    } catch (error) {
      console.error('Erro ao buscar rides:', error)
      setRides([])
      setError(error instanceof Error ? error.message : 'Erro desconhecido ao buscar caronas')
    } finally {
      setLoading(false)
      setDataFetched(true)
    }
  }

  return { 
    topRides, 
    loading, 
    error,
    isEmpty: dataFetched && rides.length === 0
  }
}