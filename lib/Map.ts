import { Driver, MarkerData } from "@/types/types";

// Sua chave de API fornecida pelo OpenRouteService.
// É crucial que esta chave esteja configurada corretamente.
const OPEN_ROUTE_SERVICE_API_KEY = "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjFlZWQxZmJlZTZhYzQ2MWRhZGIxNGI2N2VlN2QzZDZmIiwiaCI6Im11cm11cjY0In0=";

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
      latitudeDelta:  0.005,
      longitudeDelta:  0.005,
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

  // Verifica se a chave da API do OpenRouteService está configurada.
  if (!OPEN_ROUTE_SERVICE_API_KEY) {
      console.error("OpenRouteService API Key is not configured. Please ensure it's set correctly.");
      return; // Interrompe a execução se a chave não estiver presente.
  }

  try {
    const timesPromises = markers.map(async (marker) => {
      // **IMPORTANTE:** O OpenRouteService espera coordenadas no formato LONGITUDE,LATITUDE.
      // Ajuste a ordem das coordenadas conforme necessário.

      // 1. Calcula a rota do motorista (marker) até o usuário (user).
      const urlToUser = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${OPEN_ROUTE_SERVICE_API_KEY}&start=${marker.longitude},${marker.latitude}&end=${userLongitude},${userLatitude}`;
      const responseToUser = await fetch(urlToUser, {
        headers: {
          'Accept': 'application/json, application/geo+json, application/gpx+xml, image/png',
        },
      });

      // Trata erros na resposta da API para a primeira rota.
      if (!responseToUser.ok) {
        const errorText = await responseToUser.text();
        console.error(`OpenRouteService API Error (To User - Status: ${responseToUser.status}): ${errorText}`);
        throw new Error(`Failed to get route to user.`);
      }
      const dataToUser = await responseToUser.json();

      // Extrai a duração da rota da resposta do OpenRouteService.
      // O tempo é retornado em segundos.
      const timeToUser = dataToUser.routes[0].summary.duration;

      // 2. Calcula a rota do usuário (user) até o destino final (destination).
      const urlToDestination = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${OPEN_ROUTE_SERVICE_API_KEY}&start=${userLongitude},${userLatitude}&end=${destinationLongitude},${destinationLatitude}`;
      const responseToDestination = await fetch(urlToDestination, {
        headers: {
          'Accept': 'application/json, application/geo+json, application/gpx+xml, image/png',
        },
      });

      // Trata erros na resposta da API para a segunda rota.
      if (!responseToDestination.ok) {
        const errorText = await responseToDestination.text();
        console.error(`OpenRouteService API Error (To Destination - Status: ${responseToDestination.status}): ${errorText}`);
        throw new Error(`Failed to get route to destination.`);
      }
      const dataToDestination = await responseToDestination.json();
      const timeToDestination = dataToDestination.routes[0].summary.duration;

      // Calcula o tempo total da viagem em minutos.
      const totalTime = (timeToUser + timeToDestination) / 60;
      // Calcula um preço estimado com base no tempo total.
      const price = (totalTime * 0.5).toFixed(2);

      // Retorna o marcador com as informações de tempo e preço adicionadas.
      return { ...marker, time: totalTime, price };
    });

    // Aguarda que todas as promessas de cálculo de rota sejam resolvidas.
    return await Promise.all(timesPromises);
  } catch (error) {
    console.error("Error calculating driver times:", error);
    // Em caso de erro, você pode querer retornar um array vazio ou relançar o erro
    // para que o código chamador possa lidar com a falha de forma mais específica.
    return [];
  }
};