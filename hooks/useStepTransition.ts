// hooks/useStepTransition.ts
import { Easing, useAnimatedStyle, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';

export const useStepTransition = () => {
    const stepAnimation = useSharedValue(0);

    const animatedStepStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: stepAnimation.value }],
        opacity: stepAnimation.value === 0 ? 1 : 0.7,
    }));

    const transitionToNext = (callback: () => void) => {
        stepAnimation.value = withSequence(
            withTiming(-300, { duration: 350, easing: Easing.inOut(Easing.cubic) }),
            withTiming(300, { duration: 0 }),
            withTiming(0, { duration: 350, easing: Easing.inOut(Easing.cubic) })
        );
        callback();
    };

    const transitionToPrevious = (callback: () => void) => {
        stepAnimation.value = withSequence(
            withTiming(300, { duration: 350, easing: Easing.inOut(Easing.cubic) }),
            withTiming(-300, { duration: 0 }),
            withTiming(0, { duration: 350, easing: Easing.inOut(Easing.cubic) })
        );
        callback();
    };

    return {
        animatedStepStyle,
        transitionToNext,
        transitionToPrevious
    };
};