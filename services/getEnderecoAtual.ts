import { fetchWithApiKeyFallback } from '@/lib/Map'; // ou ajuste o path correto
import { Coordenada } from '@/types/types'

type Endereco = {
  rua?: string
  bairro?: string
  cidade?: string
  estado?: string
  pais?: string
  exibicaoCompleta: string
}

export async function getEnderecoAtual(coordenada: Coordenada): Promise<Endereco | null> {
  const { latitude, longitude } = coordenada

  const baseUrl = `https://api.openrouteservice.org/geocode/reverse?point.lat=${latitude}&point.lon=${longitude}&size=1`

  try {
    const response = await fetchWithApiKeyFallback(baseUrl, {
      'Accept': 'application/json',
    })

    const data = await response.json()

    const feature = data?.features?.[0]
    const props = feature?.properties || {}

    return {
      rua: props.street || '',
      bairro: props.locality || '',
      cidade: props.region || '',
      estado: props.state || '',
      pais: props.country || '',
      exibicaoCompleta: props.label || '',
    }
  } catch (error) {
    console.error('Erro ao buscar endereço reverso:', error)
    return null
  }
}
