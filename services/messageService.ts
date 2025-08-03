import { fetchAPI } from '@/lib/fecth';
import { Message } from '@/types/types';

export async function fetchMessages(chatId: string): Promise<Message[]> {
  try {
    const response = await fetchAPI(`/(api)/(chats)/messages/route?chatId=${chatId}`);
    return response.data.map((msg: any) => ({
      id: msg.id,
      sender_id: Number(msg.sender_id),
      sender_name: msg.sender_name,
      message: msg.message,
      sent_at: msg.sent_at,
      profile_img: msg.profile_img
    }));
  } catch (error) {
    console.error('[fetchMessages]', error);
    return [];
  }
}

export async function sendMessage(payload: {
  chatId: string;
  senderId: number;
  message: string;
}): Promise<{ success: boolean; data?: Message }> {
  try {
    const response = await fetchAPI('/(api)/(chats)/messages/route', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    return { success: true, data: response.data };
  } catch (error) {
    console.error('[sendMessage]', error);
    return { success: false };
  }
}

