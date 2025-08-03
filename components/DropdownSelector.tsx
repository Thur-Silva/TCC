import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { ReactNativeModal } from 'react-native-modal';

interface DropdownSelectorProps {
    label: string;
    value: string;
    options: string[];
    onSelect: (option: string) => void;
}

const DropdownSelector: React.FC<DropdownSelectorProps> = ({ label, value, options, onSelect }) => {
    const [isModalVisible, setModalVisible] = useState(false);

    const handleSelect = (option: string) => {
        onSelect(option);
        setModalVisible(false);
    };

    return (
        <View className="mb-4">
            <Text className="text-gray-500 font-JakartaBold mb-2">{label}</Text>
            <TouchableOpacity
                onPress={() => setModalVisible(true)}
                className="flex-row items-center justify-between p-4 rounded-xl bg-[#eef5ff] text-[#1456a7] font-JakartaRegular"
            >
                <Text className="text-[#1456a7]">{value || 'Selecione uma opção'}</Text>
                <Ionicons name="chevron-down" size={20} color="#1456a7" />
            </TouchableOpacity>

            <ReactNativeModal
                isVisible={isModalVisible}
                onBackdropPress={() => setModalVisible(false)}
            >
                <View className="bg-white p-5 rounded-xl">
                    {options.map((option, index) => (
                        <TouchableOpacity
                            key={index}
                            onPress={() => handleSelect(option)}
                            className="p-3 border-b border-gray-200 last:border-b-0"
                        >
                            <Text className="text-lg font-JakartaRegular">{option}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </ReactNativeModal>
        </View>
    );
};

export default DropdownSelector;
