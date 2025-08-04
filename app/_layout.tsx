// app/(root)/_layout.tsx

import { fetchAPI } from '@/lib/fecth';
import { ClerkProvider, useUser } from '@clerk/clerk-expo';
import { tokenCache } from '@clerk/clerk-expo/token-cache';
import { useFonts } from 'expo-font';
import { Slot, SplashScreen } from 'expo-router';
import { useEffect } from 'react';
import 'react-native-reanimated';

// Hook para gerenciar criação automática de usuário
const useAutoCreateUser = () => {
    const { user, isLoaded } = useUser();

    const createUserIfNeeded = async () => {
        if (!user || !isLoaded) return;

        try {
            // 1. Primeiro, verifica se o usuário já existe
            console.log('Verificando se usuário existe:', user.id);
            
            try {
                const existingUser = await fetchAPI(`/(api)/user?clerkId=${user.id}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });
                
                return; // Usuário já existe, não precisa criar
                
            } catch (error) {
                // Se retornar 404, o usuário não existe - vamos criar
                console.log('Usuário não existe, criando...');
            }

            // 2. Extrai dados do Clerk
            const userData = {
                name: user.fullName || user.firstName || 'Usuário',
                email: user.primaryEmailAddress?.emailAddress || '',
                clerkId: user.id,
                imageUrl: user.imageUrl || null
            };


            // 3. Cria o usuário na base de dados
            const response = await fetchAPI('/(api)/user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData),
            });



        } catch (error) {
            console.error('Erro ao criar usuário automaticamente:', error);
            // Não bloqueia o app, apenas loga o erro
        }
    };

    useEffect(() => {
        if (isLoaded && user) {
            createUserIfNeeded();
        }
    }, [isLoaded, user?.id]); // Dependências: isLoaded e user.id
};

// Componente wrapper para usar hooks do Clerk
const UserAutoCreator = ({ children }: { children: React.ReactNode }) => {
    useAutoCreateUser();
    return <>{children}</>;
};

function RootLayoutNav() {
    return (
        <ClerkProvider tokenCache={tokenCache}>
            <UserAutoCreator>
                <Slot />
            </UserAutoCreator>
        </ClerkProvider>
    );
}

export default function RootLayout() {
    SplashScreen.preventAutoHideAsync();

    const [loaded] = useFonts({
        "Jakarta-Bold": require("../assets/fonts/PlusJakartaSans-Bold.ttf"),
        "Jakarta-ExtraBold": require("../assets/fonts/PlusJakartaSans-ExtraBold.ttf"),
        "Jakarta-ExtraLight": require("../assets/fonts/PlusJakartaSans-ExtraLight.ttf"),
        "Jakarta-Light": require("../assets/fonts/PlusJakartaSans-Light.ttf"),
        "Jakarta-Medium": require("../assets/fonts/PlusJakartaSans-Medium.ttf"),
        "Jakarta-Regular": require("../assets/fonts/PlusJakartaSans-Regular.ttf"),
        "Jakarta-SemiBold": require("../assets/fonts/PlusJakartaSans-SemiBold.ttf"),
    });

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    if (!loaded) {
        return null;
    }

    return <RootLayoutNav />;
}
