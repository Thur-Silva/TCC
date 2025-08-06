import CustomButton from "@/components/CustomButton";
import DriverCard from "@/components/DriverCard";
import RideLayout from "@/components/RideLayout";
import { calculateDriverTimes } from "@/lib/Map";
import { useDriveStore, useLocationStore } from "@/store";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";

const ConfirmRide = () => {
    const { drivers, selectedDriver, setSelectedDriver, setDrivers } = useDriveStore();
    const { userLatitude, userLongitude, destinationLatitude, destinationLongitude } = useLocationStore();
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const [isCalculatingTimes, setIsCalculatingTimes] = useState(false);

    // Debug: Log das coordenadas
    console.log('ConfirmRide - User:', userLatitude, userLongitude);
    console.log('ConfirmRide - Destination:', destinationLatitude, destinationLongitude);
    console.log('ConfirmRide - Drivers:', drivers?.length);

    useEffect(() => {
        setIsButtonDisabled(!selectedDriver);
    }, [selectedDriver]);

    // Calcular tempos dos motoristas quando a tela carrega
    useEffect(() => {
        const calculateTimes = async () => {
            if (
                drivers && 
                drivers.length > 0 && 
                userLatitude && 
                userLongitude && 
                destinationLatitude && 
                destinationLongitude
            ) {
                setIsCalculatingTimes(true);
                try {
                    console.log('Calculando tempos dos motoristas...');
                    const driversWithTimes = await calculateDriverTimes({
                        markers: drivers,
                        userLatitude,
                        userLongitude,
                        destinationLatitude,
                        destinationLongitude,
                    });
                    
                    if (driversWithTimes && driversWithTimes.length > 0) {
                        console.log('Tempos calculados:', driversWithTimes);
                        setDrivers(driversWithTimes);
                    }
                } catch (error) {
                    console.error('Erro ao calcular tempos:', error);
                } finally {
                    setIsCalculatingTimes(false);
                }
            }
        };

        calculateTimes();
    }, [userLatitude, userLongitude, destinationLatitude, destinationLongitude]);

    const handleSelectDriver = (driverId: number) => {
        setSelectedDriver(driverId);
    };

    const handleConfirmPress = () => {
        if (!selectedDriver) {
            return;
        }
        router.push('/(root)/book-ride');
    };

    const EmptyListPlaceholder = () => (
        <View className="flex-1 items-center justify-center p-8 mt-10">
            <Ionicons name="car-outline" size={50} color="#9ca3af" />
            <Text className="text-xl font-JakartaMedium text-gray-500 mt-4 text-center">
                Nenhum motorista encontrado no momento.
            </Text>
            <Text className="text-base font-JakartaLight text-gray-500 mt-2 text-center">
                Tente ajustar sua localização ou aguarde alguns instantes.
            </Text>
        </View>
    );

    const LoadingPlaceholder = () => (
        <View className="flex-1 items-center justify-center p-8 mt-10">
            <Ionicons name="time-outline" size={50} color="#4598ff" />
            <Text className="text-xl font-JakartaMedium text-[#4598ff] mt-4 text-center">
                Calculando tempos e preços...
            </Text>
            <Text className="text-base font-JakartaLight text-gray-500 mt-2 text-center">
                Aguarde enquanto encontramos as melhores opções.
            </Text>
        </View>
    );

    return (
        <RideLayout title="Escolha um motorista" snapPoints={['65%', '85%']}>
            {isCalculatingTimes ? (
                <LoadingPlaceholder />
            ) : (
                <FlatList
                    data={drivers}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <View className="px-5">
                            <DriverCard
                                selected={selectedDriver!}
                                setSelected={() => handleSelectDriver(Number(item.id)!)}
                                item={item}
                            />
                        </View>
                    )}
                    ListEmptyComponent={EmptyListPlaceholder}
                />
            )}

            <View className="p-5">
                <CustomButton
                    title="Selecionar"
                    onPress={handleConfirmPress}
                    className={`${isButtonDisabled ? "bg-gray-400" : "bg-[#1456a7]"}`}
                    disabled={isButtonDisabled}
                />
            </View>
        </RideLayout>
    );
};

export default ConfirmRide;