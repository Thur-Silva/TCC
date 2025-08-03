// services/chatCache.ts
import type { Chat } from '@/types/types'
import AsyncStorage from '@react-native-async-storage/async-storage'

// Função que gera a chave de cache única por usuário
function getChatListKey(userId: string): string {
  return `chat:list:${userId}`
}

/**
 * Salva a lista de chats em cache local, separada por usuário.
 * @param userId - ID do usuário para isolar o cache
 * @param chats - array de chats para salvar
 */
export async function saveChatsToCache(userId: string, chats: Chat[]): Promise<void> {
  try {
    const key = getChatListKey(userId)
    const json = JSON.stringify(chats)
    await AsyncStorage.setItem(key, json)
  } catch (error) {
    console.warn('[saveChatsToCache]', error)
  }
}

/**
 * Carrega a lista de chats do cache local para o usuário específico.
 * @param userId - ID do usuário para buscar o cache correto
 * @returns array de chats em cache ou vazio se não houver
 */
export async function loadChatsFromCache(userId: string): Promise<Chat[]> {
  try {
    const key = getChatListKey(userId)
    const data = await AsyncStorage.getItem(key)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.warn('[loadChatsFromCache]', error)
    return []
  }
}

/**
 * Limpa o cache da lista de chats para um usuário específico.
 * @param userId - ID do usuário para limpar o cache correto
 */
export async function clearChatCache(userId: string): Promise<void> {
  try {
    const key = getChatListKey(userId)
    await AsyncStorage.removeItem(key)
  } catch (error) {
    console.warn('[clearChatCache]', error)
  }
}
