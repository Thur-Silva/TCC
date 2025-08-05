import ProfileLayout from "@/components/profilesLayout";
import { icons } from '@/constants';
import { fetchAPI } from "@/lib/fecth";

import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, SafeAreaView, Text, View } from "react-native";

// Definição de tipo para os dados do usuário no banco de dados
interface DbUser {
  id: string;
  clerk_id: string;
  name: string;
  email: string;
  profile_img: string;
  birth_date: string;
  gender: string;
  bio: string;
  created_at: string;
}

const IndividualProfile = () => {
  const { clerkId } = useLocalSearchParams<{ clerkId: string }>();

  const [userProfile, setUserProfile] = useState<DbUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Função auxiliar para formatar a data para DD/MM/YYYY
  const formatDateForDisplay = (dateString: string | undefined | null): string => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "";
    }
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      setIsLoading(true);
      setIsError(false);
      setUserProfile(null);

      if (!clerkId) {
        setErrorMessage("ID do perfil não foi fornecido.");
        setIsError(true);
        setIsLoading(false);
        return;
      }

      try {
        const result = await fetchAPI(`/(api)/user?clerkId=${clerkId}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (result.data) {
          setUserProfile(result.data);
        } else {
          setErrorMessage("Perfil não encontrado.");
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
  }, [clerkId]);

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

  if (!userProfile) {
      return (
          <View className="flex-1 justify-center items-center bg-white">
              <Text>Perfil não encontrado.</Text>
          </View>
      )
  }

  return (
    <SafeAreaView className="flex-1 bg-blue-50">
      <ProfileLayout
        userEmail={userProfile.email || "Não informado"}
        userImageUrl={userProfile.profile_img || icons.defaultUser} 
        userName={userProfile.name || "Não informado"}
        userBirthDate={formatDateForDisplay(userProfile.birth_date)} 
        userGender={userProfile.gender || "Não informado"}
        userBio={userProfile.bio || "Sem biografia"}
        onSave={onSave}
        publicPerfil={true}
        clerkId={userProfile.clerk_id}
      />
    </SafeAreaView>
  );
};

export default IndividualProfile;
