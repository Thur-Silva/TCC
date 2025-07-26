import CustomButton from "@/components/CustomButton";
import { images } from "@/constants";
import { SuccessModalProps } from "@/types/types";
import { router } from "expo-router";
import { useState } from "react";
import { Image, Text, View } from "react-native";
import { ReactNativeModal } from "react-native-modal";

const SuccessModal = ({
     ShowSuccessModal,
     title ='Sucesso!',
     description,
     onClose,
     ButtomText = 'Ok',
     ButtomOnPress,
     link,
}: SuccessModalProps) => {

    const [isErrorVisibleConst, setErrorVisibleConst] = useState(false);

    const SwapScrens = (adress: any)=>{
        router.push(adress);
    }

    return(
            <ReactNativeModal 
            isVisible ={ ShowSuccessModal }
            statusBarTranslucent={true}>
                    <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px] items-center">
                        <Image source={images.check} className="w-[110px] h-[110] mx-auto xy-5"/>

                        <Text className="text-3xl mt-7 font-JakartaBold">
                            {title}
                        </Text>

                         <Text className="text-base text-gray-500 mt-2 font-JakartaBold">
                           {description}
                        </Text>

                        <CustomButton
                        title={ButtomText}
                        className="p-2 w-[100px] mt-10"
                        onPress={()=>{
                            onClose;
                            
                            if(link){
                                SwapScrens(link);
                            }
                        }}
                        />
                    </View>
             </ReactNativeModal>
    );  
};

export default SuccessModal;