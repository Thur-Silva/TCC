import { useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { Image, Text, View } from "react-native";

import CustomButton from "@/components/CustomButton";
import RideLayout from "@/components/RideLayout";
import SuccessModal from "@/components/SuccessModal";
import { formatTime } from "@/lib/utils";
import { useDriveStore, useLocationStore } from "@/store";
import { router } from "expo-router";
import { useEffect, useState } from "react";

const BookRide = () => {
    const { user } = useUser();
    const { userAddress, destinationAddress } = useLocationStore();
    const { drivers, selectedDriver } = useDriveStore();
    const [publicKey, setPublicKey] = useState('');
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const fetchKey = async () => {
        // Lógica para buscar a chave pública da API
    };

    const fetchPublicKey = async () => {
        // Lógica para buscar a chave pública da API
        // const key = await fetchKey();
        // setPublicKey(key!);
    };

    useEffect(() => {
        fetchPublicKey();
    }, []);

    const driverDetails = drivers?.find(
        (driver) => Number(driver.id) === selectedDriver,
    );

    const handleConfirmBooking = () => {
        // Lógica para processar a corrida...

        // Ao finalizar, mostra o modal de sucesso
        setShowSuccessModal(true);
    };

    const handleModalClose = () => {
        setShowSuccessModal(false);
        router.replace("/(root)/(tabs)/home");
    };

    return (
        <RideLayout title="Confirme sua corrida" snapPoints={['45%', '85%']}>
            <>
                {/* Informações do Motorista */}
                <View className="flex flex-col items-center justify-center my-4">
                    <View className="flex-row items-center justify-center mb-4">
                        <Image
                            source={{ uri: driverDetails?.profile_image_url! }}
                            className="w-28 h-28 rounded-full border-2 border-[#4598ff]"
                        />
                    </View>
                    <Text className="text-3xl font-JakartaExtraBold text-[#1456a7]">{driverDetails?.title}</Text>
                    <View className="flex-row items-center space-x-1 mt-2">
                        <Ionicons name="star" size={20} color="#F5B21E" />
                        <Text className="text-lg font-JakartaSemiBold text-gray-700">
                            {driverDetails?.rating || '4.5'}
                        </Text>
                    </View>
                </View>

                {/* Card de Detalhes da Corrida com Glassmorphism */}
                <View className="w-full flex-col p-5 mt-5 rounded-2xl bg-[#ffffff40] backdrop-blur-lg">
                    <Text className="text-xl font-JakartaSemiBold text-gray-800 mb-4">Detalhes da Corrida</Text>
                    <View className="flex-row items-center justify-between w-full border-b border-gray-300 py-3">
                        <Text className="text-base font-JakartaRegular text-gray-600">Preço</Text>
                        <Text className="text-lg font-JakartaBold text-green-600">
                            R$ {driverDetails?.price || '0.00'}
                        </Text>
                    </View>
                    <View className="flex-row items-center justify-between w-full border-b border-gray-300 py-3">
                        <Text className="text-base font-JakartaRegular text-gray-600">Horário Estimado</Text>
                        <Text className="text-base font-JakartaRegular text-gray-700">
                            {formatTime(driverDetails?.time || "A combinar")}
                        </Text>
                    </View>
                    <View className="flex-row items-center justify-between w-full py-3">
                        <Text className="text-base font-JakartaRegular text-gray-600">Assentos Livres</Text>
                        <Text className="text-base font-JakartaRegular text-gray-700">
                            {driverDetails?.car_seats}
                        </Text>
                    </View>
                </View>

                {/* Seção da Rota com design melhorado */}
                <View className="flex-col w-full mt-6">
                    <Text className="text-lg font-JakartaSemiBold text-[#1456a7] mb-4">Sua Rota</Text>
                    <View className="flex-row items-start border-l-2 border-dashed border-gray-400 pl-4 relative">
                        <View className="absolute left-[-12] top-[-5]">
                            <Ionicons name="location-sharp" size={24} color="#1456a7" />
                        </View>
                        <Text className="text-base font-JakartaMedium text-gray-700 mb-6">
                            {userAddress}
                        </Text>
                    </View>
                    <View className="flex-row items-start border-l-2 border-transparent pl-4 relative">
                        <View className="absolute left-[-12] top-[-5]">
                            <Ionicons name="flag-sharp" size={24} color="#4598ff" />
                        </View>
                        <Text className="text-base font-JakartaMedium text-gray-700">
                            {destinationAddress}
                        </Text>
                    </View>
                </View>

                {/* Indicador Visual da Rota no Mapa */}
                <View className="flex-row items-center justify-center mt-4 mb-2">
                    <View className="flex-row items-center bg-blue-50 px-3 py-2 rounded-full">
                        <Ionicons name="navigate" size={16} color="#4598ff" />
                        <Text className="text-sm font-JakartaMedium text-[#4598ff] ml-2">
                            Rota visualizada no mapa acima
                        </Text>
                    </View>
                </View>

                {/* Botão de Confirmação Ousado */}
                <CustomButton
                    title="Confirmar Corrida"
                    onPress={handleConfirmBooking}
                    className="mt-6 bg-[#1456a7] shadow-lg"
                    textClassName="font-JakartaExtraBold text-lg"
                />
            </>
            {/* Modal de Sucesso */}
            <SuccessModal
                ShowSuccessModal={showSuccessModal}
                title="Corrida Solicitada!"
                description={`Sua corrida com ${driverDetails?.title} foi solicitada. O motorista aceitará em breve.`}
                onClose={handleModalClose}
                link="/(root)/(tabs)/home"
            />
        </RideLayout>
    );
};

export default BookRide;