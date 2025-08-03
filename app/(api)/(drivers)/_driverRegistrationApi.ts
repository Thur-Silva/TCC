import { DriverRegistrationData } from "@/types/types";

// Função para simular a chamada à API de registro de motorista
const registerDriverApi = (data: DriverRegistrationData): Promise<void> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log('Dados recebidos pela API:', data);
            // Simula uma chance de falha para testar o modal de erro
            const success = Math.random() > 0.1; 
            if (success) {
                resolve();
            } else {
                reject(new Error('Falha no servidor. Por favor, tente novamente.'));
            }
        }, 1500); // Atraso simulado de 1.5 segundos
    });
};

export const driverRegistrationApi = {
    registerDriver: registerDriverApi,
};
