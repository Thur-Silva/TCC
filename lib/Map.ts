import { Driver, MarkerData } from "@/types/types";

// Array de chaves de API para fallback automático
const API_KEYS = [
  "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjFlZWQxZmJlZTZhYzQ2MWRhZGIxNGI2N2VlN2QzZDZmIiwiaCI6Im11cm11cjY0In0=",
  "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjAyMmQ5OTUyYWM5NjQxYmZiNjI0YmM1ZTJjNjQyNWEwIiwiaCI6Im11cm11cjY0In0=", 
  "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjAyMmQ5OTUyYWM5NjQxYmZiNjI0YmM1ZTJjNjQyNWEwIiwiaCI6Im11cm11cjY0In0=",
];

// Função para fazer requisição com fallback de chaves
const fetchWithApiKeyFallback = async (baseUrl: string, headers: Record<string, string> = {}) => {
  let lastError: Error | null = null;

  for (let i = 0; i < API_KEYS.length; i++) {
    const apiKey = API_KEYS[i];
    // Verifica se a chave não é um placeholder
    if (apiKey.includes('sua_') && apiKey.includes('_aqui')) {
      console.warn(`Pulando chave de API ${i + 1} (placeholder)`);
      continue;
    }
    
    const url = `${baseUrl}&api_key=${apiKey}`;
    
    try {
      console.log(`Tentando API Key ${i + 1}...`);
      const response = await fetch(url, { headers });
      
      if (response.ok) {
        console.log(`API Key ${i + 1} funcionou!`);
        return response;
      } else {
        const errorText = await response.text();
        console.warn(`API Key ${i + 1} failed (Status: ${response.status}): ${errorText}`);
        lastError = new Error(`API Key ${i + 1} failed: ${response.status}`);
      }
    } catch (error) {
      console.warn(`API Key ${i + 1} failed with error:`, error);
      lastError = error as Error;
    }
  }

  throw new Error(`Todas as chaves de API falharam. Último erro: ${lastError?.message}`);
};

export const generateMarkersFromData = ({
  data,
  userLatitude,
  userLongitude,
}: {
  data: Driver[];
  userLatitude: number;
  userLongitude: number;
}): MarkerData[] => {
  return data.map((driver) => {
    // Adiciona um pequeno offset aleatório para dispersar marcadores que estariam na mesma posição.
    const latOffset = (Math.random() - 0.5) * 0.01; // Offset entre -0.005 e 0.005
    const lngOffset = (Math.random() - 0.5) * 0.01; // Offset entre -0.005 e 0.005

    return {
      // --- CORREÇÃO AQUI: Adicionando a propriedade 'id' ---
      id: driver.driver_id, // Usando driver_id como id, já que é um número. Se 'id' em MarkerData for string, driver_id.toString().
      latitude: userLatitude + latOffset,
      longitude: userLongitude + lngOffset,
      title: `${driver.first_name} ${driver.last_name}`,
      ...driver, // Mantém outras propriedades do driver
    };
  });
};

export const calculateRegion = ({
  userLatitude,
  userLongitude,
  destinationLatitude,
  destinationLongitude,
}: {
  userLatitude: number | null;
  userLongitude: number | null;
  destinationLatitude?: number | null;
  destinationLongitude?: number | null;
}) => {
  // Retorna uma região padrão se a localização do usuário não estiver disponível.
  if (!userLatitude || !userLongitude) {
    return {
      latitude: 37.78825, // Latitude padrão (São Francisco)
      longitude: -122.4324, // Longitude padrão (São Francisco)
      latitudeDelta: 0.01, // Nível de zoom padrão
      longitudeDelta: 0.01, // Nível de zoom padrão
    };
  }

  // Centraliza o mapa no usuário se não houver um destino definido.
  if (!destinationLatitude || !destinationLongitude) {
    return {
      latitude: userLatitude,
      longitude: userLongitude,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005,
    };
  }

  // Calcula a região que engloba tanto o usuário quanto o destino.
  const minLat = Math.min(userLatitude, destinationLatitude);
  const maxLat = Math.max(userLatitude, destinationLatitude);
  const minLng = Math.min(userLongitude, destinationLongitude);
  const maxLng = Math.max(userLongitude, destinationLongitude);

  // Adiciona um padding para garantir que os pontos não fiquem na borda do mapa.
  const latitudeDelta = (maxLat - minLat) * 1.3;
  const longitudeDelta = (maxLng - minLng) * 1.3;

  // Calcula o centro da região entre o usuário e o destino.
  const latitude = (userLatitude + destinationLatitude) / 2;
  const longitude = (userLongitude + destinationLongitude) / 2;

  return {
    latitude,
    longitude,
    latitudeDelta,
    longitudeDelta,
  };
};

// Nova função para buscar directions
export const getDirections = async ({
  startLatitude,
  startLongitude,
  endLatitude,
  endLongitude,
}: {
  startLatitude: number;
  startLongitude: number;
  endLatitude: number;
  endLongitude: number;
}): Promise<{ latitude: number; longitude: number }[]> => {
  try {
    console.log('Iniciando busca de direções...');
    const baseUrl = `https://api.openrouteservice.org/v2/directions/driving-car?start=${startLongitude},${startLatitude}&end=${endLongitude},${endLatitude}`;
    
    const response = await fetchWithApiKeyFallback(baseUrl, {
      'Accept': 'application/json, application/geo+json, application/gpx+xml, image/png',
    });

    const data = await response.json();
    
    // Verifica se é formato GeoJSON (features) ou formato routes
    if (data.features && data.features.length > 0) {
      // Formato GeoJSON
      const feature = data.features[0];
      console.log('Feature encontrada:', feature);
      
      if (feature.geometry && feature.geometry.coordinates) {
        const coordinates = feature.geometry.coordinates;

        
        // Converte as coordenadas de [longitude, latitude] para {latitude, longitude}
        const convertedCoordinates = coordinates.map((coord: [number, number]) => ({
          longitude: coord[0],
          latitude: coord[1],
        }));
        
        console.log('Coordenadas convertidas:', convertedCoordinates.length, 'pontos');
        return convertedCoordinates;
      } else {
        console.error('Geometria não encontrada na feature:', feature);
      }
    } else if (data.routes && data.routes.length > 0) {
      // Formato routes (fallback)
      const route = data.routes[0];
      console.log('Rota encontrada:', route);
      
      if (route.geometry && route.geometry.coordinates) {
        const coordinates = route.geometry.coordinates;
        console.log('Coordenadas da rota (routes):', coordinates.length, 'pontos');
        
        // Converte as coordenadas de [longitude, latitude] para {latitude, longitude}
        const convertedCoordinates = coordinates.map((coord: [number, number]) => ({
          longitude: coord[0],
          latitude: coord[1],
        }));
        
        console.log('Coordenadas convertidas:', convertedCoordinates.length, 'pontos');
        return convertedCoordinates;
      } else {
        console.error('Geometria da rota não encontrada:', route);
      }
    } else {
      console.error('Nenhuma rota ou feature encontrada na resposta:', data);
    }
    
    return [];
  } catch (error) {
    console.error("Erro detalhado ao buscar directions:", error);
    throw error;
  }
};

export const calculateDriverTimes = async ({
  markers,
  userLatitude,
  userLongitude,
  destinationLatitude,
  destinationLongitude,
}: {
  markers: MarkerData[];
  userLatitude: number | null;
  userLongitude: number | null;
  destinationLatitude: number | null;
  destinationLongitude: number | null;
}) => {
  // Garante que todas as coordenadas necessárias estejam presentes para o cálculo.
  if (
    !userLatitude ||
    !userLongitude ||
    !destinationLatitude ||
    !destinationLongitude
  )
    return;

  try {
    const timesPromises = markers.map(async (marker) => {
      try {
        // 1. Calcula a rota do motorista (marker) até o usuário (user).
        const urlToUser = `https://api.openrouteservice.org/v2/directions/driving-car?start=${marker.longitude},${marker.latitude}&end=${userLongitude},${userLatitude}`;
        const responseToUser = await fetchWithApiKeyFallback(urlToUser, {
          'Accept': 'application/json, application/geo+json, application/gpx+xml, image/png',
        });

        const dataToUser = await responseToUser.json();
        
        // Extrai duração baseado no formato da resposta
        let timeToUser = 0;
        if (dataToUser.features && dataToUser.features.length > 0) {
          // Formato GeoJSON
          timeToUser = dataToUser.features[0].properties.summary.duration;
        } else if (dataToUser.routes && dataToUser.routes.length > 0) {
          // Formato routes
          timeToUser = dataToUser.routes[0].summary.duration;
        }

        // 2. Calcula a rota do usuário (user) até o destino final (destination).
        const urlToDestination = `https://api.openrouteservice.org/v2/directions/driving-car?start=${userLongitude},${userLatitude}&end=${destinationLongitude},${destinationLatitude}`;
        const responseToDestination = await fetchWithApiKeyFallback(urlToDestination, {
          'Accept': 'application/json, application/geo+json, application/gpx+xml, image/png',
        });

        const dataToDestination = await responseToDestination.json();
        
        // Extrai duração baseado no formato da resposta
        let timeToDestination = 0;
        if (dataToDestination.features && dataToDestination.features.length > 0) {
          // Formato GeoJSON
          timeToDestination = dataToDestination.features[0].properties.summary.duration;
        } else if (dataToDestination.routes && dataToDestination.routes.length > 0) {
          // Formato routes
          timeToDestination = dataToDestination.routes[0].summary.duration;
        }

        // Calcula o tempo total da viagem em minutos.
        const totalTime = (timeToUser + timeToDestination) / 60;
        // Calcula um preço estimado com base no tempo total.
        const price = (totalTime * 0.5).toFixed(2);

        // Retorna o marcador com as informações de tempo e preço adicionadas.
        return { ...marker, time: totalTime, price };
      } catch (error) {
        console.error(`Erro ao calcular tempo para o motorista ${marker.id}:`, error);
        // Retorna o marcador sem tempo/preço em caso de erro
        return { ...marker, time: 0, price: "0.00" };
      }
    });

    // Aguarda que todas as promessas de cálculo de rota sejam resolvidas.
    return await Promise.all(timesPromises);
  } catch (error) {
    console.error("Error calculating driver times:", error);
    return [];
  }
};

export { fetchWithApiKeyFallback };

