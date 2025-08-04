import { fetchAPI } from '@/lib/fecth';
import { useState } from 'react';
import { Alert } from 'react-native';


interface DriverRegistrationData {
  // Dados pessoais
  cpf?: string;
  rg?: string;
  contactPhone?: string;
  emergencyPhone?: string;
  gender?: string;
  bio?: string;
  profilePictureUri?: string;
  
  // Dados da CNH e veículo
  cnhInfo?: string;
  cnhValidity?: string;
  carBrand?: string;
  carModel?: string;
  carPlate?: string;
  carColor?: string;
  carYear?: string;
  
  // Documentos
  cnhPictureUri?: string;
  crlvPictureUri?: string;
}

export const useDriverRegistration = (clerkId: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitDriverRegistration = async (data: DriverRegistrationData) => {
    try {
      setIsLoading(true);
      setError(null);

      const payload = {
        clerkId,
        ...data
      };

      console.log('Enviando dados do motorista:', payload);

      const response = await fetchAPI('/api/driver', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      console.log('Resposta do servidor:', response);
      Alert.alert('Sucesso', 'Registro de motorista enviado com sucesso!');
      
      return response.data;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      console.error('Erro ao registrar motorista:', err);
      setError(errorMessage);
      Alert.alert('Erro', 'Não foi possível enviar o registro');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateDriverData = async (updates: Partial<DriverRegistrationData>) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetchAPI(`/api/driver?clerkId=${clerkId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      console.log('Dados do motorista atualizados:', response);
      return response.data;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      console.error('Erro ao atualizar dados do motorista:', err);
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getDriverData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetchAPI(`/api/driver?clerkId=${clerkId}`, {
        method: 'GET',
      });

      return response.data;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      console.error('Erro ao buscar dados do motorista:', err);
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteDriverRegistration = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetchAPI(`/api/driver?clerkId=${clerkId}`, {
        method: 'DELETE',
      });

      Alert.alert('Sucesso', 'Registro de motorista removido com sucesso!');
      return response.data;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      console.error('Erro ao remover registro de motorista:', err);
      setError(errorMessage);
      Alert.alert('Erro', 'Não foi possível remover o registro');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    submitDriverRegistration,
    updateDriverData,
    getDriverData,
    deleteDriverRegistration,
    isLoading,
    error,
  };
};