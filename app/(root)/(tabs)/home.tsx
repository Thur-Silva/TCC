// app/(root)/(tabs)/home.tsx
import { SignedIn, useUser } from '@clerk/clerk-expo';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  Keyboard,
  Pressable,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import HomeHeader from '@/components/HomeHeader';
import RideCard from '@/components/RideCard';
import { icons, images } from '@/constants';
import { useLocationStore } from '@/store';
import { Ride } from '@/types/types';

const recentRides = [
  {
    ride_id: "1",
    origin_address: "Kathmandu, Nepal",
    destination_address: "Pokhara, Nepal",
    origin_latitude: 27.717245,
    origin_longitude: 85.323961,
    destination_latitude: 28.209583,
    destination_longitude: 83.985567,
    ride_time: 391,
    fare_price: 19500.0,
    payment_status: "paid",
    driver_id: 2,
    user_email: "user@example.com",
    created_at: "2024-08-12 05:19:20.620007",
    driver: {
      first_name: "David",
      last_name: "Brown",
      car_seats: 5,
    }
  },
  {
    ride_id: "2",
    origin_address: "Jalkot, MH",
    destination_address: "Pune, Maharashtra, India",
    origin_latitude: 18.609116,
    origin_longitude: 77.165873,
    destination_latitude: 18.52043,
    destination_longitude: 73.856744,
    ride_time: 491,
    fare_price: 24500.0,
    payment_status: "paid",
    driver_id: 1,
    user_email: "user@example.com",
    created_at: "2024-08-12 06:12:17.683046",
    driver: {
      first_name: "James",
      last_name: "Wilson",
      car_seats: 4,
    }
  },
  {
    ride_id: "3",
    origin_address: "Zagreb, Croatia",
    destination_address: "Rijeka, Croatia",
    origin_latitude: 45.815011,
    origin_longitude: 15.981919,
    destination_latitude: 45.327063,
    destination_longitude: 14.442176,
    ride_time: 124,
    fare_price: 6200.0,
    payment_status: "paid",
    driver_id: 1,
    user_email: "user@example.com",
    created_at: "2024-08-12 08:49:01.809053",
    driver: {
      first_name: "James",
      last_name: "Wilson",
      car_seats: 4,
    }
  },
  {
    ride_id: "4",
    origin_address: "Okayama, Japan",
    destination_address: "Osaka, Japan",
    origin_latitude: 34.655531,
    origin_longitude: 133.919795,
    destination_latitude: 34.693725,
    destination_longitude: 135.502254,
    ride_time: 159,
    fare_price: 7900.0,
    payment_status: "paid",
    driver_id: 3,
    user_email: "user@example.com",
    created_at: "2024-08-12 18:43:54.297838",
    driver: {
      first_name: "Michael",
      last_name: "Johnson",
      car_seats: 4,
    }
  }
];

export default function Page() {
  const { user } = useUser();
  const { setUserLocation, setDestinationLocation } = useLocationStore();
  const [hasPermission, setHasPermission] = useState(false);
  const [showAutocomplete, setShowAutocomplete] = useState(true);

  const handleSignOut = () => {
    // lógica de logout
  };

  const handleDestinationPress = (location: { latitude: number; longitude: number; address: string }) => {
    setDestinationLocation(location);
    router.push("/(root)/find-ride");
  };

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setHasPermission(false);
        return;
      }
      setHasPermission(true);

      const loc = await Location.getCurrentPositionAsync();
      const [addr] = await Location.reverseGeocodeAsync({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude
      });

      setUserLocation({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        address: `${addr.name}, ${addr.region}`
      });
    })();
  }, []);

  return (
    <SafeAreaView className="bg-general-500 flex-1 relative">
      {showAutocomplete && (
        <Pressable
          style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            zIndex: 10
          }}
          onPress={() => {
            Keyboard.dismiss();
            setShowAutocomplete(false);
          }}
        />
      )}

       <HomeHeader
        showInput={true}
       />

      <FlatList<Ride>
        data={recentRides}
         keyExtractor={(item) => item.created_at}
        renderItem={({ item }) => <RideCard ride={item} />}
        keyboardShouldPersistTaps="handled"
        className="px-5 pt-[50px]"
        contentContainerStyle={{ paddingBottom: 170 }}
        ListHeaderComponent={() => (
          <>
            <View className="flex flex-row items-center justify-between mb-20">
                <View className='bg-[#0b5bbda0] w-full h-[200px] rounded-3xl items-center'>
                        <TouchableOpacity style={{position: 'absolute'}} onPress={handleSignOut} className="justify-center mt-16 ml-[75%] items-center w-12 h-12 rounded-full bg-[#b69b70eb]">
                            <Image source={icons.out} className="w-6 h-6" resizeMode="contain" />
                        </TouchableOpacity>

                        <Text className="text-3xl font-JakartaExtraBold mt-4">
                        Bem‑vindo de volta!
                        </Text>

                        <Text className="text-xl font-JakartaLight mt-2">
                        Planeja sair da conta?
                        </Text>

                        <View className="justify-center items-center w-full h-[200px] mt-[-25px]">
                            <Image source={images.BrownCar} className="w-full h-[200px]" resizeMode="contain" />
                        </View>
                </View>
            </View>



            
              <View className="flex flex-row items-center justify-between mb-5 ">
                <View className='rounded-3xl items-center justify-center'>
                    <Text style={{marginLeft:15}} className="text-4xl font-JakartaBold mt-10 mb-10">Últimas Corridas</Text>
                </View>
            </View>
          </>
        )}
      />

      <SignedIn />
    </SafeAreaView>
  );
}
