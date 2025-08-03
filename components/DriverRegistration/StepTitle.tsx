// components/DriverRegistration/StepTitle.tsx
import React from 'react';
import { Text } from 'react-native';

interface StepTitleProps {
    title: string;
}

export const StepTitle: React.FC<StepTitleProps> = ({ title }) => {
    return (
        <Text className="text-3xl font-JakartaExtraBold mb-6 text-[#1456a7]">
            {title}
        </Text>
    );
};