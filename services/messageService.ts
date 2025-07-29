import { fetchAPI } from '@/lib/fecth';
import { Message } from '@/types/types';

export async function fetchMessages(chatId: string): Promise<Message[]> {
  try {
    const response = await fetchAPI(`/(api)/(chats)/messages?chatId=${chatId}`);
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
    const response = await fetchAPI('/(api)/(chats)/messages/send', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    return { success: true, data: response.data };
  } catch (error) {
    console.error('[sendMessage]', error);
    return { success: false };
  }
}
export async function deleteMessage(chatId: string, messageId: string): Promise<boolean> {
  try {
    await fetchAPI(`/(api)/(chats)/${chatId}/messages/${messageId}`, {
      method: 'DELETE',
    });
    return true;
  } catch (error) {
    console.error('[deleteMessage]', error);
    return false;
  }
}

export async function updateMessage(chatId: string, message: Message): Promise<boolean> {
  try {
    await fetchAPI(`/(api)/(chats)/${chatId}/messages/${message.id}`, {
      method: 'PUT',
      body: JSON.stringify({
        senderId: message.sender_id,
        message: message.message,
      }),
      headers: { 'Content-Type': 'application/json' },
    });
    return true;
  } catch (error) {
    console.error('[updateMessage]', error);
    return false;
  }
}

