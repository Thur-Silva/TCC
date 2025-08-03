// components/DriverRegistration/ProgressBar.tsx
import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming
} from 'react-native-reanimated';

interface ProgressBarProps {
    currentStep: number;
    totalSteps: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps }) => {
    const progressWidth = (currentStep / totalSteps) * 100;
    const animatedWidth = useSharedValue(0);
    const shimmerTranslate = useSharedValue(-100);

    useEffect(() => {
        animatedWidth.value = withTiming(progressWidth, { 
            duration: 600, 
            easing: Easing.out(Easing.cubic) 
        });
        shimmerTranslate.value = withRepeat(
            withSequence(
                withTiming(100, { duration: 1500 }),
                withTiming(-100, { duration: 0 })
            ),
            -1,
            false
        );
    }, [currentStep, progressWidth]);

    const progressStyle = useAnimatedStyle(() => ({
        width: `${animatedWidth.value}%`,
    }));

    const shimmerStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: shimmerTranslate.value }],
    }));

    return (
        <View className="mb-8">
            <Text className="text-center text-sm font-JakartaMedium text-[#1456a7] mb-2">
                Passo {currentStep} de {totalSteps}
            </Text>
            <View className="h-0.5 w-full bg-gray-200 rounded-full overflow-hidden">
                <Animated.View
                    style={[progressStyle, {
                        height: '100%',
                        backgroundColor: '#1456a7',
                        position: 'relative',
                    }]}
                >
                    <Animated.View
                        style={[shimmerStyle, {
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(255, 255, 255, 0.3)',
                            width: '30%',
                        }]}
                    />
                </Animated.View>
            </View>
        </View>
    );
};
