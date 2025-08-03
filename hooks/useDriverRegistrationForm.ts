import { driverRegistrationApi } from '@/app/(api)/(drivers)/_driverRegistrationApi'; // O caminho de importação corrigido
import { DriverRegistrationData } from '@/types/types';
import { useState } from 'react';
import * as Yup from 'yup';

const driverDataSchema = Yup.object().shape({
    cpf: Yup.string().matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'CPF inválido').required('CPF é obrigatório'),
    rg: Yup.string().matches(/^\d{1,2}\.\d{3}\.\d{3}-\d{1}$/, 'RG inválido').required('RG é obrigatório'),
    contactPhone: Yup.string().matches(/^\(\d{2}\) \d{5}-\d{4}$/, 'Telefone inválido').required('Telefone de contato é obrigatório'),
    emergencyPhone: Yup.string().matches(/^\(\d{2}\) \d{5}-\d{4}$/, 'Telefone inválido').required('Telefone de emergência é obrigatório'),
    gender: Yup.string().required('Gênero é obrigatório'),
    bio: Yup.string().optional(),
});

const carDataSchema = Yup.object().shape({
    cnhInfo: Yup.string().required('Informação da CNH é obrigatória'),
    cnhValidity: Yup.string().required('Data de validade da CNH é obrigatória'),
    hasEar: Yup.boolean().oneOf([true, false]),
    carBrand: Yup.string().required('Marca do carro é obrigatória'),
    carModel: Yup.string().required('Modelo do carro é obrigatório'),
    carPlate: Yup.string().matches(/^[A-Z]{3}-\d{4}$/, 'Placa inválida (ex: ABC-1234)').required('Placa do carro é obrigatória'),
    carColor: Yup.string().required('Cor do carro é obrigatória'),
    carYear: Yup.number().required('Ano do carro é obrigatório').min(1900, 'Ano inválido').max(new Date().getFullYear(), 'Ano inválido'),
});

const documentsSchema = Yup.object().shape({
    profilePictureUri: Yup.string().required('Foto de perfil é obrigatória'),
    cnhPictureUri: Yup.string().required('Foto da CNH é obrigatória'),
    crlvPictureUri: Yup.string().required('Foto do CRLV é obrigatória'),
    criminalRecordUri: Yup.string().optional(),
});


export const useDriverRegistrationForm = (initialData: Partial<DriverRegistrationData>) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<DriverRegistrationData>({
        cpf: '',
        rg: '',
        contactPhone: '',
        emergencyPhone: '',
        gender: '',
        bio: '',
        cnhInfo: '',
        cnhValidity: '',
        hasEar: false,
        carBrand: '',
        carModel: '',
        carPlate: '',
        carColor: '',
        carYear: '',
        profilePictureUri: '',
        cnhPictureUri: '',
        crlvPictureUri: '',
        criminalRecordUri: '',
        ...initialData,
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
    const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const nextStep = async () => {
        try {
            if (step === 1) await driverDataSchema.validate(formData, { abortEarly: false, context: { step: 1 } });
            if (step === 2) await carDataSchema.validate(formData, { abortEarly: false, context: { step: 2 } });
            setStep(prev => prev + 1);
            setErrors({});
            return true;
        } catch (validationErrors: unknown) { // Correção: 'unknown'
            const newErrors: { [key: string]: string } = {};
            if (validationErrors instanceof Yup.ValidationError) {
                validationErrors.inner.forEach(err => {
                    newErrors[err.path!] = err.message; // Correção: uso do '!' para garantir que 'path' não seja null
                });
            }
            setErrors(newErrors);
            return false;
        }
    };

    const prevStep = () => setStep(prev => prev - 1);

    const handleFormChange = (field: keyof DriverRegistrationData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const submitForm = async () => {
        try {
            setIsSubmitting(true);
            await documentsSchema.validate(formData, { abortEarly: false });
            
            await driverRegistrationApi.registerDriver(formData);

            setIsSubmitting(false);
            setIsSuccessModalVisible(true);
            setErrors({});
            return true;
        } catch (validationErrors: unknown) { // Correção: 'unknown'
            setIsSubmitting(false);
            if (validationErrors instanceof Yup.ValidationError) {
                const newErrors: { [key: string]: string } = {};
                validationErrors.inner.forEach(err => {
                    newErrors[err.path!] = err.message; // Correção: uso do '!' para garantir que 'path' não seja null
                });
                setErrors(newErrors);
                setErrorMessage('Por favor, corrija os erros no formulário.');
                setIsErrorModalVisible(true);
            } else if (validationErrors instanceof Error) {
                setErrorMessage(validationErrors.message);
                setIsErrorModalVisible(true);
            } else {
                setErrorMessage('Ocorreu um erro desconhecido ao enviar o formulário.');
                setIsErrorModalVisible(true);
            }
            return false;
        }
    };

    return {
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
    };
};