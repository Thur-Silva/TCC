// components/DriverRegistration/steps/PersonalDataStep.tsx
import React from 'react';
import { Text, View } from 'react-native';

import DropdownSelector from '@/components/DropdownSelector';
import { ActionButton } from '../ActionButton';
import { ErrorDisplay } from '../ErrorDisplay';
import { FormInput } from '../FormInput';
import { ImageUploadButton } from '../ImageUploadButton';
import { StepContainer } from '../StepContainer';
import { StepTitle } from '../StepTitle';

interface PersonalDataStepProps {
    animatedStyle: any;
    formData: any;
    errors: any;
    profileImageUpload: any;
    onFormChange: (field: string, value: string) => void;
    onNext: () => void;
}

export const PersonalDataStep: React.FC<PersonalDataStepProps> = ({
    animatedStyle,
    formData,
    errors,
    profileImageUpload,
    onFormChange,
    onNext
}) => {
    return (
        <StepContainer animatedStyle={animatedStyle}>
            <StepTitle title="Dados Pessoais" />
                <Text className='font-JakartaExtraBold mb-10 mt-[-10] text-[#1456a7]'>Informações sensíveis não serão divulgadas</Text>            
            <ImageUploadButton
                label="Adicionar Foto de Perfil"
                uri={profileImageUpload.uri}
                onPress={profileImageUpload.uploadImage}
                error={errors.profilePictureUri}
                iconName="camera-outline"
                type="circular"
            />
            
            <FormInput
                label="CPF *"
                placeholder="Digite seu CPF"
                value={formData.cpf}
                onChangeText={(text) => onFormChange('cpf', text)}
                error={errors.cpf}
                maskType="cpf"
            />
            
            <FormInput
                label="RG *"
                placeholder="Digite seu RG"
                value={formData.rg}
                onChangeText={(text) => onFormChange('rg', text)}
                error={errors.rg}
                maskType="custom"
                options={{ mask: '99.999.999-9' }}
            />
            
            <FormInput
                label="Telefone de Contato *"
                placeholder="Digite seu telefone"
                value={formData.contactPhone}
                onChangeText={(text) => onFormChange('contactPhone', text)}
                error={errors.contactPhone}
                maskType="cel-phone"
            />
            
            <FormInput
                label="Telefone de Emergência *"
                placeholder="Digite o telefone de emergência"
                value={formData.emergencyPhone}
                onChangeText={(text) => onFormChange('emergencyPhone', text)}
                error={errors.emergencyPhone}
                maskType="cel-phone"
            />
            
            <View className="mb-6">
                <DropdownSelector
                    label="Gênero *"
                    value={formData.gender}
                    options={['Masculino', 'Feminino', 'Outro', 'Prefiro não dizer']}
                    onSelect={(value) => onFormChange('gender', value)}
                />
                <ErrorDisplay error={errors.gender} />
            </View>
            
            <FormInput
                label="Biografia"
                placeholder="Nos conte um pouco sobre você..."
                value={formData.bio}
                onChangeText={(text) => onFormChange('bio', text)}
                multiline={true}
                textAlignVertical="top"
                helpText="Nos conte um pouco sobre você em até 200 caracteres"
            />
            
            <ActionButton
                title="Continuar"
                className="mt-4"
                onPress={onNext}
                disabled={false}
            />
        </StepContainer>
    );
};
