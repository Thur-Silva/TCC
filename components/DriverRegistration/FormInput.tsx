// components/DriverRegistration/FormInput.tsx
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { TextInputMask, TextInputMaskTypeProp } from 'react-native-masked-text';

interface FormInputProps {
    label: string;
    placeholder: string;
    value: string;
    onChangeText: (text: string) => void;
    error?: string;
    keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
    multiline?: boolean;
    textAlignVertical?: 'auto' | 'top' | 'bottom' | 'center';
    maskType?: TextInputMaskTypeProp;
    options?: any;
    helpText?: string;
}

export const FormInput: React.FC<FormInputProps> = ({
    label,
    placeholder,
    value,
    onChangeText,
    error,
    keyboardType = 'default',
    multiline = false,
    textAlignVertical = 'auto',
    maskType,
    options,
    helpText,
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const [hasBlurred, setHasBlurred] = useState(false);

    const handleFocus = () => setIsFocused(true);
    
    const handleBlur = () => {
        setIsFocused(false);
        setHasBlurred(true);
    };

    const shouldShowError = error && hasBlurred;

    const getBorderStyle = () => {
        if (shouldShowError) return '#ef4444';
        if (isFocused) return '#1456a7';
        return '#e5e7eb';
    };

    const getBorderWidth = () => isFocused ? 2 : 1;

    const renderInput = () => {
        const commonProps = {
            placeholder,
            value,
            onChangeText,
            onFocus: handleFocus,
            onBlur: handleBlur,
            keyboardType,
            className: "text-[#1456a7] font-JakartaRegular text-base",
            placeholderTextColor: "#9ca3af",
            multiline,
            textAlignVertical,
            style: { minHeight: multiline ? 80 : 24 }
        };

        return maskType ? (
            <TextInputMask
                type={maskType}
                options={options}
                {...commonProps}
            />
        ) : (
            <TextInput {...commonProps} />
        );
    };

    return (
        <View className="w-full mb-6">
            <Text className="text-base font-JakartaSemiBold text-[#1456a7] mb-2">
                {label}
            </Text>
            <View
                style={[
                    styles.inputContainer,
                    {
                        borderColor: getBorderStyle(),
                        borderWidth: getBorderWidth(),
                    }
                ]}
                className="rounded-xl bg-[#eef5ff] p-4"
            >
                {renderInput()}
            </View>
            {helpText && !shouldShowError && (
                <Text className="text-sm font-JakartaLight text-gray-500 mt-1">
                    {helpText}
                </Text>
            )}
            {shouldShowError && (
                <View className="flex-row items-center mt-1">
                    <Ionicons name="alert-circle-outline" size={16} color="#ef4444" />
                    <Text className="text-red-400 text-sm font-JakartaRegular ml-1">
                        {error}
                    </Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    inputContainer: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
});