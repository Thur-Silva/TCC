// components/Map.tsx
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import MapView, {
  Marker,
  Polyline,
  PROVIDER_DEFAULT,
  Region,
  UrlTile,
} from 'react-native-maps';

import { icons } from '@/constants';
import { generateMarkersFromData, getDirections } from '@/lib/Map';
import { useDriveStore, useLocationStore } from '@/store';
import { Driver, MarkerData } from '@/types/types';

const GEOAPIFY_API_KEY = 'ff892bc08be34cdeafde385fa815848e';

interface MapProps {
  destinationLatitude?: number;
  destinationLongitude?: number;
}

const Map: React.FC<MapProps> = ({ 
  destinationLatitude: propDestinationLatitude, 
  destinationLongitude: propDestinationLongitude 
}) => {
  const { userLatitude, userLongitude, destinationLatitude: storeDestinationLatitude, destinationLongitude: storeDestinationLongitude } = useLocationStore();
  const { selectedDriver, setDrivers } = useDriveStore();
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const [region, setRegion] = useState<Region | null>(null);
  const [routeCoordinates, setRouteCoordinates] = useState<{ latitude: number; longitude: number }[]>([]);

  // Use props se fornecidas, senão use do store
  const destinationLatitude = propDestinationLatitude || storeDestinationLatitude;
  const destinationLongitude = propDestinationLongitude || storeDestinationLongitude;

  // mock de drivers
  const drivers: Driver[] = [
    { driver_id: 101, first_name: 'Isabela', last_name: 'Santos', profile_image_url: '', car_image_url: '', car_seats: 4, rating: 4.8 },
    { driver_id: 102, first_name: 'Ricardo', last_name: 'Oliveira', profile_image_url: '', car_image_url: '', car_seats: 5, rating: 4.5 },
  ];

  // quando a localização do usuário estiver disponível, define a região
  useEffect(() => {
    if (userLatitude != null && userLongitude != null) {
      // Se há destino, ajusta a região para mostrar ambos os pontos
      if (destinationLatitude && destinationLongitude) {
        const minLat = Math.min(userLatitude, destinationLatitude);
        const maxLat = Math.max(userLatitude, destinationLatitude);
        const minLng = Math.min(userLongitude, destinationLongitude);
        const maxLng = Math.max(userLongitude, destinationLongitude);
        
        const latitudeDelta = Math.max((maxLat - minLat) * 1.5, 0.01);
        const longitudeDelta = Math.max((maxLng - minLng) * 1.5, 0.01);
        
        setRegion({
          latitude: (userLatitude + destinationLatitude) / 2,
          longitude: (userLongitude + destinationLongitude) / 2,
          latitudeDelta,
          longitudeDelta,
        });
      } else {
        // Região padrão focada no usuário
        setRegion({
          latitude: userLatitude,
          longitude: userLongitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        });
      }

      // gerar marcadores
      const newMarkers = generateMarkersFromData({
        data: drivers,
        userLatitude,
        userLongitude,
      });
      setMarkers(newMarkers);
      setDrivers(newMarkers);
    }
  }, [userLatitude, userLongitude, destinationLatitude, destinationLongitude, setDrivers]);

  // buscar rota quando há origem e destino
  useEffect(() => {
    const fetchRoute = async () => {
      if (
        userLatitude && 
        userLongitude && 
        destinationLatitude && 
        destinationLongitude
      ) {
        try {
          console.log('Buscando rota de:', userLatitude, userLongitude, 'para:', destinationLatitude, destinationLongitude);
          const coordinates = await getDirections({
            startLatitude: userLatitude,
            startLongitude: userLongitude,
            endLatitude: destinationLatitude,
            endLongitude: destinationLongitude,
          });
          
          if (coordinates && coordinates.length > 0) {
            console.log('Rota encontrada com', coordinates.length, 'pontos');
            setRouteCoordinates(coordinates);
          } else {
            console.log('Nenhuma coordenada de rota retornada');
            setRouteCoordinates([]);
          }
        } catch (error) {
          console.error('Erro ao buscar rota:', error);
          setRouteCoordinates([]);
        }
      } else {
        console.log('Limpando rota - coordenadas insuficientes');
        setRouteCoordinates([]);
      }
    };

    fetchRoute();
  }, [userLatitude, userLongitude, destinationLatitude, destinationLongitude]);

  if (!region) return null;

  return (
    <View style={{ flex: 1, borderRadius: 16, overflow: 'hidden' }}>
      <MapView
        provider={PROVIDER_DEFAULT}
        style={{ flex: 1 }}
        region={region}
        onRegionChangeComplete={r => setRegion(r)}
        showsUserLocation
        mapType="none"
        legalLabelInsets={{
          top: -1000,
          left: -1000,
          bottom: -1000,
          right: -1000
        }}
      >
        <UrlTile
          urlTemplate={`https://maps.geoapify.com/v1/tile/positron/{z}/{x}/{y}.png?apiKey=${GEOAPIFY_API_KEY}`}
          maximumZ={19}
          flipY={false}
        />

        {/* Linha da rota */}
        {routeCoordinates.length > 0 && (
          <Polyline
            coordinates={routeCoordinates}
            strokeColor="#007AFF"
            strokeWidth={4}
            lineDashPattern={[0]}
          />
        )}

        {/* Marcadores dos motoristas */}
        {markers.map(marker => (
          <Marker
            key={marker.id}
            coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
            title={marker.title}
            image={selectedDriver === marker.id ? icons.selectedMarker : icons.marker}
          />
        ))}

        {/* Marcador do destino */}
        {destinationLatitude && destinationLongitude && (
          <Marker
            coordinate={{
              latitude: destinationLatitude,
              longitude: destinationLongitude,
            }}
            title="Destino"
            pinColor="red"
          />
        )}
      </MapView>
    </View>
  );
};

export default Map;