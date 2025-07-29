import { fetchAPI } from '@/lib/fecth';
import { Chat } from '@/types/types';

export async function fetchUserChats(userId: number): Promise<Chat[]> {
  try {
    const response = await fetchAPI(`/(api)/(chats)?userId=${userId}`);
    return response.data as Chat[];
  } catch (error) {
    console.error('[fetchUserChats]', error);
    return [];
  }
}
