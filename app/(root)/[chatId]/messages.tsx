import { fetchAPI } from '@/lib/fecth';
import type { Message } from '@/types/types';
import { Ionicons } from '@expo/vector-icons';
import NetInfo from '@react-native-community/netinfo';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Image,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

import { icons } from '@/constants';
import {
    loadMessagesFromCache,
    saveMessagesToCache,
} from '@/services/messageCache';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

type MessageProps = {
    currentUserId: number;
};

function MessageBubble({
    message,
    isCurrentUser,
}: {
    message: Message;
    isCurrentUser: boolean;
}) {
    const sentTime = new Date(message.sent_at).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
    });

    return (
        <View
            className={`max-w-[75%] px-4 py-3 mb-2 flex-col items-end rounded-2xl ${
                isCurrentUser
                    ? 'bg-[#3a7ed2] self-end rounded-br-lg'
                    : 'bg-gray-200 self-start rounded-bl-lg'
            } shadow-md`}
            style={{
                elevation: 3,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.2,
                shadowRadius: 1.5,
            }}
        >
            <Text
                className={`${isCurrentUser ? 'text-white' : 'text-gray-900'
                    } text-base font-JakartaRegular`}
            >
                {message.message}
            </Text>
            <Text
                className={`text-xs pt-1 ml-2 ${
                    isCurrentUser ? 'text-gray-200' : 'text-gray-500'
                } self-end`}
                style={{ fontVariant: ['tabular-nums'] }}
            >
                {sentTime}
            </Text>
        </View>
    );
}

export default function MessageScreen({}: MessageProps) {
    const router = useRouter();
    const params = useLocalSearchParams();
    const chatId = params.chatId as string;
    const interlocutorName = params.name as string;
    const interlocutorPhotoUrl = params.photoUrl as string;
    const interlocutorUserId = (params.userId as string) ?? chatId;
    const currentUserId = params.currentUserId;
    const partnerId = params.partnerId as number | string;
    const clerk_id = params.clerkId as string | undefined;

    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');
    const [isConnected, setIsConnected] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const flatListRef = useRef<FlatList<Message>>(null);

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener((state) => {
            setIsConnected(Boolean(state.isConnected));
        });
        return () => unsubscribe();
    }, []);

    async function loadMessagesWithCache() {
        setIsLoading(true);
        const cached = await loadMessagesFromCache(chatId);
        if (cached.length > 0) setMessages(cached);

        try {
            const response = await fetchAPI(
                `/(api)/(chats)/[chatId]/messages/route?chatId=${chatId}`
            );
            const messagesArray = response.data;
            if (Array.isArray(messagesArray)) {
                setMessages(messagesArray);
                await saveMessagesToCache(chatId, messagesArray);
            }
        } catch (error) {
            console.error('Erro ao carregar mensagens:', error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        if (chatId) {
            loadMessagesWithCache();
        }
    }, [chatId]);

    useEffect(() => {
        if (flatListRef.current && messages.length > 0) {
            flatListRef.current.scrollToEnd({ animated: true });
        }
    }, [messages]);

    async function sendMessage() {
        if (!inputText.trim() || !isConnected) return;

        try {
            await fetchAPI(`/(api)/(chats)/[chatId]/messages/route?chatId=${chatId}`, {
                method: 'POST',
                body: JSON.stringify({
                    senderId: currentUserId,
                    senderName: 'Você',
                    message: inputText.trim(),
                }),
                headers: { 'Content-Type': 'application/json' },
            });
            setInputText('');
            loadMessagesWithCache();
        } catch (error) {
            console.error('Erro ao enviar mensagem:', error);
        }
    }

    function renderMessage({ item }: { item: Message }) {
        if (!item || !item.id || item.sender_id === undefined || !item.message)
            return null;
        const isCurrentUser = String(item.sender_id) === String(currentUserId);
        return <MessageBubble message={item} isCurrentUser={isCurrentUser} />;
    }

    const EmptyListPlaceholder = () => (
        <View className="flex-1 items-center justify-center p-8">
            <Ionicons name="chatbox-outline" size={60} color="#9ca3af" />
            <Text className="text-xl font-JakartaMedium text-gray-500 mt-4 text-center">
                Diga olá!
            </Text>
            <Text className="text-base font-JakartaLight text-gray-500 mt-1 text-center">
                A sua conversa com {interlocutorName} começa aqui.
            </Text>
        </View>
    );

    return (
        <KeyboardAwareScrollView
            className="flex-1 bg-gray-50"
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
            extraScrollHeight={260}
            enableOnAndroid
            enableAutomaticScroll
        >
            {/* Top Bar */}
            <View className="bg-[#1456a7] pt-14 pb-4 px-4 shadow-lg flex-row items-center justify-between">
                <View className="flex-row items-center">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="p-2 mr-2"
                        accessibilityRole="button"
                    >
                        <Ionicons name="arrow-back" size={28} color="white" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => {
                            if (partnerId) {
                                router.push({
                                    pathname: '/individualProfile',
                                    params: { partnerId: partnerId, clerkId: clerk_id },
                                });
                            } else {
                                console.warn("Navegação cancelada: partnerId não encontrado.");
                            }
                        }}
                        className="flex-row items-center flex-1"
                    >
                        <Image
                            source={interlocutorPhotoUrl !== "" ? { uri: interlocutorPhotoUrl } : icons.defaultUser}
                            className="w-12 h-12 rounded-full border-2 border-white"
                            resizeMode="cover"
                        />
                        <Text
                            className="text-white text-xl font-JakartaSemiBold ml-4"
                            numberOfLines={1}
                        >
                            {interlocutorName}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Ícone de perfil para navegação */}
                <TouchableOpacity
                    onPress={() => {
                        if (partnerId) {
                            router.push({
                                pathname: '/individualProfile',
                                params: { partnerId: partnerId, clerkId: clerk_id },
                            });
                        } else {
                            console.warn("Navegação cancelada: partnerId não encontrado.");
                        }
                    }}
                    className="p-2 ml-2"
                    accessibilityRole="button"
                >
                    <Ionicons name="person-circle-outline" size={36} color="white" />
                </TouchableOpacity>
            </View>

            {/* Messages List */}
            {isLoading ? (
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color="#1456a7" />
                </View>
            ) : (
                <FlatList
                    ref={flatListRef}
                    data={messages}
                    keyExtractor={(item) => String(item.id)}
                    renderItem={renderMessage}
                    contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 10, paddingTop: 8, flexGrow: 1 }}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={EmptyListPlaceholder}
                />
            )}

            {/* Input + Send */}
            <View className="flex-row items-center px-4 py-2 bg-white border-t border-gray-200 pb-8">
                <View className="relative flex-1">
                    <TextInput
                        className={`flex-1 h-[45px] border rounded-full px-4 py-2 text-base justify-center text-black ${
                            isConnected ? 'border-gray-300 bg-gray-100' : 'border-red-400 bg-red-50'
                        }`}
                        value={inputText}
                        onChangeText={setInputText}
                        placeholder={isConnected ? ` Digite sua mensagem...` : ` Sem conexão...`}
                        placeholderTextColor="#999"
                        multiline
                        textAlignVertical="center"
                        autoCapitalize="sentences"
                        autoCorrect
                        keyboardAppearance="light"
                        editable={isConnected}
                    />
                    {!isConnected && (
                        <Ionicons
                            name="cloud-offline-outline"
                            size={20}
                            color="#dc2626"
                            className="absolute right-4 top-1/2 -mt-2.5"
                        />
                    )}
                </View>

                <TouchableOpacity
                    onPress={sendMessage}
                    className={`ml-3 w-12 h-12 rounded-full justify-center items-center shadow-md ${
                        inputText.trim() && isConnected ? 'bg-[#1456a7]' : 'bg-gray-300'
                    }`}
                    accessibilityRole="button"
                    disabled={!inputText.trim() || !isConnected}
                >
                    <Ionicons name="arrow-up" size={24} color="white" />
                </TouchableOpacity>
            </View>
        </KeyboardAwareScrollView>
    );
}