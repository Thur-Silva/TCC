// components/DriverRegistration/steps/DocumentsStep.tsx
import React from 'react';
import { ActivityIndicator, View } from 'react-native';

import { ActionButton } from '../ActionButton';
import { ImageUploadButton } from '../ImageUploadButton';
import { StepContainer } from '../StepContainer';
import { StepTitle } from '../StepTitle';

interface DocumentsStepProps {
    animatedStyle: any;
    errors: any;
    cnhImageUpload: any;
    crlvImageUpload: any;
    criminalRecordImageUpload: any;
    onPrevious: () => void;
    onSubmit: () => void;
    isSubmitting: boolean;
}

export const DocumentsStep: React.FC<DocumentsStepProps> = ({
    animatedStyle,
    errors,
    cnhImageUpload,
    crlvImageUpload,
    criminalRecordImageUpload,
    onPrevious,
    onSubmit,
    isSubmitting
}) => {
    return (
        <StepContainer animatedStyle={animatedStyle}>
            <StepTitle title="Upload de Documentos" />
            
            <View className="flex-col gap-4">
                <ImageUploadButton
                    label="Foto da CNH *"
                    uri={cnhImageUpload.uri}
                    onPress={cnhImageUpload.uploadImage}
                    error={errors.cnhPictureUri}
                    iconName="document-text-outline"
                    type="rectangular"
                />
                
                <ImageUploadButton
                    label="Foto do CRLV *"
                    uri={crlvImageUpload.uri}
                    onPress={crlvImageUpload.uploadImage}
                    error={errors.crlvPictureUri}
                    iconName="car-outline"
                    type="rectangular"
                />
                
            </View>
            
            <View className="flex-row justify-between space-x-4 mt-8">
                <ActionButton
                    title="Voltar"
                    className="flex-1"
                    onPress={onPrevious}
                    variant="secondary"
                    disabled={false}
                />
                <ActionButton
                    title={isSubmitting ? <ActivityIndicator color="#fff" size="small" /> : "Salvar e Enviar"}
                    className="flex-1"
                    onPress={onSubmit}
                    disabled={isSubmitting}
                    variant={isSubmitting ? 'loading' : 'primary'}
                />
            </View>
        </StepContainer>
    );
};