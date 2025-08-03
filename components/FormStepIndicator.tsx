import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';

interface FormStepIndicatorProps {
    currentStep: number;
    totalSteps: number;
    stepTitles: string[];
}

const FormStepIndicator: React.FC<FormStepIndicatorProps> = ({ currentStep, totalSteps, stepTitles }) => {
    return (
        <View className="flex-row items-center justify-between mt-4 mb-8">
            {stepTitles.map((title, index) => {
                const step = index + 1;
                const isCurrent = step === currentStep;
                const isCompleted = step < currentStep;

                return (
                    <View key={step} className="flex-1 items-center">
                        <View className={`w-8 h-8 rounded-full justify-center items-center ${isCompleted ? 'bg-green-500' : isCurrent ? 'bg-[#1456a7]' : 'bg-gray-300'}`}>
                            {isCompleted ? (
                                <Ionicons name="checkmark-outline" size={20} color="white" />
                            ) : (
                                <Text className="text-white font-JakartaBold">{step}</Text>
                            )}
                        </View>
                        <Text className={`text-xs mt-2 text-center ${isCurrent ? 'text-[#1456a7] font-JakartaBold' : 'text-gray-500'}`}>
                            {title}
                        </Text>
                    </View>
                );
            })}
        </View>
    );
};

export default FormStepIndicator;