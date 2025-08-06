import CustomButton from "@/components/CustomButton";
import GoogleTextInput from "@/components/GoogleTextInput";
import RideLayout from "@/components/RideLayout";
import { icons } from "@/constants";
import { useLocationStore } from "@/store";
import { router } from "expo-router";
import { ScrollView, Text, View } from "react-native";

const FindRide = () => {
    const { 
        userAddress, 
        destinationAddress, 
        setDestinationLocation, 
        setUserLocation,
        userLatitude,
        userLongitude,
        destinationLatitude,
        destinationLongitude
    } = useLocationStore();

    // Debug: Log das coordenadas atuais
    console.log('FindRide - User:', userLatitude, userLongitude);
    console.log('FindRide - Destination:', destinationLatitude, destinationLongitude);

    const handleBuscar = () => {
        // Verifica se temos as coordenadas necessárias antes de navegar
        if (!userLatitude || !userLongitude) {
            console.warn('Localização do usuário não definida');
            // Você pode mostrar um alerta aqui
            return;
        }
        
        if (!destinationLatitude || !destinationLongitude) {
            console.warn('Destino não definido');
            // Você pode mostrar um alerta aqui
            return;
        }

        console.log('Navegando para confirm-ride com coordenadas válidas');
        router.push("/(root)/confirm-ride");
    };

    return (
        <ScrollView>
            <RideLayout title="Encontre uma Carona" snapPoints={["85%"]}>
                <View className="my-3">
                    <Text className="text-2xl font-JakartaSemiBold">Partindo de</Text>
                    <GoogleTextInput 
                        icon={icons.target} 
                        initialLocation={userAddress!} 
                        containerStyle="bg-neutral-100 mt-[20]"
                        textInputBackgroundColor="#f5f5f5"
                        handlePress={(location) => {
                            console.log('Localização do usuário selecionada:', location);
                            setUserLocation(location);
                        }}
                    />
                </View>

                <View className="my-3">
                    <Text className="text-2xl font-JakartaSemiBold mt-10">Indo Para</Text>
                    <GoogleTextInput 
                        icon={icons.map} 
                        initialLocation={destinationAddress!} 
                        containerStyle="bg-neutral-100 mt-[20]"
                        textInputBackgroundColor="transparent"
                        handlePress={(location) => {
                            console.log('Destino selecionado:', location);
                            setDestinationLocation(location);
                        }}
                    />
                </View>

                <CustomButton 
                    title="Buscar" 
                    onPress={handleBuscar}
                    className="mt-10"
                />
            </RideLayout>
        </ScrollView>
    );
};
 
export default FindRide;