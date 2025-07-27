import { useCallback, useEffect, useState } from "react";

// services/fetchAPI.ts
export const fetchAPI = async (url: string, options?: RequestInit) => {
    try {
        const response = await fetch(url, options);

        if (!response.ok) {
            // Se a resposta não for OK (status 4xx ou 5xx),
            // tentamos ler o corpo como texto para ver a mensagem de erro real.
            // Isso é útil para depurar o que o servidor realmente retornou.
            const errorBody = await response.text();
            console.error(`HTTP error! Status: ${response.status}. Response body:`, errorBody);

            // Agora, sim, lançamos um erro.
            // Você pode até incluir o errorBody na mensagem ou como uma propriedade extra.
            throw new Error(`HTTP error! Status: ${response.status} - ${errorBody || response.statusText}`);
        }
        // Se a resposta for OK, aí sim tentamos parsear como JSON.
        return await response.json();
    } catch (error) {
        // Este catch pegará erros de rede ou o erro que acabamos de lançar.
        console.error("Fetch error in fetchAPI:", error);
        throw error; // Propaga o erro para quem chamou fetchAPI
    }
};

export const useFetch = <T>(url: string, options?: RequestInit) => {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const result = await fetchAPI(url, options);
            setData(result.data);
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    }, [url, options]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return {data, loading, error, refetch: fetchData};
};