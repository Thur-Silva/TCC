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
     icon,
     iconStyle,
     secondOption,
     firstButtonText,
     onFirstButtonPress,
     onClose,
}: ErrorModalProps) => {

    const [isErrorVisibleConst, setErrorVisibleConst] = useState(false);

    return(
        <ReactNativeModal
        isVisible={isErrorVisible}
        statusBarTranslucent={true}>
            <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px] justify-center items-center ">
                <Image source={icon ? icon : images.error} className={`w-[110px] h-[110] mx-auto xy-5 ${iconStyle}`} />

                <Text className="text-3xl font-JakartaExtraBold mb-2 mt-5 text-red-500">{title}</Text>

                <Text className="text-base text-gray-500 mt-2 font-JakartaBold">{errorMessage}</Text>

                {secondOption && (
                    <CustomButton
                        title={` ${firstButtonText ? firstButtonText : "Sim, mudar"}`}
                        className="w-full mb-5 mt-10 bg-primary-500"
                        onPress={onFirstButtonPress}
                    />
                )}
                <CustomButton title="Fechar" className={`${secondOption ? "" : "mt-10" } w-full`} bgVariant={`${secondOption? "bg-red-500" : "bg-primary-500" }`} onPress={onClose}/>
            </View>
        </ReactNativeModal>
    );  
};

export default ErrorModal;