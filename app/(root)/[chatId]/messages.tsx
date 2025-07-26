import { useLocalSearchParams } from 'expo-router';

import { useEffect, useState } from 'react';
import { Button, FlatList, Text, TextInput, View } from 'react-native';

import { fetchAPI } from '@/lib/fecth';

type Message = {
  id: string;
  sender_id: string;
  sender_name: string;
  message: string;
  sent_at: string;
  profile_img: string;
};

export default function Conversation() {
  const params = useLocalSearchParams();
  const chatId = params.chatId as string;

  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(true);

  const loadMessages = async () => {
    setLoading(true);
    try {
      const res = await fetchAPI(`/(api)/(chats)/${chatId}/messages`);
      setMessages(res.data);
    } catch {
      // error handling
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, [chatId]);

  const sendMessage = async () => {
    if (!messageText.trim()) return;
    try {
      await fetchAPI(`/(api)/(chats)/${chatId}/messages`, {
        method: 'POST',
        body: JSON.stringify({
          senderId: 1, // user fixo para demo, adaptar conforme auth real
          senderName: 'Ana Silva',
          message: messageText,
        }),
        headers: { 'Content-Type': 'application/json' },
      });
      setMessageText('');
      loadMessages();
    } catch {
      // error handling
    }
  };

  return (
    <View className="flex-1 bg-white p-4">
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="mb-2">
            <Text className="font-bold">{item.sender_name}</Text>
            <Text>{item.message}</Text>
            <Text className="text-xs text-gray-400">{new Date(item.sent_at).toLocaleString()}</Text>
          </View>
        )}
      />
      <View className="flex-row items-center">
        <TextInput
          className="flex-1 border p-2 rounded"
          value={messageText}
          onChangeText={setMessageText}
          placeholder="Digite sua mensagem"
        />
        <Button title="Enviar" onPress={sendMessage} />
      </View>
    </View>
  );
}
