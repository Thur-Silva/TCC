// components/Map.tsx
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import MapView, {
    Marker,
    PROVIDER_DEFAULT,
    Region,
    UrlTile,
} from 'react-native-maps';

import { icons } from '@/constants';
import { generateMarkersFromData } from '@/lib/Map';
import { useDriveStore, useLocationStore } from '@/store';
import { Driver, MarkerData } from '@/types/types';

const GEOAPIFY_API_KEY = 'ff892bc08be34cdeafde385fa815848e';

const Map: React.FC = () => {
  const { userLatitude, userLongitude } = useLocationStore();
  const { selectedDriver, setDrivers } = useDriveStore();
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const [region, setRegion] = useState<Region | null>(null);

  // mock de drivers
  const drivers: Driver[] = [
    { driver_id: 101, first_name: 'Isabela', last_name: 'Santos', profile_image_url: '', car_image_url: '', car_seats: 4, rating: 4.8 },
    { driver_id: 102, first_name: 'Ricardo', last_name: 'Oliveira', profile_image_url: '', car_image_url: '', car_seats: 5, rating: 4.5 },
  ];

  // quando a localização do usuário estiver disponível, define a região com zoom bem fechado
  useEffect(() => {
    if (userLatitude != null && userLongitude != null) {
      setRegion({
        latitude: userLatitude,
        longitude: userLongitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });

      // gerar marcadores
      const newMarkers = generateMarkersFromData({
        data: drivers,
        userLatitude,
        userLongitude,
      });
      setMarkers(newMarkers);
      setDrivers(newMarkers);
    }
  }, [userLatitude, userLongitude, setDrivers]);

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
    top:    -1000,
    left:   -1000,
    bottom: -1000,
    right:  -1000
  }} // remove a marca d'água
      >
        <UrlTile
          urlTemplate={`https://maps.geoapify.com/v1/tile/osm-carto/{z}/{x}/{y}.png?apiKey=${GEOAPIFY_API_KEY}`}
          maximumZ={19}
          flipY={false}
        />

        {markers.map(marker => (
          <Marker
            key={marker.id}
            coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
            title={marker.title}
            image={ selectedDriver === marker.id ? icons.selectedMarker : icons.marker }
          />
        ))}
      </MapView>
    </View>
  );
};

export default Map;
