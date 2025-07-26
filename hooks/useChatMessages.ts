// hooks/useChatMessages.ts
import { fetchAPI } from '@/lib/fecth';
import { loadMessagesFromCache, saveMessagesToCache } from '@/services/messageCache';
import { Message } from '@/types/types';
import { useEffect, useState } from 'react';

export default function useChatMessages(chatId?: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState('');
  const [isErrorVisible, setErrorVisible] = useState(false);

  useEffect(() => {
    if (!chatId) return;

    async function syncMessages() {
    if (!chatId) return;
      try {
        const cached = await loadMessagesFromCache(chatId);
        setMessages(cached);

        const res: { data: any[] } = await fetchAPI(`/(api)/(chats)/messages?chatId=${chatId}`);
        const serverMessages: Message[] = res.data.map((msg) => ({
          id: msg.id,
          sender_id: Number(msg.sender_id),
          sender_name: msg.sender_name,
          message: msg.message,
          sent_at: msg.sent_at,
          profile_img: msg.profile_img
        }));

        setMessages(serverMessages);
        await saveMessagesToCache(chatId, serverMessages);
      } catch (e) {
        console.error('Erro sync messages:', e);
        setError('Falha ao carregar mensagens');
        setErrorVisible(true);
      }
    }

    syncMessages();
  }, [chatId]);

  const onCloseError = () => setErrorVisible(false);
  const partner = messages.find((m) => m.sender_id !== 1);

  return { messages, setMessages, partner, error, isErrorVisible, onCloseError };
}
