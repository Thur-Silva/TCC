// hooks/useAutoCreateUser.ts

import { fetchAPI } from '@/lib/fecth';
import { useUser } from '@clerk/clerk-expo';
import { useEffect } from 'react';

export const useAutoCreateUser = () => {
    const { user, isLoaded } = useUser();

    const createUserIfNeeded = async () => {
        if (!user || !isLoaded) return;

        try {
            // Verifica se usuário já existe
            try {
                await fetchAPI(`/(api)/user?clerkId=${user.id}`);
                return; // Já existe
            } catch {
                // Não existe, vamos criar
            }

            // Dados do Google/Clerk
            const userData = {
                name: user.fullName || user.firstName || 'Usuário',
                email: user.primaryEmailAddress?.emailAddress || '',
                clerkId: user.id,
                imageUrl: user.imageUrl || null
            };

            // Cria usuário
            await fetchAPI('/(api)/user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData),
            });

            console.log('✅ Usuário Google criado automaticamente');

        } catch (error) {
            console.error('❌ Erro ao criar usuário:', error);
        }
    };

    useEffect(() => {
        if (isLoaded && user) {
            createUserIfNeeded();
        }
    }, [isLoaded, user?.id]);

    return { user, isLoaded };
};