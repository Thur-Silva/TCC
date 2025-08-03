import HomeHeader from "@/components/HomeHeader";
import ProfileLayout from "@/components/profilesLayout";
import { useUser } from "@clerk/clerk-expo";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";

const Profile = () => {
  // Use o hook useUser para obter os dados do usuário do Clerk
  const { isLoaded, user } = useUser();

  // Exibe um indicador de carregamento enquanto os dados do usuário estão sendo buscados
  if (!isLoaded || !user) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#0000ff" />
        <Text className="mt-4 text-gray-500">Carregando perfil...</Text>
      </View>
    );
  }

  // Define os valores dos campos com base nos dados do usuário
  // e fornece um valor padrão se a informação não existir.
  const userName = user.fullName || user.username || "Nome não informado";
  const userEmail = user.primaryEmailAddress?.emailAddress || "E-mail não informado";
  
  // A imagem será passada e o componente ProfileLayout irá lidar com a imagem padrão
  const userImageUrl = user.imageUrl; 

  // Campos condicionais que assumimos estarem nos metadados do Clerk
  const userBirthDate = (user.unsafeMetadata?.birthDate as string) || "Não informado";
  const userCountry = (user.unsafeMetadata?.country as string) || "Não informado";
  const userGender = (user.unsafeMetadata?.gender as string) || "Não informado";

  // TODO: Adicionar a lógica para salvar o perfil no banco de dados.
  const handleSave = () => {
    console.log("Salvar perfil");
  };

  return (
    <ScrollView className="flex-1 bg-blue-50">
      <View className="absolute top-0 left-0 right-0 z-10">
        <HomeHeader showInput={false} globalClassName="py-10"/>
      </View>
      <ProfileLayout
        userName={userName}
        userEmail={userEmail}
        userImageUrl={userImageUrl}
        userBirthDate={userBirthDate}
        userCountry={userCountry}
        userGender={userGender}
        onSave={handleSave}
        publicPerfil={false}
      />
    </ScrollView>
  );
};

export default Profile;