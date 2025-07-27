import { Message } from '@/types/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function loadMessagesFromCache(chatId: string): Promise<Message[]> {
  try {
    const data = await AsyncStorage.getItem(`chat:${chatId}`);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.warn('[loadMessagesFromCache]', error);
    return [];
  }
}

export async function saveMessagesToCache(chatId: string, messages: Message[]): Promise<void> {
  try {
    await AsyncStorage.setItem(`chat:${chatId}`, JSON.stringify(messages));
  } catch (error) {
    console.warn('[saveMessagesToCache]', error);
  }
}

export async function updateMessageInCache(chatId: string, message: Message): Promise<void> {
  try {
    const messages = await loadMessagesFromCache(chatId);
    const index = messages.findIndex(m => m.id === message.id || m.temp_id === message.temp_id);
    
    if (index !== -1) {
      messages[index] = message;
      await saveMessagesToCache(chatId, messages);
    }
  } catch (error) {
    console.warn('[updateMessageInCache]', error);
  }
}

export async function clearMessageCache(chatId: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(`chat:${chatId}`);
  } catch (error) {
    console.warn('[clearMessageCache]', error);
  }
}