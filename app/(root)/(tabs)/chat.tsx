import ChatsLayout from '@/components/chatsLayout';
import ErrorModal from '@/components/ErrorModal';
import LoadingLayout from '@/components/loadingLayout';
import { icons } from '@/constants';
import { fetchAPI } from '@/lib/fecth';
import { loadChatsFromCache, saveChatsToCache } from '@/services/chatCache';
import type { Chat } from '@/types/types';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { FlatList, Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Simulação do user autenticado (substituir por contexto do Clerk se disponível)
function useAuthUser() {
  return { id: '1' };
}

export default function ChatList() {
  const router = useRouter();
  const user = useAuthUser();
  const userId = user.id;

  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [errorVisible, setErrorVisible] = useState(false);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      setLoading(true);
      const cachedChats = await loadChatsFromCache(userId);
      if (isMounted && cachedChats.length > 0) {
        setChats(cachedChats);
        setLoading(false);
      }

      try {
        const response = await fetchAPI(`/(api)/(chats)/route?userId=${userId}`);
        const freshChats = response.data as Chat[];
        console.log('Chats fetched:', freshChats);

        if (isMounted) {
          setChats(freshChats);
          setLoading(false);
          await saveChatsToCache(userId, freshChats);
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage('Não foi possível carregar os chats.');
          setErrorVisible(true);
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [userId]);

  function onCloseError() {
    setErrorVisible(false);
  }

  // Lógica de filtro para a busca
  const filteredChats = chats.filter(chat =>
    chat.partnerName.toLowerCase().includes(searchText.toLowerCase())
  );

  function renderChatItem({ item }: { item: Chat }) {
    return (
      <ChatsLayout
        item={item}
        onPress={() =>
          router.push({
            pathname: '/[chatId]/messages',
            params: {
              chatId: item.id,
              currentUserId: userId.toString(),
              name: item.partnerName,
              photoUrl: item.partnerProfileImg,
              partnerId: item.partnerId,
            },
          })
        }
      />
    );
  }

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="light" />
      <SafeAreaView className="bg-[#1456a7]">
        <View className="flex-row items-center justify-between p-4 shadow-md">
          <Text className="text-white text-2xl font-JakartaBold">Chats</Text>
          <TouchableOpacity>
            <Ionicons name="create-outline" size={32} color="white" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <View className="px-4 pt-4">
        <View className="flex-row items-center bg-gray-100 rounded-full px-4 py-3">
          <Ionicons name="search" size={20} color="gray" />
          <TextInput
            className="flex-1 ml-2 text-base font-JakartaMedium text-gray-700"
            placeholder="Buscar conversas..."
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
      </View>

      {loading ? (
        <LoadingLayout />
      ) : (
        <View className="flex-1 px-4 mt-2">
          <FlatList
            data={filteredChats}
            keyExtractor={(item) => item.id}
            renderItem={renderChatItem}
            contentContainerStyle={{ paddingVertical: 8 }}
            ListEmptyComponent={
              <View className="flex-1 items-center justify-center mt-[30%]">
                <Image
                  source={icons.noMessages}
                  className="w-[200px] h-[200px] mb-4"
                  resizeMode="contain"
                />
                <Text className="text-3xl mt-5 font-JakartaExtraBold text-[#1456a7]">
                  Sem conversas
                </Text>
                <Text className="text-base mt-2 text-gray-500 text-center font-Jakarta">
                  Você ainda não iniciou nenhuma conversa.
                </Text>
              </View>
            }
          />
        </View>
      )}

      <ErrorModal
        isErrorVisible={errorVisible}
        errorMessage={errorMessage}
        onClose={onCloseError}
      />
    </View>
  );
}