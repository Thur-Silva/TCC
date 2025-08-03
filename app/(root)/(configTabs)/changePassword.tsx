import ErrorModal from '@/components/ErrorModal';
import HomeHeader from '@/components/HomeHeader';
import SuccessModal from '@/components/SuccessModal';
import { translateClerkError } from '@/utils/errorTranslator';
import { useSignIn, useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, SafeAreaView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import ReactNativeModal from 'react-native-modal';

// Componente para um input de texto estilizado
const StyledInput = React.memo(({ placeholder, secureTextEntry, value, onChangeText }: { placeholder: string; secureTextEntry: boolean; value: string; onChangeText: (text: string) => void; }) => (
    <TextInput
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        value={value}
        onChangeText={onChangeText}
        className="w-full px-5 py-4 mb-4 rounded-xl bg-gray-100 font-JakartaRegular text-base text-gray-800 focus:border-[#1456a7] focus:border-2"
        placeholderTextColor="#9ca3af"
    />
));

// Componente para um botão estilizado
const StyledButton = React.memo(({ title, onPress, disabled, style }: { title: string; onPress: () => void; disabled: boolean; style?: string; }) => (
    <TouchableOpacity
        onPress={onPress}
        disabled={disabled}
        className={`w-full p-4 rounded-xl items-center justify-center mt-6 ${disabled ? 'bg-gray-400' : 'bg-[#1456a7]'} ${style}`}
    >
        {disabled ? (
            <ActivityIndicator color="#fff" />
        ) : (
            <Text className="text-white text-lg font-JakartaSemiBold">{title}</Text>
        )}
    </TouchableOpacity>
));

export default function ChangePasswordScreen() {
    const { user } = useUser();
    const { signIn } = useSignIn();

    // Estados para alterar a senha do usuário logado
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Estados para o fluxo de "Esqueci a Senha" (redefinição)
    const [isForgotPasswordModalVisible, setIsForgotPasswordModalVisible] = useState(false);
    const [verification, setVerification] = useState({
        state: 'default',
        error: '',
        code: '',
        newPasswordReset: ''
    });

    // Estados para os modais de feedback
    const [isErrorVisible, setIsErrorVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isSuccessVisible, setIsSuccessVisible] = useState(false);

    // Função para exibir o modal de erro
    const showError = useCallback((message: string) => {
        setErrorMessage(message);
        setIsErrorVisible(true);
    }, []);

    // Função para alterar a senha (usuário logado)
    const handlePasswordChange = useCallback(async () => {
        if (!user) {
            showError('Usuário não autenticado.');
            return;
        }

        if (newPassword.length < 8) {
            showError('A nova senha deve ter no mínimo 8 caracteres.');
            return;
        }

        if (newPassword !== confirmNewPassword) {
            showError('As novas senhas não coincidem.');
            return;
        }

        setIsLoading(true);

        try {
            await user.updatePassword({
                newPassword: newPassword,
                currentPassword: currentPassword,
            });

            setIsSuccessVisible(true);
        } catch (error: any) {
            // Usa a função tradutora para erros do Clerk
            showError(translateClerkError(error));
        } finally {
            setIsLoading(false);
        }
    }, [user, currentPassword, newPassword, confirmNewPassword, showError]);

    // Função para iniciar o fluxo de redefinição de senha (esqueci a senha)
    const handleForgotPassword = useCallback(async () => {
        if (!user || !signIn) {
            showError('Usuário ou sessão não encontrados.');
            return;
        }

        setIsLoading(true);
        const userEmail = user.emailAddresses[0]?.emailAddress;

        if (!userEmail) {
            showError('Não foi possível encontrar o e-mail do usuário logado.');
            setIsLoading(false);
            return;
        }

        try {
            await signIn.create({ strategy: 'reset_password_email_code', identifier: userEmail });
            setVerification({ ...verification, state: 'pending' });
        } catch (error: any) {
            // Usa a função tradutora para erros do Clerk
            showError(translateClerkError(error));
        } finally {
            setIsLoading(false);
        }
    }, [user, signIn, verification, showError]);

    // Função para redefinir a senha com o código
    const handlePasswordReset = useCallback(async () => {
        if (!signIn) return;
        setIsLoading(true);

        try {
            const result = await signIn.attemptFirstFactor({ strategy: 'reset_password_email_code', code: verification.code, password: verification.newPasswordReset });
            
            if (result.status === 'complete') {
                setIsSuccessVisible(true);
                setVerification({ ...verification, state: 'success' });
            } else {
                showError('Não foi possível redefinir a senha.');
            }
        } catch (error: any) {
            // Usa a função tradutora para erros do Clerk
            showError(translateClerkError(error));
        } finally {
            setIsLoading(false);
        }
    }, [signIn, verification, showError]);

    return (
        <SafeAreaView className="flex-1 bg-white">
            <HomeHeader showInput={false} globalClassName="pt-10 mb-6" />
            <View className="flex-row items-center p-4">
                <TouchableOpacity onPress={() => router.back()} className="p-2">
                    <Ionicons name="arrow-back-outline" size={28} color="#1456a7" />
                </TouchableOpacity>
            </View>
            <View className="p-6 flex-1">
                <Text className="text-3xl font-JakartaExtraBold text-[#1456a7] mb-8 mt-4">
                    Altere sua senha
                </Text>
                <Text className="text-base font-JakartaRegular text-gray-600 mb-6">
                    Preencha os campos abaixo para atualizar sua senha.
                </Text>

                <StyledInput
                    placeholder="Senha atual"
                    secureTextEntry
                    value={currentPassword}
                    onChangeText={setCurrentPassword}
                />
                <StyledInput
                    placeholder="Nova senha"
                    secureTextEntry
                    value={newPassword}
                    onChangeText={setNewPassword}
                />
                <StyledInput
                    placeholder="Confirme a nova senha"
                    secureTextEntry
                    value={confirmNewPassword}
                    onChangeText={setConfirmNewPassword}
                />

                <StyledButton
                    title="Alterar Senha"
                    onPress={handlePasswordChange}
                    disabled={isLoading || !currentPassword || !newPassword || !confirmNewPassword}
                />

                <TouchableOpacity
                    onPress={() => setIsForgotPasswordModalVisible(true)}
                    className="mt-4"
                >
                    <Text className="text-[#1456a7] text-base font-JakartaSemiBold text-center">Esqueci a senha</Text>
                </TouchableOpacity>
            </View>

            {/* Modal para "Esqueci a Senha" */}
            <ReactNativeModal
                isVisible={isForgotPasswordModalVisible}
                statusBarTranslucent={true}
                onBackdropPress={() => {
                    setIsForgotPasswordModalVisible(false);
                    setVerification({ state: 'default', error: '', code: '', newPasswordReset: '' });
                }}
                onBackButtonPress={() => {
                    setIsForgotPasswordModalVisible(false);
                    setVerification({ state: 'default', error: '', code: '', newPasswordReset: '' });
                }}
            >
                <View className="bg-white p-6 rounded-xl">
                    <Text className="text-2xl font-JakartaExtraBold text-[#1456a7] mb-4">Redefinir Senha</Text>

                    {verification.state !== 'pending' ? (
                        <>
                            <Text className="text-base font-JakartaRegular text-gray-600 mb-4">
                                Clique no botão abaixo para enviar um código de redefinição para o seu e-mail.
                            </Text>
                            <StyledButton
                                title="Enviar Código de Redefinição"
                                onPress={handleForgotPassword}
                                disabled={isLoading}
                                style="bg-primary-500"
                            />
                        </>
                    ) : (
                        <>
                            <Text className="text-base font-JakartaRegular text-gray-600 mb-4">
                                Enviamos um código de verificação para {user?.emailAddresses?.[0]?.emailAddress}. Insira o código e a nova senha.
                            </Text>
                            <StyledInput
                                placeholder="Código de verificação"
                                secureTextEntry={false}
                                value={verification.code}
                                onChangeText={(code) => setVerification({ ...verification, code })}
                            />
                            <StyledInput
                                placeholder="Nova senha"
                                secureTextEntry
                                value={verification.newPasswordReset}
                                onChangeText={(newPasswordReset) => setVerification({ ...verification, newPasswordReset })}
                            />
                            {verification.error && (
                                <Text className="text-red-500 text-sm mt-1">
                                    {verification.error}
                                </Text>
                            )}
                            <StyledButton
                                title="Redefinir Senha"
                                onPress={handlePasswordReset}
                                disabled={isLoading || !verification.code || !verification.newPasswordReset}
                                style="bg-success-500"
                            />
                        </>
                    )}
                </View>
            </ReactNativeModal>

            {/* Renderiza o seu modal de erro */}
            <ErrorModal
                isErrorVisible={isErrorVisible}
                errorMessage={errorMessage}
                onClose={() => setIsErrorVisible(false)}
            />
            
            {/* Renderiza o seu modal de sucesso */}
            <SuccessModal
                ShowSuccessModal={isSuccessVisible}
                title="Sucesso!"
                description="Sua senha foi alterada com sucesso!"
                onClose={() => {
                    setIsSuccessVisible(false);
                    router.back();
                }}
            />
        </SafeAreaView>
    );
}