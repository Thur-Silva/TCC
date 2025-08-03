import CustomButton from "@/components/CustomButton";
import DecorationClouds from "@/components/decorationClouds";
import ErrorModal from "@/components/ErrorModal";
import HomeHeader from "@/components/HomeHeader";
import InputField from "@/components/InputField";
import OAuth from "@/components/OAtuh";
import { icons } from "@/constants";
import { translateClerkError } from '@/utils/errorTranslator';
import { useSignIn } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";

const SignIn = () => {
    const { signIn, setActive, isLoaded } = useSignIn();
    const router = useRouter();

    const [form, setForm] = useState({
        email: '',
        password: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isErrorVisible, setErrorVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const showErrorModal = (error: any) => {
        setErrorMessage(error);
        setErrorVisible(true);
    };

    const onSignInPress = useCallback(async () => {
        if (!isLoaded || isSubmitting) return;

        setIsSubmitting(true);
        setErrorVisible(false);

        try {
            const signInAttempt = await signIn.create({
                identifier: form.email,
                password: form.password,
            });

            if (signInAttempt.status === 'complete') {
                await setActive({ session: signInAttempt.createdSessionId });
                router.replace('/(root)/(tabs)/home');
            } else {
                // Se a tentativa de login não for completa, exibe um erro
                showErrorModal('Ocorreu um erro ao tentar fazer login.');
            }
        } catch (err: any) {
            // Usa a função de tradução para exibir o erro traduzido
            const translatedMessage = translateClerkError(err);
            showErrorModal(translatedMessage);
        } finally {
            setIsSubmitting(false);
        }
    }, [isLoaded, form.email, form.password, signIn, setActive, isSubmitting]);

    return (
        <View className="bg-white flex-1 relative">
            <ScrollView
                className="flex-1"
                contentContainerStyle={{ flexGrow: 1 }}
            >
                <HomeHeader showInput={false} globalClassName="pt-10 mb-10" />

                <View className="px-5 mt-10 flex-1">
                    <Text className="text-4xl font-JakartaExtraBold text-[#1456a7] text-center mb-10">
                        Entre na sua conta
                    </Text>

                    <InputField
                        label="Email"
                        placeholder="Insira seu E-mail"
                        icon={icons.email}
                        value={form.email}
                        onChangeText={(value) => setForm({ ...form, email: value })}
                    />

                    <InputField
                        label="Senha"
                        placeholder="Insira sua senha"
                        icon={icons.lock}
                        value={form.password}
                        secureTextEntry={true}
                        onChangeText={(value) => setForm({ ...form, password: value })}
                    />

                    <CustomButton
                        title={isSubmitting ? "Entrando..." : "Login"}
                        onPress={onSignInPress}
                        className="mt-6"
                        disabled={isSubmitting}
                    >
                        {isSubmitting && <ActivityIndicator color="#fff" className="mr-2" />}
                    </CustomButton>

                    <OAuth />

                    <Link href="/(auth)/sign-up"
                        className="text-lg text-center text-gray-500 mt-10 font-JakartaRegular"
                    >
                        Não possui uma conta?
                        <Text className="text-[#4598ff] font-JakartaSemiBold"> Cadastrar</Text>
                    </Link>
                </View>
                <DecorationClouds className="absolute bottom-0 left-0 right-0 z-[-1]" />
            </ScrollView>

            <ErrorModal
                isErrorVisible={isErrorVisible}
                errorMessage={errorMessage}
                onClose={() => setErrorVisible(false)}
            />
        </View>
    );
};

export default SignIn;