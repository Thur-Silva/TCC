import ProfileLayout from "@/components/profilesLayout";
import { icons } from '@/constants';
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, SafeAreaView, Text, View } from "react-native";

const IndividualProfile = () => {
  // MODIFICAÇÃO: Extraímos 'clerkId' e 'partnerId' dos parâmetros locais.
  const { partnerId, clerkId } = useLocalSearchParams<{ partnerId: string, clerkId: string }>();
  console.warn("IDs do usuário recebidos:", { partnerId, clerkId });

  const [userProfile, setUserProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      setIsLoading(true);
      setIsError(false);
      setUserProfile(null);

      // MODIFICAÇÃO: A verificação agora usa 'clerkId'.
      if (!clerkId) {
        setErrorMessage("ID do perfil não foi fornecido.");
        setIsError(true);
        setIsLoading(false);
        return;
      }

      try {
        // MODIFICAÇÃO: A chamada da API agora usa o 'clerkId' extraído.
        console.warn("Buscando perfil do usuário com clerkId:", clerkId);
        const response = await fetch(`/(api)/user?clerkId=${clerkId}`);
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
  }, [clerkId]); // MODIFICAÇÃO: O useEffect agora depende de 'clerkId'.

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
        // CORREÇÃO: Usamos o operador OR (||) para fornecer um fallback.
        // Se userProfile.user_image_url não existir, icons.defaultUser será usado.
        userImageUrl={userProfile.user_image_url || icons.defaultUser} 
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