// components/DriverRegistration/steps/VehicleDataStep.tsx
import React from 'react';
import { Text, View } from 'react-native';

import Tooltip from '@/components/Tooltip';
import { ActionButton } from '../ActionButton';
import { ErrorDisplay } from '../ErrorDisplay';
import { FormInput } from '../FormInput';
import { StepContainer } from '../StepContainer';
import { StepTitle } from '../StepTitle';

interface VehicleDataStepProps {
    animatedStyle: any;
    formData: any;
    errors: any;
    onFormChange: (field: string, value: string) => void;
    onNext: () => void;
    onPrevious: () => void;
}



export const VehicleDataStep: React.FC<VehicleDataStepProps> = ({
    animatedStyle,
    formData,
    errors,
    onFormChange,
    onNext,
    onPrevious
}) => {
    // 🔍 DEBUG: Adicione este console.log temporário
    const debugStepValidation = () => {
        console.log('=== DEBUG STEP 2 VALIDATION ===');
        console.log('FormData:', formData);
        console.log('Errors:', errors);
        console.log('Campos obrigatórios:', {
            cnhInfo: formData.cnhInfo,
            cnhValidity: formData.cnhValidity,
            carBrand: formData.carBrand,
            carModel: formData.carModel,
            carPlate: formData.carPlate,
            carColor: formData.carColor,
            carYear: formData.carYear
        });
        console.log('Campos com erro:', Object.keys(errors).filter(key => errors[key]));
    };

    const handleNext = () => {
        debugStepValidation(); // 🔍 Debug antes de tentar avançar
        onNext();
    };
    return (
        <StepContainer animatedStyle={animatedStyle}>
            <StepTitle title="Detalhes da CNH e Carro" />
            
            <View className="flex-row items-center mb-4">
                <Text className="text-lg font-JakartaBold text-gray-700">CNH *</Text>
                <Tooltip message="Esta informação é para garantir segurança aos nossos usuários e será vista apenas em casos necessários, mas nunca exposta ao público." />
            </View>
            
            <FormInput
                label="Número da CNH *"
                placeholder="Digite o número da CNH"
                value={formData.cnhInfo}
                onChangeText={(text) => onFormChange('cnhInfo', text)}
                error={errors.cnhInfo}
                keyboardType="numeric"
            />
            <ErrorDisplay error={errors.cnhInfo} />

            <FormInput
                label="Validade da CNH *"
                placeholder="DD/MM/AAAA"
                value={formData.cnhValidity}
                onChangeText={(text) => onFormChange('cnhValidity', text)}
                error={errors.cnhValidity}
                keyboardType="numeric"
                maskType="datetime"
                options={{ format: 'DD/MM/YYYY' }}
            />
            <ErrorDisplay error={errors.cnhValidity} />
            
            <StepTitle title="Detalhes do Carro" />
            
            <FormInput
                label="Marca do Carro *"
                placeholder="Ex: Toyota, Honda, Volkswagen"
                value={formData.carBrand}
                onChangeText={(text) => onFormChange('carBrand', text)}
                error={errors.carBrand}
            />
            
            <FormInput
                label="Modelo do Carro *"
                placeholder="Ex: Corolla, Civic, Golf"
                value={formData.carModel}
                onChangeText={(text) => onFormChange('carModel', text)}
                error={errors.carModel}
            />
            
            <FormInput
                label="Placa do Carro *"
                placeholder="AAA-9999"
                value={formData.carPlate}
                onChangeText={(text) => onFormChange('carPlate', text)}
                error={errors.carPlate}
                maskType="custom"
                options={{ mask: 'AAA-9999' }}
            />
            
            <FormInput
                label="Cor do Carro *"
                placeholder="Ex: Branco, Preto, Prata"
                value={formData.carColor}
                onChangeText={(text) => onFormChange('carColor', text)}
                error={errors.carColor}
            />
            
            <FormInput
                label="Ano do Carro *"
                placeholder="Ex: 2020"
                value={formData.carYear}
                onChangeText={(text) => onFormChange('carYear', text)}
                error={errors.carYear}
                keyboardType="numeric"
            />
            
            <View className="flex-row justify-between space-x-4 mt-4">
                <ActionButton
                    title="Voltar"
                    className="flex-1"
                    onPress={onPrevious}
                    variant="secondary"
                    disabled={false}
                />
                <ActionButton
                    title="Continuar"
                    className="flex-1"
                    onPress={onNext}
                    disabled={false}
                />
            </View>
        </StepContainer>
    );
};