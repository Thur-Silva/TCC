import CustomButton from "@/components/CustomButton";
import { images } from "@/constants";
import { useState } from "react";
import { Image, Text, View } from "react-native";
import { ReactNativeModal } from "react-native-modal";
import { ErrorModalProps } from "types/types";

const ErrorModal = ({
     title = 'Algo está fora do esperado', 
     isErrorVisible,
     errorMessage,
     onClose,
}: ErrorModalProps) => {

    const [isErrorVisibleConst, setErrorVisibleConst] = useState(false);

    return(
        <ReactNativeModal
        isVisible={isErrorVisible}
        statusBarTranslucent={true}>
            <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
                <Image source={images.error} className="w-[110px] h-[110] mx-auto xy-5" />
                <Text className="text-3xl font-JakartaExtraBold mb-2 mt-5 text-red-500">{title}</Text>
                <Text className="text-base text-gray-500 mt-2 font-JakartaBold">{errorMessage}</Text>
                <CustomButton title="Fechar" className="mt-10" onPress={onClose}/>
            </View>
        </ReactNativeModal>
    );  
};

export default ErrorModal;