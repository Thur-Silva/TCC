import { icons } from "@/constants";
import { useOAuth } from "@clerk/clerk-expo";
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useCallback, useEffect, useRef } from "react";
import { Image, Text, View } from "react-native";
import CustomButton from "./CustomButton";

WebBrowser.maybeCompleteAuthSession();

const OAuth = () => {
    // Usa useRef para armazenar a função de forma que ela não cause re-renderizações
    const startOAuthFlowRef = useRef<(() => Promise<any>) | undefined>(undefined);
    const router = useRouter();

    // Chama o hook do Clerk para obter o startOAuthFlow
    const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

    // Usa useEffect para atribuir a função ao useRef quando ela estiver disponível
    useEffect(() => {
        if (startOAuthFlow) {
            startOAuthFlowRef.current = startOAuthFlow;
        }
    }, [startOAuthFlow]);

    const handleGoogleSignIn = useCallback(async () => {
        const currentFlowFunction = startOAuthFlowRef.current;
        if (!currentFlowFunction) {
            console.warn("Clerk OAuth ainda não está pronto.");
            return;
        }

        try {
            const { createdSessionId, setActive } = await currentFlowFunction();

            if (createdSessionId) {
                await setActive({ session: createdSessionId });
                router.replace('/(root)/(tabs)/home');
            } else {
                console.warn("Fluxo de OAuth incompleto.");
            }
        } catch (err) {
            console.error("Erro no fluxo de autenticação com o Google", err);
        }
    }, [router]);

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
            />
        </View>
    );
};

export default OAuth;