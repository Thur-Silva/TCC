import CustomButton from "@/components/CustomButton";
import DriverCard from "@/components/DriverCard";
import RideLayout from "@/components/RideLayout";
import { useDriveStore } from "@/store";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";

const ConfirmRide = () => {
    const { drivers, selectedDriver, setSelectedDriver } = useDriveStore();
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);

    useEffect(() => {
        setIsButtonDisabled(!selectedDriver);
    }, [selectedDriver]);

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

    return (
        <RideLayout title="Escolha um motorista" snapPoints={['65%', '85%']}>
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