// components/DriverRegistration/ImageUploadButton.tsx
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withSequence,
    withTiming
} from 'react-native-reanimated';

interface ImageUploadButtonProps {
    label: string;
    uri: string | null;
    onPress: () => Promise<void>;
    error?: string;
    iconName: keyof typeof Ionicons.glyphMap;
    type?: 'circular' | 'rectangular';
}

export const ImageUploadButton: React.FC<ImageUploadButtonProps> = ({
    label,
    uri,
    onPress,
    error,
    iconName,
    type = 'circular'
}) => {
    const iconScale = useSharedValue(1);
    const imageOpacity = useSharedValue(0);
    const imageScale = useSharedValue(0.8);
    const checkOpacity = useSharedValue(0);

    const isCircular = type === 'circular';

    const handlePress = async () => {
        iconScale.value = withSequence(
            withTiming(1.2, { duration: 100 }),
            withTiming(1, { duration: 100 })
        );
        await onPress();
    };

    useEffect(() => {
        if (uri) {
            imageOpacity.value = withTiming(1, { 
                duration: 500, 
                easing: Easing.out(Easing.quad) 
            });
            imageScale.value = withTiming(1, { 
                duration: 500, 
                easing: Easing.out(Easing.quad) 
            });
            checkOpacity.value = withSequence(
                withTiming(0, { duration: 0 }),
                withTiming(1, { duration: 300, easing: Easing.out(Easing.quad) })
            );
        } else {
            imageOpacity.value = withTiming(0, { duration: 200 });
            imageScale.value = withTiming(0.8, { duration: 200 });
            checkOpacity.value = withTiming(0, { duration: 200 });
        }
    }, [uri]);

    const iconAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: iconScale.value }],
    }));

    const imageAnimatedStyle = useAnimatedStyle(() => ({
        opacity: imageOpacity.value,
        transform: [{ scale: imageScale.value }],
    }));

    const checkAnimatedStyle = useAnimatedStyle(() => ({
        opacity: checkOpacity.value,
    }));

    const getContainerStyle = () => ({
        borderColor: error ? '#ef4444' : uri ? '#10b981' : '#d1d5db',
        backgroundColor: '#eef5ff',
        ...(isCircular ? {
            width: 128,
            height: 128,
            borderRadius: 64,
            borderWidth: 3,
        } : {
            width: 200,
            height: 128,
            borderRadius: 16,
            borderWidth: 2,
            borderStyle: uri ? 'solid' : 'dashed',
        })
    });

    const renderContent = () => {
        if (!uri) {
            return (
                <Animated.View style={iconAnimatedStyle}>
                    <Ionicons name={iconName} size={isCircular ? 60 : 50} color="#9ca3af" />
                </Animated.View>
            );
        }

        return (
            <>
                <Animated.View style={[imageAnimatedStyle, { width: '100%', height: '100%' }]}>
                    <Image
                        source={{ uri }}
                        className="w-full h-full"
                        resizeMode="cover"
                    />
                </Animated.View>
                <Animated.View
                    style={[checkAnimatedStyle, {
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        backgroundColor: '#10b981',
                        borderRadius: 12,
                        width: 24,
                        height: 24,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }]}
                >
                    <Ionicons name="checkmark" size={16} color="white" />
                </Animated.View>
            </>
        );
    };

    const getErrorMessage = () => {
        if (!error) return null;
        
        const message = error.includes('obrigatória') 
            ? `A ${label.toLowerCase()} é obrigatória e deve estar legível.`
            : error;

        return (
            <View className="flex-row items-center mt-2 max-w-[200px]">
                <Ionicons name="alert-circle-outline" size={16} color="#ef4444" />
                <Text className="text-red-400 text-sm font-JakartaRegular ml-1 text-center flex-1">
                    {message}
                </Text>
            </View>
        );
    };

    return (
        <View className="items-center mb-8">
            <TouchableOpacity
                onPress={handlePress}
                activeOpacity={0.7}
                style={[styles.uploadButton, getContainerStyle()]}
                className="justify-center items-center overflow-hidden relative"
            >
                {renderContent()}
            </TouchableOpacity>
            <Text className="text-sm mt-3 text-gray-600 font-JakartaRegular text-center">
                {label}
            </Text>
            {getErrorMessage()}
        </View>
    );
};

const styles = StyleSheet.create({
    uploadButton: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
    },
});