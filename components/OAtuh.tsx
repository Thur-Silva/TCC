import { icons } from "@/constants";
import { fetchAPI } from "@/lib/fecth";
import { useClerk, useOAuth } from "@clerk/clerk-expo"; // ADIÇÃO: useClerk para ter acesso ao signOut
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, Image, Text, View } from "react-native";
import CustomButton from "./CustomButton";
import ErrorModal from "./ErrorModal"; // Importe o modal de erro se você tiver um

WebBrowser.maybeCompleteAuthSession();

const OAuth = () => {
    const startOAuthFlowRef = useRef<(() => Promise<any>) | undefined>(undefined);
    const router = useRouter();
    const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });
    const { signOut } = useClerk(); // Ação de logout do Clerk
    const [isLoading, setIsLoading] = useState(false); // Para mostrar um indicador de carregamento
    const [isErrorVisible, setIsErrorVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        if (startOAuthFlow) {
            startOAuthFlowRef.current = startOAuthFlow;
        }
    }, [startOAuthFlow]);

    const handleGoogleSignIn = useCallback(async () => {
        console.log("handleGoogleSignIn foi chamado.");
        const currentFlowFunction = startOAuthFlowRef.current;
        if (!currentFlowFunction) {
            console.warn("Clerk OAuth ainda não está pronto.");
            return;
        }
        
        setIsLoading(true);

        try {
            console.log("Chamando startOAuthFlow...");
            
            // ADIÇÃO: Lógica de timeout para evitar que o await fique pendurado para sempre
            const timeoutPromise = new Promise((resolve, reject) => {
                setTimeout(() => {
                    reject(new Error("Timeout: O fluxo de autenticação não foi concluído a tempo. Verifique a configuração do seu deep link."));
                }, 30000); // 30 segundos
            });

            const { createdSessionId, createdSession } = await Promise.race([
                currentFlowFunction(),
                timeoutPromise,
            ]);

            console.log("Valores retornados do startOAuthFlow:", { createdSessionId, createdSession });

            if (!createdSessionId || !createdSession || !createdSession.user) {
                console.log("Fluxo de OAuth falhou na verificação. createdSessionId:", createdSessionId, "createdSession:", createdSession);
                console.warn("Fluxo de OAuth incompleto ou sessão não foi criada.");
                setIsLoading(false);
                return;
            }

            const user = createdSession.user;
            const userName = user.fullName || user.username || user.emailAddresses[0].emailAddress.split('@')[0];

            console.log("Usuário logado no Clerk, tentando sincronizar com o NeonDB...");
            
            const res = await fetchAPI('/(api)/user', {
                method: 'POST',
                body: JSON.stringify({
                    name: userName,
                    email: user.emailAddresses[0].emailAddress,
                    clerkId: user.id,
                    imageUrl: user.imageUrl,
                }),
            });

            if (res.ok) {
                
                console.log("Dados do usuário salvos com sucesso no NeonDB.");
                await createdSession.setActive();
                router.replace('/(root)/(tabs)/home');
            } else {
                const errorData = await res.json();
                console.error("Falha ao salvar os dados no NeonDB:", errorData);
                await signOut();
                setErrorMessage("Falha ao registrar sua conta. Tente novamente.");
                setIsErrorVisible(true);
            }
        } catch (err: any) {
            console.error("Erro no fluxo de autenticação com o Google:", err.message);
            await signOut();
            setErrorMessage(err.message);
            setIsErrorVisible(true);
        } finally {
            console.log("Finalizando a tentativa de login do Google.");
            setIsLoading(false);
        }
    }, [router, signOut]);

    return (
        <View>
            <View className="flex flex-row justify-center items-center mt-4 gap-x-3">
                <View className="flex-1 h-[1px] bg-general-100" />
                <Text className="text-lg text-gray-500 font-JakartaRegular">ou</Text>
                <View className="flex-1 h-[1px] bg-general-100" />
            </View>

            <CustomButton
                title="Entre com Google"
                className="mt-5 w-full p-3"
                bgVariant="secondary"
                IconLeft={() => (
                    <Image source={icons.google} resizeMode="contain" className="w-5 h-5 mx-2 ml-[-20] mr-5" />
                )}
                onPress={handleGoogleSignIn}
                disabled={isLoading}
            />

            {isLoading && (
                <View className="absolute inset-0 flex justify-center items-center">
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            )}

            <ErrorModal
                isErrorVisible={isErrorVisible}
                errorMessage={errorMessage}
                onClose={() => setIsErrorVisible(false)}
            />
        </View>
    );
};

export default OAuth;
