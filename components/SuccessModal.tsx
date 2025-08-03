import CustomButton from "@/components/CustomButton";
import { images } from "@/constants";
import { SuccessModalProps } from "@/types/types";
import { router } from "expo-router";
import { Image, Text, View } from "react-native";
import { ReactNativeModal } from "react-native-modal";

const SuccessModal = ({
    ShowSuccessModal,
    title = 'Sucesso!',
    description,
    onClose,
    ButtomText = 'Ok',
    ButtomOnPress,
    link,
}: SuccessModalProps) => {

    const handleButtonPress = () => {
        if (ButtomOnPress) {
            ButtomOnPress();
        }

        if (link) {
            router.push(link);
        }

        // Garante que a função onClose seja chamada
        if (onClose) {
            onClose();
        }
    };

    return (
        <ReactNativeModal
            isVisible={ShowSuccessModal}
            statusBarTranslucent={true}
            animationIn="zoomIn" // Animação de entrada
            animationOut="zoomOut" // Animação de saída
        >
            <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px] items-center">
                <Image
                    source={images.check}
                    className="w-[110px] h-[110px] mx-auto mb-5"
                />

                <Text className="text-3xl font-JakartaBold text-[#1456a7] mt-7 text-center">
                    {title}
                </Text>

                <Text className="text-base text-gray-500 mt-2 font-JakartaMedium text-center">
                    {description}
                </Text>

                <CustomButton
                    title={ButtomText}
                    className="p-2 mt-10 w-40"
                    onPress={handleButtonPress}
                />
            </View>
        </ReactNativeModal>
    );
};

export default SuccessModal;