import CustomButton from "@/components/CustomButton";
import { images } from "@/constants";
import { useState } from "react";
import { Image, Text, View } from "react-native";
import { ReactNativeModal } from "react-native-modal";
import { ErrorModalProps } from "types/types";

// Observação: É uma boa prática definir a interface `ErrorModalProps` em seu arquivo `types/types.ts`
// para que o TypeScript a reconheça globalmente.

const ErrorModal = ({
    title = 'Algo está fora do esperado',
    isErrorVisible,
    errorMessage,
    icon,
    iconStyle,
    secondOption,
    firstButtonText,
    onFirstButtonPress,
    secondButtonText,
    onSecondButtonPress,
    onClose,
}: ErrorModalProps) => {

    const [isErrorVisibleConst, setErrorVisibleConst] = useState(false);

    return (
        <ReactNativeModal
            isVisible={isErrorVisible}
            statusBarTranslucent={true}>
            <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px] justify-center items-center ">
                <Image source={icon ? icon : images.error} className={`w-[110px] h-[110px] mx-auto xy-5 ${iconStyle}`} />

                <Text className="text-3xl font-JakartaExtraBold mb-2 mt-5 text-red-500">{title}</Text>

                <Text className="text-base text-gray-500 mt-2 font-JakartaBold">{errorMessage}</Text>

                {secondOption && (
                    <CustomButton
                        // CORREÇÃO: Garante que o título é sempre uma string
                        title={firstButtonText ?? "Sim, continuar"}
                        className="w-full mb-5 mt-10 bg-primary-500"
                        onPress={onFirstButtonPress}
                    />
                )}

                <CustomButton
                    // CORREÇÃO: Garante que o título é sempre uma string
                    title={secondOption ? (secondButtonText ?? "Cancelar") : "Fechar"}
                    className={`${secondOption ? "" : "mt-10"} w-full`}
                    bgVariant={`${secondOption ? "bg-red-500" : "bg-primary-500"}`}
                    // CORREÇÃO: Usa onSecondButtonPress para o segundo botão, e onClose para o botão único
                    onPress={secondOption ? onSecondButtonPress : onClose}
                />
            </View>
        </ReactNativeModal>
    );
};

export default ErrorModal;