import ProfileLayout from "@/components/profilesLayout";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, SafeAreaView, Text, View } from "react-native";

const IndividualProfile = () => {
  const { partnerId } = useLocalSearchParams<{ partnerId: string }>();
  console.warn("ID do usuário recebido:", partnerId);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      setIsLoading(true);
      setIsError(false);
      setUserProfile(null);

      // Agora a verificação usa o novo nome da propriedade
      if (!partnerId) {
        setErrorMessage("ID do perfil não foi fornecido.");
        setIsError(true);
        setIsLoading(false);
        return;
      }

      try {
        // A chamada da API também foi ajustada para usar o novo nome
        console.warn("Buscando perfil do usuário com ID:", partnerId);
        const response = await fetch(`/(api)/user?clerkId=${partnerId}`);
        const data = await response.json();

        if (response.ok) {
          if (data.data) {
            setUserProfile(data.data);
          } else {
            setErrorMessage("Perfil não encontrado.");
            setIsError(true);
          }
        } else {
          setErrorMessage(data.error || "Erro ao carregar o perfil.");
          setIsError(true);
        }
      } catch (err) {
        console.error("Erro ao buscar perfil:", err);
        setErrorMessage("Não foi possível conectar ao servidor.");
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserProfile();
  }, [partnerId]); // O useEffect agora depende de 'userId'

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#0000ff" />
        <Text className="mt-4 text-gray-500">Carregando perfil...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-xl font-JakartaSemiBold text-red-500 mb-2">Ops!</Text>
        <Text className="text-lg text-gray-700 text-center px-5">{errorMessage}</Text>
      </View>
    );
  }

  const onSave = () => {
    console.log("Não é possível salvar alterações em um perfil público.");
  };

  return (
    <SafeAreaView className="flex-1 bg-blue-50">
      <ProfileLayout
        userEmail={userProfile.email}
        userImageUrl={userProfile.user_image_url} 
        userName={userProfile.name}
        userBirthDate="Não informado" 
        userCountry="Não informado"
        userGender="Não informado"
        onSave={onSave}
        publicPerfil={true}
      />
    </SafeAreaView>
  );
};

export default IndividualProfile;