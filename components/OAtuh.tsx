import { icons } from "@/constants";
import { Image, Text, View } from "react-native";
import CustomButton from "./CustomButton";

const OAuth = () =>{
    const hadleGoogleSignIn = async () =>{

    }
    return(
        <View>
        <View className="flex flex-row justify-center items-center mt-4 gap-x-3">
            <View className="flex-1 h-[1px] bg-general-100" />
            <Text className="text-lg">ou</Text>
            <View className="flex-1 h-[1px] bg-general-100" />
        </View>

        <CustomButton
        title="Entre com Google"
        className="mt-5 w-full shadow-none p-3"
        bgVariant="secondary"
        IconLeft={()=>(
            <Image source={icons.google} resizeMode="contain" className="w-5 h-5 mx-2 ml-[-20] mr-5"/>
        )} 
        onPress={hadleGoogleSignIn}
        />

    </View>
    );
}
   
export default OAuth;