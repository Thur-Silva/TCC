// components/DriverRegistration/ActionButton.tsx
import React, { useEffect } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming
} from 'react-native-reanimated';

interface ActionButtonProps {
    title: string | React.ReactNode;
    onPress: () => void;
    className?: string;
    disabled: boolean;
    variant?: 'primary' | 'secondary' | 'loading';
}

export const ActionButton: React.FC<ActionButtonProps> = ({ 
    title, 
    onPress, 
    className = '', 
    disabled, 
    variant = 'primary'
}) => {
    const pulseOpacity = useSharedValue(1);

    useEffect(() => {
        if (variant === 'loading') {
            pulseOpacity.value = withRepeat(
                withSequence(
                    withTiming(0.6, { duration: 800 }),
                    withTiming(1, { duration: 800 })
                ),
                -1,
                false
            );
        } else {
            pulseOpacity.value = withTiming(1, { duration: 200 });
        }
    }, [variant]);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: pulseOpacity.value,
    }));

    const getButtonStyle = () => {
        if (disabled && variant !== 'loading') {
            return 'bg-gray-300';
        }
        return variant === 'secondary' ? 'bg-gray-500' : 'bg-[#1456a7]';
    };

    const getTextStyle = () => {
        if (disabled && variant !== 'loading') {
            return 'text-gray-500';
        }
        return 'text-white';
    };

    const renderTitle = () => {
        return typeof title === 'string' ? (
            <Text className={`${getTextStyle()} font-JakartaExtraBold text-xl`}>
                {title}
            </Text>
        ) : (
            title
        );
    };

    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.8}
            disabled={disabled}
            className={`flex-row justify-center items-center p-4 rounded-xl ${getButtonStyle()} ${className}`}
        >
            <Animated.View style={animatedStyle} className="flex-row justify-center items-center">
                {renderTitle()}
            </Animated.View>
        </TouchableOpacity>
    );
};