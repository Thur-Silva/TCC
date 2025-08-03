// driverRegistrationScreen.jsx
import DropdownSelector from '@/components/DropdownSelector';
import ErrorModal from '@/components/ErrorModal';
import SuccessModal from '@/components/SuccessModal';
import Tooltip from '@/components/Tooltip';
import { useDriverRegistrationForm } from '@/hooks/useDriverRegistrationForm';
import { useImageUpload } from '@/hooks/useImageUpload';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, Image, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { TextInputMask, TextInputMaskTypeProp } from 'react-native-masked-text';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withSequence,
    withTiming
} from 'react-native-reanimated';

// ------------------------------------------------------------------
// TIPAGENS DOS COMPONENTES
// ------------------------------------------------------------------
interface AnimatedProgressBarProps {
    currentStep: number;
    totalSteps: number;
}

interface AnimatedInputProps {
    placeholder: string;
    value: string;
    onChangeText: (text: string) => void;
    error?: string;
    keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
    multiline?: boolean;
    textAlignVertical?: 'auto' | 'top' | 'bottom' | 'center';
    maskType?: TextInputMaskTypeProp;
    options?: any;
}

interface AnimatedImageUploadButtonProps {
    label: string;
    uri: string | null;
    onPress: () => Promise<void>;
    error?: string;
    iconName: keyof typeof Ionicons.glyphMap;
    className?: string;
    type?: 'circular' | 'rectangular';
}

interface AnimatedButtonProps {
    title: string | React.ReactNode;
    onPress: () => void;
    className?: string;
    disabled: boolean;
    bgVariant?: string;
}

// ------------------------------------------------------------------
// COMPONENTES COM ANIMAÇÕES
// ------------------------------------------------------------------

// Componente para a barra de progresso animada
const AnimatedProgressBar: React.FC<AnimatedProgressBarProps> = ({ currentStep, totalSteps }) => {
    const progressWidth = (currentStep / totalSteps) * 100;
    const animatedWidth = useSharedValue(0);

    useEffect(() => {
        animatedWidth.value = withTiming(progressWidth, { duration: 500 });
    }, [currentStep, progressWidth]);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            width: `${animatedWidth.value}%`,
        };
    });

    return (
        <View className="h-1 w-full bg-gray-300 rounded-full overflow-hidden mb-8">
            <Animated.View
                style={[animatedStyle, {
                    height: '100%',
                    backgroundColor: '#1456a7'
                }]}
            />
        </View>
    );
};

// Componente de input animado com label flutuante
const AnimatedInput: React.FC<AnimatedInputProps> = ({
    placeholder,
    value,
    onChangeText,
    error,
    keyboardType = 'default',
    multiline = false,
    textAlignVertical = 'auto',
    maskType,
    options,
}) => {
    const isFocused = useSharedValue(false);
    const labelOpacity = useSharedValue(0);

    // Animação da sombra/brilho
    const shadowOffset = useSharedValue({ width: -5, height: -5 });
    const shadowOpacity = useSharedValue(0.2);

    const handleFocus = () => {
        isFocused.value = true;
        labelOpacity.value = withTiming(1, { duration: 200 });
        shadowOffset.value = withTiming({ width: 0, height: 0 }, { duration: 200 });
        shadowOpacity.value = withTiming(0.4, { duration: 200 });
    };

    const handleBlur = () => {
        isFocused.value = false;
        if (!value) {
            labelOpacity.value = withTiming(0, { duration: 200 });
        }
        shadowOffset.value = withTiming({ width: -5, height: -5 }, { duration: 200 });
        shadowOpacity.value = withTiming(0.2, { duration: 200 });
    };

    const animatedShadowStyle = useAnimatedStyle(() => ({
        shadowOffset: { width: shadowOffset.value.width, height: shadowOffset.value.height },
        shadowOpacity: shadowOpacity.value,
        shadowColor: '#1456a7',
    }));

    const animatedLabelStyle = useAnimatedStyle(() => {
        return {
            opacity: labelOpacity.value,
            transform: [{
                translateY: withTiming(value ? -30 : 0, { duration: 200 }),
            }, {
                scale: withTiming(value ? 0.75 : 1, { duration: 200 }),
            }],
        };
    });

    return (
        <Animated.View className="relative w-full mb-4">
            <Animated.View
                style={[
                    styles.neumorphicInput,
                    animatedShadowStyle,
                    {
                        borderRadius: 12,
                        backgroundColor: '#eef5ff',
                        padding: 16,
                        minHeight: multiline ? 100 : 56,
                    },
                ]}
            />
            <Animated.Text
                style={[
                    animatedLabelStyle,
                    {
                        position: 'absolute',
                        top: 16,
                        left: 16,
                        zIndex: 1,
                        color: '#1456a7',
                        fontFamily: 'JakartaRegular',
                        backgroundColor: 'transparent',
                    }
                ]}
            >
                {placeholder}
            </Animated.Text>
            {maskType ? (
                <TextInputMask
                    type={maskType}
                    options={options}
                    placeholder={placeholder}
                    value={value}
                    onChangeText={onChangeText}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    keyboardType={keyboardType}
                    className="absolute inset-0 p-4 rounded-xl text-[#1456a7] font-JakartaRegular"
                    placeholderTextColor="#6b7280"
                    style={{ paddingTop: value ? 20 : 16 }}
                />
            ) : (
                <TextInput
                    placeholder={placeholder}
                    value={value}
                    onChangeText={onChangeText}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    keyboardType={keyboardType}
                    className="absolute inset-0 p-4 rounded-xl text-[#1456a7] font-JakartaRegular"
                    placeholderTextColor="#6b7280"
                    multiline={multiline}
                    textAlignVertical={textAlignVertical}
                    style={{ paddingTop: value ? 20 : 16 }}
                />
            )}
            {error && <Text className="text-red-500 text-xs mt-1 -mb-2">{error}</Text>}
        </Animated.View>
    );
};

// Componente de botão de upload de imagem animado e melhorado
const AnimatedImageUploadButton: React.FC<AnimatedImageUploadButtonProps> = ({
    label,
    uri,
    onPress,
    error,
    iconName,
    type = 'circular'
}) => {
    const animatedScale = useSharedValue(1);
    const imageOpacity = useSharedValue(0);
    const imageScale = useSharedValue(0.8);

    const isCircular = type === 'circular';

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: animatedScale.value }],
        };
    });

    const animatedImageStyle = useAnimatedStyle(() => {
        return {
            opacity: imageOpacity.value,
            transform: [{ scale: imageScale.value }],
        };
    });

    const handlePressIn = () => {
        animatedScale.value = withTiming(0.95, { duration: 100 });
    };

    const handlePressOut = () => {
        animatedScale.value = withTiming(1, { duration: 150 });
        onPress();
    };

    useEffect(() => {
        if (uri) {
            imageOpacity.value = withTiming(1, { duration: 500, easing: Easing.out(Easing.quad) });
            imageScale.value = withTiming(1, { duration: 500, easing: Easing.out(Easing.quad) });
        } else {
            imageOpacity.value = withTiming(0, { duration: 200 });
            imageScale.value = withTiming(0.8, { duration: 200 });
        }
    }, [uri]);

    return (
        <View className="items-center mb-8">
            <TouchableOpacity
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                activeOpacity={1}
            >
                <Animated.View
                    style={[
                        animatedStyle,
                        {
                            borderColor: error ? 'red' : '#d1d5db',
                            backgroundColor: '#eef5ff',
                        },
                        styles.uploadButtonShadow,
                        isCircular ? {
                            width: 128,
                            height: 128,
                            borderRadius: 9999,
                            borderWidth: 4,
                            borderColor: '#eef5ff',
                        } : {
                            width: 192,
                            height: 128,
                            borderRadius: 16,
                            borderWidth: 2,
                            borderStyle: 'dashed',
                        }
                    ]}
                    className={`relative justify-center items-center overflow-hidden transition-all duration-300`}
                >
                    {!uri && (
                        <Ionicons name={iconName} size={isCircular ? 60 : 50} color="#6b7280" />
                    )}
                    {uri && (
                        <Animated.View style={[animatedImageStyle, { width: '100%', height: '100%' }]}>
                            <Image
                                source={{ uri }}
                                className="w-full h-full"
                                resizeMode="cover"
                            />
                        </Animated.View>
                    )}
                </Animated.View>
            </TouchableOpacity>
            <Text className="text-sm mt-2 text-gray-500 font-JakartaRegular">{label}</Text>
            {error && <Text className="text-red-500 text-xs mt-1">{error}</Text>}
        </View>
    );
};

const AnimatedButton: React.FC<AnimatedButtonProps> = ({ title, onPress, className, disabled, bgVariant = 'bg-[#1456a7]' }) => {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: scale.value }],
        };
    });

    const handlePressIn = () => {
        if (!disabled) {
            scale.value = withTiming(0.95);
        }
    };

    const handlePressOut = () => {
        if (!disabled) {
            scale.value = withTiming(1);
        }
    };

    return (
        <TouchableOpacity
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={onPress}
            activeOpacity={1}
            disabled={disabled}
        >
            <Animated.View style={[animatedStyle, { opacity: disabled ? 0.6 : 1 }]} className={`flex-row justify-center items-center p-4 rounded-xl ${bgVariant} ${className}`}>
                {typeof title === 'string' ? (
                    <Text className="text-white font-JakartaSemiBold text-lg">{title}</Text>
                ) : (
                    title
                )}
            </Animated.View>
        </TouchableOpacity>
    );
};

// Estilos
const styles = StyleSheet.create({
    neumorphicInput: {
        shadowColor: '#a7a7a7',
        shadowOffset: { width: -5, height: -5 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 5,
        backgroundColor: '#eef5ff',
    },
    uploadButtonShadow: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
    },
});

// ------------------------------------------------------------------
// TELA PRINCIPAL
// ------------------------------------------------------------------
export default function DriverRegistrationScreen() {
    const {
        step,
        formData,
        errors,
        isSubmitting,
        isSuccessModalVisible,
        isErrorModalVisible,
        errorMessage,
        handleFormChange,
        nextStep,
        prevStep,
        submitForm,
        setIsSuccessModalVisible,
        setIsErrorModalVisible,
    } = useDriverRegistrationForm({});

    const profileImageUpload = useImageUpload();
    const cnhImageUpload = useImageUpload();
    const crlvImageUpload = useImageUpload();
    const criminalRecordImageUpload = useImageUpload();

    // Estado para controlar a animação de transição dos passos
    const stepAnimation = useSharedValue(0);

    const animatedStepStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: stepAnimation.value }],
            opacity: stepAnimation.value === 0 ? 1 : 0, // Opacidade baseada na posição para evitar flickering
        };
    });

    // Função de transição animada para o próximo passo
    const handleNextStep = () => {
        stepAnimation.value = withSequence(
            withTiming(-100, { duration: 300, easing: Easing.inOut(Easing.quad) }), // Desliza para fora
            withTiming(100, { duration: 0 }), // Pula para a posição inicial da nova tela
            withTiming(0, { duration: 300, easing: Easing.inOut(Easing.quad) }) // Desliza para a posição final
        );
        nextStep();
    };

    // Função de transição animada para o passo anterior
    const handlePrevStep = () => {
        stepAnimation.value = withSequence(
            withTiming(100, { duration: 300, easing: Easing.inOut(Easing.quad) }),
            withTiming(-100, { duration: 0 }),
            withTiming(0, { duration: 300, easing: Easing.inOut(Easing.quad) })
        );
        prevStep();
    };

    // UseEffects para sincronizar as fotos com o formulário
    useEffect(() => {
        if (profileImageUpload.uri) handleFormChange('profilePictureUri', profileImageUpload.uri);
    }, [profileImageUpload.uri]);

    useEffect(() => {
        if (cnhImageUpload.uri) handleFormChange('cnhPictureUri', cnhImageUpload.uri);
    }, [cnhImageUpload.uri]);

    useEffect(() => {
        if (crlvImageUpload.uri) handleFormChange('crlvPictureUri', crlvImageUpload.uri);
    }, [crlvImageUpload.uri]);

    useEffect(() => {
        if (criminalRecordImageUpload.uri) handleFormChange('criminalRecordUri', criminalRecordImageUpload.uri);
    }, [criminalRecordImageUpload.uri]);

    const handleSuccessModalClose = () => {
        setIsSuccessModalVisible(false);
        router.replace('/(root)/(tabs)/home');
    };

    const renderStepContent = () => {
        switch (step) {
            case 1:
                return (
                    <Animated.View style={animatedStepStyle} className="flex-1">
                        <ScrollView className="flex-1 px-5">
                            <Text className="text-2xl font-JakartaBold mb-4 text-[#1456a7]">Dados Pessoais</Text>
                            <AnimatedImageUploadButton
                                label="Adicionar Foto de Perfil"
                                uri={profileImageUpload.uri}
                                onPress={profileImageUpload.uploadImage}
                                error={errors.profilePictureUri}
                                iconName="camera-outline"
                                type="circular"
                            />
                            <AnimatedInput
                                placeholder="CPF *"
                                value={formData.cpf}
                                onChangeText={(text) => handleFormChange('cpf', text)}
                                maskType="cpf"
                            />
                            {errors.cpf && <Text className="text-red-500 text-xs mt-1 -mb-2">{errors.cpf}</Text>}
                            <AnimatedInput
                                placeholder="RG *"
                                value={formData.rg}
                                onChangeText={(text) => handleFormChange('rg', text)}
                                maskType="custom"
                                options={{ mask: '99.999.999-9' }}
                            />
                            {errors.rg && <Text className="text-red-500 text-xs mt-1 -mb-2">{errors.rg}</Text>}
                            <AnimatedInput
                                placeholder="Telefone de Contato *"
                                value={formData.contactPhone}
                                onChangeText={(text) => handleFormChange('contactPhone', text)}
                                maskType="cel-phone"
                            />
                            {errors.contactPhone && <Text className="text-red-500 text-xs mt-1 -mb-2">{errors.contactPhone}</Text>}
                            <AnimatedInput
                                placeholder="Telefone de Emergência *"
                                value={formData.emergencyPhone}
                                onChangeText={(text) => handleFormChange('emergencyPhone', text)}
                                maskType="cel-phone"
                            />
                            {errors.emergencyPhone && <Text className="text-red-500 text-xs mt-1 -mb-2">{errors.emergencyPhone}</Text>}
                            <DropdownSelector
                                label="Gênero *"
                                value={formData.gender}
                                options={['Masculino', 'Feminino', 'Outro', 'Prefiro não dizer']}
                                onSelect={(value) => handleFormChange('gender', value)}
                            />
                            {errors.gender && <Text className="text-red-500 text-xs mt-1 -mb-2">{errors.gender}</Text>}
                            <AnimatedInput
                                placeholder="Biografia (opcional)"
                                value={formData.bio}
                                onChangeText={(text) => handleFormChange('bio', text)}
                                multiline={true}
                                textAlignVertical="top"
                            />
                            <AnimatedButton
                                title="Próximo"
                                className="mt-4"
                                onPress={handleNextStep}
                                disabled={false}
                            />
                        </ScrollView>
                    </Animated.View>
                );
            case 2:
                return (
                    <Animated.View style={animatedStepStyle} className="flex-1">
                        <ScrollView className="flex-1 px-5">
                            <Text className="text-2xl font-JakartaBold mb-4 text-[#1456a7]">Detalhes da CNH e Carro</Text>
                            <View className="flex-row items-center mb-2">
                                <Text className="text-gray-500 font-JakartaBold">CNH com EAR *</Text>
                                <Tooltip message="A sua CNH deve ter a observação 'Exerce Atividade Remunerada (EAR)' para ser aprovado." />
                            </View>
                            <AnimatedInput
                                placeholder="Número da CNH *"
                                value={formData.cnhInfo}
                                onChangeText={(text) => handleFormChange('cnhInfo', text)}
                                keyboardType="numeric"
                            />
                            {errors.cnhInfo && <Text className="text-red-500 text-xs mt-1 -mb-2">{errors.cnhInfo}</Text>}
                            <AnimatedInput
                                placeholder="Validade da CNH (DD/MM/AAAA) *"
                                value={formData.cnhValidity}
                                onChangeText={(text) => handleFormChange('cnhValidity', text)}
                                keyboardType="numeric"
                                maskType="datetime"
                                options={{ format: 'DD/MM/YYYY' }}
                            />
                            {errors.cnhValidity && <Text className="text-red-500 text-xs mt-1 -mb-2">{errors.cnhValidity}</Text>}
                            <Text className="text-2xl font-JakartaBold mt-4 mb-4 text-[#1456a7]">Detalhes do Carro</Text>
                            <AnimatedInput
                                placeholder="Marca do Carro *"
                                value={formData.carBrand}
                                onChangeText={(text) => handleFormChange('carBrand', text)}
                            />
                            {errors.carBrand && <Text className="text-red-500 text-xs mt-1 -mb-2">{errors.carBrand}</Text>}
                            <AnimatedInput
                                placeholder="Modelo do Carro *"
                                value={formData.carModel}
                                onChangeText={(text) => handleFormChange('carModel', text)}
                            />
                            {errors.carModel && <Text className="text-red-500 text-xs mt-1 -mb-2">{errors.carModel}</Text>}
                            <AnimatedInput
                                placeholder="Placa do Carro *"
                                value={formData.carPlate}
                                onChangeText={(text) => handleFormChange('carPlate', text)}
                                maskType="custom"
                                options={{ mask: 'AAA-9999' }}
                            />
                            {errors.carPlate && <Text className="text-red-500 text-xs mt-1 -mb-2">{errors.carPlate}</Text>}
                            <AnimatedInput
                                placeholder="Cor do Carro *"
                                value={formData.carColor}
                                onChangeText={(text) => handleFormChange('carColor', text)}
                            />
                            {errors.carColor && <Text className="text-red-500 text-xs mt-1 -mb-2">{errors.carColor}</Text>}
                            <AnimatedInput
                                placeholder="Ano do Carro *"
                                value={formData.carYear}
                                onChangeText={(text) => handleFormChange('carYear', text)}
                                keyboardType="numeric"
                            />
                            {errors.carYear && <Text className="text-red-500 text-xs mt-1 -mb-2">{errors.carYear}</Text>}
                            <View className="flex-row justify-between">
                                <AnimatedButton
                                    title="Anterior"
                                    className="flex-1 mr-2"
                                    onPress={handlePrevStep}
                                    bgVariant="bg-gray-400"
                                    disabled={false}
                                />
                                <AnimatedButton
                                    title="Próximo"
                                    className="flex-1 ml-2"
                                    onPress={handleNextStep}
                                    disabled={false}
                                />
                            </View>
                        </ScrollView>
                    </Animated.View>
                );
            case 3:
                return (
                    <Animated.View style={animatedStepStyle} className="flex-1">
                        <ScrollView className="flex-1 px-5">
                            <Text className="text-2xl font-JakartaBold mb-4 text-[#1456a7]">Upload de Documentos</Text>
                            <AnimatedImageUploadButton
                                label="Foto da CNH *"
                                uri={cnhImageUpload.uri}
                                onPress={cnhImageUpload.uploadImage}
                                error={errors.cnhPictureUri}
                                iconName="document-text-outline"
                                type="rectangular"
                            />
                            <AnimatedImageUploadButton
                                label="Foto do CRLV *"
                                uri={crlvImageUpload.uri}
                                onPress={crlvImageUpload.uploadImage}
                                error={errors.crlvPictureUri}
                                iconName="car-outline"
                                type="rectangular"
                            />
                            <AnimatedImageUploadButton
                                label="Certidão Criminal (opcional)"
                                uri={criminalRecordImageUpload.uri}
                                onPress={criminalRecordImageUpload.uploadImage}
                                iconName="receipt-outline"
                                type="rectangular"
                            />
                            <View className="flex-row justify-between mt-8">
                                <AnimatedButton
                                    title="Anterior"
                                    className="flex-1 mr-2"
                                    onPress={handlePrevStep}
                                    bgVariant="bg-gray-400"
                                    disabled={false}
                                />
                                <AnimatedButton
                                    title={isSubmitting ? <ActivityIndicator color="#fff" /> : "Salvar e Enviar"}
                                    className="flex-1 ml-2"
                                    onPress={submitForm}
                                    disabled={isSubmitting}
                                />
                            </View>
                        </ScrollView>
                    </Animated.View>
                );
            default:
                return null;
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="flex-1 p-5">
                <View className="flex-row items-center justify-between mb-8 relative">
                    <TouchableOpacity onPress={() => router.back()} className="p-2 z-10 absolute left-0">
                        <Ionicons name="arrow-back-outline" size={24} color="#1456a7" />
                    </TouchableOpacity>
                    <Text className="flex-1 text-center text-3xl font-JakartaExtraBold text-[#1456a7]">
                        Torne-se Motorista
                    </Text>
                </View>

                <AnimatedProgressBar currentStep={step} totalSteps={3} />
                
                {renderStepContent()}

                <ErrorModal
                    isErrorVisible={isErrorModalVisible}
                    title="Erro de Envio"
                    errorMessage={errorMessage}
                    onClose={() => setIsErrorModalVisible(false)}
                />

                <SuccessModal
                    ShowSuccessModal={isSuccessModalVisible}
                    title="Sucesso!"
                    description="Seu pedido foi enviado para análise. Aguarde a aprovação."
                    onClose={handleSuccessModalClose}
                />
            </View>
        </SafeAreaView>
    );
}
