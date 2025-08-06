import GoogleTextInput from '@/components/GoogleTextInput'
import HomeHeader from '@/components/HomeHeader'
import Map from '@/components/Map'

import { icons } from '@/constants'
import {
  ActivityIndicator,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from 'react-native'

import { Ride } from '@/types/types'
import LottieView from 'lottie-react-native'
import { useState } from 'react'

type Props = {
  originAddress: string
  destinationAddress: string
  onOriginSelect: (data: { latitude: number; longitude: number; address: string }) => void;
  onDestinationSelect: (data: { latitude: number; longitude: number; address: string }) => void;
  onlyFree: boolean
  setOnlyFree: (value: boolean) => void
  orderBy: 'price' | 'detour' | 'distance' | 'time'
  setOrderBy: (value: 'price' | 'detour' | 'distance' | 'time') => void
  orderByOptions: { label: string; value: string }[]
  topRides: Ride[]
  loading: boolean
  error: string | null
  isEmpty: boolean
  formatPrice: (price: number) => string
}

const RidesLayout = ({
  originAddress,
  destinationAddress,
  onOriginSelect,
  onDestinationSelect,
  onlyFree,
  setOnlyFree,
  orderBy,
  setOrderBy,
  orderByOptions,
  topRides,
  loading,
  error,
  isEmpty,
  formatPrice,
}: Props) => {
  const [showMap, setShowMap] = useState(false)

  return (
    <SafeAreaView className="flex-1 bg-white">
      <HomeHeader showInput={true} globalClassName="mt-14" />

      <ScrollView
        className="bg-white"
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Título */}
        <View className="px-5 pt-8">
          <Text className="text-4xl font-JakartaExtraBold text-[#1456a7] mb-1">
            Personalise sua Carona
          </Text>
          <Text className="text-sm px-2 font-JakartaRegular text-gray-600">
            Preencha os dados da viagem e veja as melhores opções de acordo com suas preferências no mapa.
          </Text>
        </View>

        <View className="items-center mt-4 mb-0">
          <LottieView
            source={require('@/assets/animations/searchRide.json')}
            autoPlay
            loop={false}
            speed={0.8}
            style={{ width: 650, height: 350 }}
            resizeMode="contain"
          />
        </View>

        {/* Inputs */}
        <View className="px-5 mt-6">
          <View className="bg-[#e6f0ff] rounded-2xl px-4 py-6 space-y-6 border border-[#d0e2f7]">
            <Text className="text-4xl font-JakartaExtraBold text-[#1456a7] mb-5">Para onde deseja ir? </Text>

            {/* Campo: Origem */}
            <View className="space-y-2">
              <Text className="text-sm text-[#1456a7] font-JakartaSemiBold">
                Local de Partida
              </Text>
              <GoogleTextInput
                icon={icons.to}
                initialLocation={originAddress}
                handlePress={onOriginSelect}
                containerStyle="bg-white rounded-xl border border-[#d9e6f9] px-4 py-2 mt-5 mb-5"
                textInputBackgroundColor="transparent"
              />
            </View>

            {/* Campo: Destino */}
            <View className="space-y-2">
              <Text className="text-sm text-[#1456a7] font-JakartaSemiBold">
                Destino
              </Text>
              <GoogleTextInput
                icon={icons.to}
                initialLocation={destinationAddress}
                handlePress={onDestinationSelect}
                containerStyle="bg-white rounded-xl border border-[#d9e6f9] px-4 py-2 mt-5 mb-5"
                textInputBackgroundColor="transparent"
              />
            </View>

            {/* Filtro: Somente caronas grátis */}
            <View className="space-y-2">
              <Text className="text-sm text-[#1456a7] font-JakartaSemiBold mb-5">
                Preferências
              </Text>
              <Pressable
                onPress={() => setOnlyFree(!onlyFree)}
                className={`w-full items-center justify-center rounded-full py-2 border mb-5 ${
                  onlyFree ? 'bg-[#1A73E8] border-[#1A73E8]' : 'bg-white border-[#1A73E8]'
                }`}
              >
                <Text
                  className={`font-JakartaSemiBold ${
                    onlyFree ? 'text-white' : 'text-[#1A73E8]'
                  }`}
                >
                  {onlyFree ? '✓ ' : ''}Somente corridas grátis
                </Text>
              </Pressable>
            </View>

            {/* Filtro: Ordenar por */}
            <View className="space-y-2">
              <Text className="text-sm text-[#1456a7] font-JakartaSemiBold mb-5">
                Ordenar por
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {orderByOptions.map((option) => (
                  <Pressable
                    key={option.value}
                    onPress={() => setOrderBy(option.value as any)}
                    className={`px-4 py-2 mr-2 rounded-full border ${
                      orderBy === option.value
                        ? 'bg-[#1A73E8] border-[#1A73E8]'
                        : 'bg-white border-[#4598ff]'
                    }`}
                  >
                    <Text
                      className={`font-JakartaSemiBold text-sm ${
                        orderBy === option.value ? 'text-white' : 'text-[#1456a7]'
                      }`}
                    >
                      {option.label}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          </View>
        </View>

        {/* Botão para exibir/esconder o mapa */}
        <View className="px-5 mt-2">
          <Pressable
            onPress={() => setShowMap((prev) => !prev)}
            className="w-full items-center justify-center rounded-full py-2 border border-[#1A73E8] bg-white"
          >
            <Text className="text-[#1A73E8] font-JakartaSemiBold">
              {showMap ? 'Esconder Mapa' : 'Mostrar Localização no Mapa'}
            </Text>
          </Pressable>
        </View>

        {/* Mapa Condicional */}
        {showMap && (
          <View className="px-5 mt-6 mb-20">
            <View className="rounded-3xl overflow-hidden h-[450px] shadow-xl">
              <Map />
            </View>
          </View>
        )}

        {/* Resultados */}
        <View className="px-5 mt-6">
          <Text className="text-xl font-JakartaBold text-[#1456a7] mb-4">
            Melhores Caronas
          </Text>

          {loading ? (
            <View className="justify-center items-center py-10">
              <ActivityIndicator size="large" color="#1A73E8" />
              <Text className="mt-4 text-gray-500 font-JakartaRegular">
                Buscando caronas...
              </Text>
            </View>
          ) : error ? (
            <View className="justify-center items-center py-10 px-6">

              <View className="items-center mt-4 mb-0">
                <LottieView
                  source={require('@/assets/animations/notFound.json')}
                  autoPlay
                  speed={0.8}
                  style={{ width: 650, height: 350 }}
                  resizeMode="contain"
                />
              </View>

              <Text className="text-xl text-red-600 font-JakartaBold text-center">
                Problema ao carregar caronas
              </Text>
              <Text className="text-lg text-gray-500 font-JakartaRegular text-center mt-2">
                Não encontramos corridas que atendam às suas preferências
              </Text>
            </View>
          ) : isEmpty || topRides.length === 0 ? (
            <View className="justify-center items-center py-10 px-6">
              <Image
                source={icons.noMessages}
                style={{ width: 180, height: 180, marginBottom: 16 }}
                resizeMode="contain"
              />
              <Text className="text-lg text-[#1456a7] font-JakartaBold text-center">
                Nenhuma carona encontrada
              </Text>
              <Text className="text-sm text-gray-500 font-JakartaRegular text-center mt-2">
                Tente mudar o destino, horário ou remover os filtros aplicados.
              </Text>

              {onlyFree && (
                <Pressable
                  onPress={() => setOnlyFree(false)}
                  className="mt-4 px-4 py-2 border border-[#1A73E8] rounded-full"
                >
                  <Text className="text-[#1A73E8] font-JakartaSemiBold">
                    Ver todas as caronas
                  </Text>
                </Pressable>
              )}
            </View>
          ) : (
            <View className="space-y-4">
              {topRides.map((ride) => (
                <View
                  key={ride.ride_id}
                  className="bg-white p-4 rounded-xl shadow-md border-l-4 border-[#1A73E8] flex-row justify-between items-center"
                >
                  <View>
                    <Text className="text-base font-JakartaBold text-[#1456a7]">
                      Motorista #{ride.driver_id}
                    </Text>
                    <Text className="text-sm text-gray-600 font-JakartaRegular">
                      Preço: {formatPrice(ride.fare_price)}
                    </Text>
                    <Text className="text-xs text-gray-500 mt-1">
                      {new Date(ride.ride_time).toLocaleString()}
                    </Text>
                  </View>

                  {ride.fare_price === 0 && (
                    <Text className="text-xs bg-[#e0f7e9] text-green-700 px-2 py-1 rounded-full">
                      GRÁTIS
                    </Text>
                  )}
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default RidesLayout
