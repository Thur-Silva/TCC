// components/DriverRegistration/StepContainer.tsx
import React from 'react';
import { ScrollView } from 'react-native';
import Animated from 'react-native-reanimated';

interface StepContainerProps {
    children: React.ReactNode;
    animatedStyle: any;
}

export const StepContainer: React.FC<StepContainerProps> = ({ children, animatedStyle }) => {
    return (
        <Animated.View style={animatedStyle} className="flex-1">
            <ScrollView 
                className="flex-1 px-8" 
                contentContainerStyle={{ paddingBottom: 40 }}
                showsVerticalScrollIndicator={false}
            >
                {children}
            </ScrollView>
        </Animated.View>
    );
};