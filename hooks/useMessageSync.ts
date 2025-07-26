// hooks/useMessageSync.ts
import { fetchAPI } from '@/lib/fecth';
import { Message } from '@/types/types';
import NetInfo from '@react-native-community/netinfo';
import { useEffect } from 'react';

export default function useMessageSync(chatId?: string, messages: Message[] = []) {
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (!state.isConnected || !state.isInternetReachable) return;

      const pendings = messages.filter((m) => m.status === 'pending' || m.status === 'failed');

      pendings.forEach(async (msg) => {
        if (!msg.temp_id) return;
        try {
          const res: { data: { id: string; sent_at: string } } = await fetchAPI(`/api/chats/${chatId}/messages`, {
            method: 'POST',
            body: JSON.stringify({
              senderId: msg.sender_id,
              senderName: msg.sender_name,
              message: msg.message
            })
          });

          msg.id = res.data.id;
          msg.sent_at = res.data.sent_at;
          msg.status = 'sent';
          delete msg.temp_id;
        } catch (e) {
          msg.status = 'failed';
        }
      });
    });
    return unsubscribe;
  }, [chatId, messages]);
}