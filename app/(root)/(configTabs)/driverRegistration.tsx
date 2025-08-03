// driverRegistrationScreen.jsx
import ErrorModal from '@/components/ErrorModal';
import SuccessModal from '@/components/SuccessModal';
import { useDriverRegistrationForm } from '@/hooks/useDriverRegistrationForm';
import { useImageUpload } from '@/hooks/useImageUpload';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { SafeAreaView, Text, TouchableOpacity, View } from 'react-native';

// Componentes refatorados
import { ProgressBar } from '@/components/DriverRegistration/ProgressBar';
import { DocumentsStep } from '@/components/DriverRegistration/steps/DocumentsStep';
import { PersonalDataStep } from '@/components/DriverRegistration/steps/PersonalDataStep';
import { VehicleDataStep } from '@/components/DriverRegistration/steps/VehicleDataStep';

// Hook customizado para transições
import { useStepTransition } from '@/hooks/useStepTransition';

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

    const { animatedStepStyle, transitionToNext, transitionToPrevious } = useStepTransition();

    // Sincronização das imagens com o formulário
    useEffect(() => {
        if (profileImageUpload.uri) {
            handleFormChange('profilePictureUri', profileImageUpload.uri);
        }
    }, [profileImageUpload.uri]);

    useEffect(() => {
        if (cnhImageUpload.uri) {
            handleFormChange('cnhPictureUri', cnhImageUpload.uri);
        }
    }, [cnhImageUpload.uri]);

    useEffect(() => {
        if (crlvImageUpload.uri) {
            handleFormChange('crlvPictureUri', crlvImageUpload.uri);
        }
    }, [crlvImageUpload.uri]);

    useEffect(() => {
        if (criminalRecordImageUpload.uri) {
            handleFormChange('criminalRecordUri', criminalRecordImageUpload.uri);
        }
    }, [criminalRecordImageUpload.uri]);

    const handleSuccessModalClose = () => {
        setIsSuccessModalVisible(false);
        router.replace('/(root)/(tabs)/home');
    };

    const handleNextStep = () => transitionToNext(nextStep);
    const handlePrevStep = () => transitionToPrevious(prevStep);

    // Wrapper para converter a função tipada do hook para o formato esperado pelos componentes
    const handleFormChangeWrapper = (field: string, value: string) => {
        handleFormChange(field as any, value);
    };

    const renderStepContent = () => {
        switch (step) {
            case 1:
                return (
                    <PersonalDataStep
                        animatedStyle={animatedStepStyle}
                        formData={formData}
                        errors={errors}
                        profileImageUpload={profileImageUpload}
                        onFormChange={handleFormChangeWrapper}
                        onNext={handleNextStep}
                    />
                );
            case 2:
                return (
                    <VehicleDataStep
                        animatedStyle={animatedStepStyle}
                        formData={formData}
                        errors={errors}
                        onFormChange={handleFormChangeWrapper}
                        onNext={handleNextStep}
                        onPrevious={handlePrevStep}
                    />
                );
            case 3:
                return (
                    <DocumentsStep
                        animatedStyle={animatedStepStyle}
                        errors={errors}
                        cnhImageUpload={cnhImageUpload}
                        crlvImageUpload={crlvImageUpload}
                        criminalRecordImageUpload={criminalRecordImageUpload}
                        onPrevious={handlePrevStep}
                        onSubmit={submitForm}
                        isSubmitting={isSubmitting}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            
            <View className="flex-1 px-6 pt-4">
                <View className="flex-row items-center mb-8">
                    <TouchableOpacity 
                        onPress={() => router.back()} 
                        className="p-2 mr-4 mt-10"
                        accessibilityLabel="Voltar"
                    >
                        <Ionicons name="arrow-back-outline" size={28} color="#1456a7" />
                    </TouchableOpacity>
                    <Text className="flex-1 text-center mt-10 text-4xl font-JakartaExtraBold text-[#1456a7] mr-12">
                        Torne-se Motorista
                    </Text>
                </View>

                <ProgressBar currentStep={step} totalSteps={3} />

                {renderStepContent()}

                <ErrorModal
                    isErrorVisible={isErrorModalVisible}
                    title="Erro de Envio"
                    errorMessage={errorMessage}
                    onClose={() => setIsErrorModalVisible(false)}
                />

                <SuccessModal
                    ShowSuccessModal={isSuccessModalVisible}
                    title="Cadastro Enviado!"
                    description="Seu cadastro foi enviado! Fique de olho no seu e-mail para a aprovação."
                    onClose={handleSuccessModalClose}
                />
            </View>
        </SafeAreaView>
    );
}