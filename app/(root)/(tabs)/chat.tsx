import { useRouter } from 'expo-router';
import { FlatList, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ChatsLayout from '@/components/chatsLayout';
import { fetchAPI } from '@/lib/fecth';
import type { Chat } from '@/types/types';

import { useEffect, useState } from 'react';

import ErrorModal from '@/components/ErrorModal';

// Simulação do user autenticado (substituir por contexto do Clerk se disponível)
function useAuthUser() {
  return { id: 1 };
}

export default function ChatList() {
  const router = useRouter();
  const user = useAuthUser();
  const userId = user.id;

  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [errorVisible, setErrorVisible] = useState(false);

  useEffect(() => {
    setLoading(true);
  fetchAPI(`/api/chats?userId=${userId}`)
      .then((res: { data: Chat[] }) => {
        setChats(res.data);
      })
      .catch(() => {
        setErrorMessage('Não foi possível carregar os chats.');
        setErrorVisible(true);
      })
      .finally(() => setLoading(false));
  }, [userId]);

  function onCloseError() {
    setErrorVisible(false);
  }

  function renderChatItem({ item }: { item: Chat }) {
    return (
      <ChatsLayout
        item={item}
        onPress={() =>
          router.push({
            pathname: '/[chatId]/messages',
            params: { chatId: item.id },
          })
        }
      />
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white px-0">
      <FlatList
        data={chats}
        keyExtractor={(item) => item.id}
        renderItem={renderChatItem}
        contentContainerStyle={{ paddingVertical: 8 }}
        ListEmptyComponent={<Text className="text-center mt-10">Nenhum chat encontrado.</Text>}
      />

      <ErrorModal
        isErrorVisible={errorVisible}
        errorMessage={errorMessage}
        onClose={onCloseError}
      />

    </SafeAreaView>

  );
}
