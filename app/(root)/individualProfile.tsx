import ProfileLayout from "@/components/profilesLayout";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native";

const onSave =()=>{

}

const IndividualProfile =()=>{
     const {
        partnerId,
      } = useLocalSearchParams<{
        partnerId: string;
      }>();
    
    return(
      <SafeAreaView>
                     <ProfileLayout
                      userEmail=""
                      userImageUrl=""
                      userName=""
                      onSave={onSave}
                      publicPerfil
                      />
      </SafeAreaView>
    );
}

export default IndividualProfile;