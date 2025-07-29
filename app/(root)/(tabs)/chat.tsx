import { useRouter } from 'expo-router';
import { FlatList, Image, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ChatsLayout from '@/components/chatsLayout';
import { fetchAPI } from '@/lib/fecth';
import type { Chat } from '@/types/types';

import { useEffect, useState } from 'react';

import HomeHeader from '@/components/HomeHeader';
import LoadingLayout from '@/components/loadingLayout';
import { icons } from '@/constants';

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
      <HomeHeader
        
      />
    { loading ? (
      <LoadingLayout />
    ):(

      <View className="flex-1">
        <FlatList
          data={chats}
          keyExtractor={(item) => item.id}
          renderItem={renderChatItem}
          contentContainerStyle={{ paddingVertical: 8 }}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center">
              <Image
                source={icons.noMessages}
                className="w-[300px] h-[300px] mb-4 mt-[30%]"
                resizeMode="contain"
              />
              <Text className="text-4xl mt-5 font-JakartaExtraBold">
                Estranho...
              </Text>
              <Text className="text-xl mt-3 text-gray-500 font-Jakarta">
                Você ainda não iniciou nenhuma conversa.
              </Text>
            </View>
          }
        />
      </View>
    )}

  {/*
      <ErrorModal
        isErrorVisible={errorVisible}
        errorMessage={errorMessage}
        onClose={onCloseError}
      />
  
  */}

    </SafeAreaView>

  );
}
