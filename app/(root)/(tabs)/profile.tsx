import HomeHeader from "@/components/HomeHeader";
import LoadingLayout from "@/components/loadingLayout";
import ProfileLayout from "@/components/profilesLayout";
import { fetchAPI } from "@/lib/fecth";
import { useUser } from "@clerk/clerk-expo";
import { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";


// Definição de tipo para os dados do usuário no banco de dados
interface DbUser {
  id: string;
  clerk_id: string;
  name: string;
  profile_img: string;
  birth_date: string;
  gender: string;
  bio: string;
  created_at: string;
}

const Profile = () => {
  // Use o hook useUser para obter os dados do usuário do Clerk
  const { isLoaded, user } = useUser();
  const [dbUserData, setDbUserData] = useState<DbUser | null>(null);
  const [isDbDataLoaded, setIsDbDataLoaded] = useState(false);

  useEffect(() => {
    // Busca dados do usuário no banco de dados apenas quando o user do Clerk está carregado
    const fetchUserData = async () => {
      if (!user) return;

      try {
        console.log(`Fetching user data from DB for Clerk ID: ${user?.id}`);
        // A função fetchAPI agora assume a responsabilidade de verificar se a resposta é 'ok'
        // e retorna diretamente os dados JSON ou lança um erro.
        const result = await fetchAPI(`/(api)/user?clerkId=${user?.id}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        
        setDbUserData(result.data);
      } catch (err) {
        console.log("Error fetching user data from DB:", err);
        // Em caso de erro (ex: usuário não existe no DB),
        // continuamos com os dados do Clerk e campos vazios
        setDbUserData({} as DbUser);
      } finally {
        setIsDbDataLoaded(true);
      }
    };
    
    if (isLoaded && user) {
      fetchUserData();
    }
  }, [isLoaded, user]);

  // Exibe um indicador de carregamento enquanto os dados do Clerk OU do DB estão sendo buscados
  if (!isLoaded || !user || !isDbDataLoaded) {
    return ( 
      <View className="">
        <View className="absolute top-0 left-0 right-0 z-10">
          <HomeHeader showInput={false} globalClassName="py-10"/>
        </View>
        <View className="flex-1 justify-center items-center bg-white">
          <LoadingLayout/>
        </View>
      </View>
    );
  }
  
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

  // Define os valores dos campos com base nos dados do DB (prioridade) e do Clerk (fallback)
  const userName = dbUserData?.name || user.fullName || user.username || "Nome não informado";
  const userEmail = user.primaryEmailAddress?.emailAddress || "E-mail não informado";
  const userImageUrl = dbUserData?.profile_img || user.imageUrl; 
  const userBirthDate = formatDateForDisplay(dbUserData?.birth_date);
  const userGender = dbUserData?.gender || "";
  const userBio = dbUserData?.bio || "";
  const clerkId = user.id;

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
        userGender={userGender}
        userBio={userBio}
        onSave={handleSave}
        publicPerfil={false}
        clerkId={clerkId}
      />
    </ScrollView>
  );
};

export default Profile;
