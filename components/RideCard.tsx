import { icons } from '@/constants';
import { formatDate, formatTime } from '@/lib/utils';
import { Ride } from '@/types/types';
import { useState } from 'react';
import { Image, Text, TouchableWithoutFeedback, View } from 'react-native';

export default function RideCard({ ride }: { ride: Ride }) {
    const {
        origin_address,
        destination_address,
        created_at,
        ride_time,
        driver,
        payment_status,
    } = ride;

    const [isOpen, setIsOpen] = useState(false);

    return (
        <TouchableWithoutFeedback onPress={() => setIsOpen(!isOpen)}>
            <View className="bg-white rounded-xl mb-4 overflow-hidden shadow-md">
                <View className="flex-row p-4">
                    <View className="flex-1 justify-center">
                        <View className="flex-row items-center mb-1">
                            <Image source={icons.to} className="w-5 h-5 mr-2" resizeMode="contain" />
                            <Text className="flex-1 text-base font-JakartaMedium text-gray-700" numberOfLines={1}>
                                {origin_address}
                            </Text>
                        </View>
                        <View className="flex-row items-center">
                            <Image source={icons.point} className="w-5 h-5 mr-2" resizeMode="contain" />
                            <Text className="flex-1 text-base font-JakartaMedium text-gray-700" numberOfLines={1}>
                                {destination_address}
                            </Text>
                        </View>
                    </View>
                </View>

                {isOpen && (
                    <View className="bg-gray-100 p-4 border-t border-gray-200">
                        <View className="flex-row justify-between mb-2">
                            <Text className="text-sm font-JakartaMedium text-gray-500">Data e Hora</Text>
                            <Text className="text-sm font-JakartaRegular text-gray-700">
                                {formatDate(created_at)}, {formatTime(ride_time)}
                            </Text>
                        </View>
                        <View className="flex-row justify-between mb-2">
                            <Text className="text-sm font-JakartaMedium text-gray-500">Motorista</Text>
                            <Text className="text-sm font-JakartaRegular text-gray-700">
                                {driver.first_name} {driver.last_name}
                            </Text>
                        </View>
                        <View className="flex-row justify-between">
                            <Text className="text-sm font-JakartaMedium text-gray-500">Pagamento</Text>
                            <Text
                                className={`text-sm font-JakartaMedium ${
                                    payment_status === 'paid' ? 'text-green-600' : 'text-red-500'
                                }`}
                            >
                                {payment_status === 'paid' ? 'Pago' : 'Pendente'}
                            </Text>
                        </View>
                    </View>
                )}
            </View>
        </TouchableWithoutFeedback>
    );
}