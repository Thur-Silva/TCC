import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { ReactNativeModal } from 'react-native-modal';

interface TooltipProps {
    message: string;
}

const Tooltip: React.FC<TooltipProps> = ({ message }) => {
    const [isVisible, setIsVisible] = React.useState(false);

    return (
        <View>
            <TouchableOpacity onPress={() => setIsVisible(true)} className="ml-2">
                <Ionicons name="information-circle-outline" size={20} color="#1456a7" />
            </TouchableOpacity>

            <ReactNativeModal
                isVisible={isVisible}
                onBackdropPress={() => setIsVisible(false)}
                animationIn="fadeIn"
                animationOut="fadeOut"
                className="justify-center items-center"
            >
                <View className="bg-white p-4 rounded-xl max-w-[80%]">
                    <Text className="text-sm text-gray-700 font-JakartaRegular">{message}</Text>
                    <TouchableOpacity onPress={() => setIsVisible(false)} className="mt-3 self-end">
                        <Text className="text-[#1456a7] font-JakartaBold">Fechar</Text>
                    </TouchableOpacity>
                </View>
            </ReactNativeModal>
        </View>
    );
};

export default Tooltip;