// components/DriverRegistration/ErrorDisplay.tsx
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';

interface ErrorDisplayProps {
    error?: string;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error }) => {
    if (!error) return null;

    return (
        <View className="flex-row items-center mt-1">
            <Ionicons name="alert-circle-outline" size={16} color="#ef4444" />
            <Text className="text-red-400 text-sm font-JakartaRegular ml-1">
                {error}
            </Text>
        </View>
    );
};