import RidesLayout from '@/components/ridesLayout'
import { useBestRides } from '@/hooks/useBestRides'
import { useLocationStore } from '@/store'
import { Coordenada } from '@/types/types'
import { useEffect, useState } from 'react'

export default function RidesScreen() {
  const { userLatitude, userLongitude, userAddress } = useLocationStore()

  const [origin, setOrigin] = useState<Coordenada | null>(null)
  const [destination, setDestination] = useState<Coordenada | null>(null)
  const [originAddress, setOriginAddress] = useState('Origem')
  const [destinationAddress, setDestinationAddress] = useState('Destino')
  const [userTime, setUserTime] = useState(new Date().toISOString())
  const [onlyFree, setOnlyFree] = useState(false)
  const [orderBy, setOrderBy] = useState<'price' | 'detour' | 'distance' | 'time'>('price')

  const defaultCoordinate: Coordenada = { latitude: 0, longitude: 0 }

  const { topRides, loading } = useBestRides({
    origin: origin ?? defaultCoordinate,
    destination: destination ?? defaultCoordinate,
    userTime,
    onlyFree,
  })

  useEffect(() => {
    if (userAddress && userLatitude && userLongitude) {
      setOriginAddress(userAddress)
      setOrigin({ latitude: userLatitude, longitude: userLongitude })
    }
  }, [userAddress, userLatitude, userLongitude])

  useEffect(() => {
    // calcula região para o mapa (pode ser usado no layout se quiser)
  }, [userLatitude, userLongitude, origin, destination])

  const formatPrice = (price: number): string => {
    return price === 0 ? 'Grátis' : `R$ ${price.toFixed(2)}`
  }

  const orderByOptions = [
    { label: 'Preço', value: 'price' },
    { label: 'Desvio', value: 'detour' },
    { label: 'Distância', value: 'distance' },
    { label: 'Horário', value: 'time' },
  ]

  return (
    <RidesLayout
      originAddress={originAddress}
      destinationAddress={destinationAddress}
      setOrigin={setOrigin}
      setDestination={setDestination}
      setOriginAddress={setOriginAddress}
      setDestinationAddress={setDestinationAddress}
      onlyFree={onlyFree}
      setOnlyFree={setOnlyFree}
      orderBy={orderBy}
      setOrderBy={setOrderBy}
      orderByOptions={orderByOptions}
      topRides={topRides}
      loading={loading}
      formatPrice={formatPrice}
    />
  )
}
