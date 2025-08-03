// components/ChatsLayout.tsx
import { icons } from '@/constants';
import type { Chat } from '@/types/types';
import { Image, Text, TouchableOpacity, View } from 'react-native';

interface ChatsLayoutProps {
  item: Chat;
  onPress?: () => void;
}

//TODO: Colocar essa função direto na hora de gerar a img do profile no DB para que assim as imgs não mudem sempre que a page seja atualizada

const getRandomDefaultImage = () => {
  
};

export default function ChatsLayout({ item, onPress }: ChatsLayoutProps) {
  const { partnerName, partnerProfileImg, lastMessage, lastMessageAt } = item;
  return (
    <TouchableOpacity onPress={onPress} className="w-full flex-row items-center justify-between py-5 px-4">
      <Image source={partnerProfileImg ? { uri: partnerProfileImg } : icons.defaultUser} className="w-16 h-16 rounded-full" />
      <View className="flex-1 ml-4">
        <Text className="text-lg font-JakartaSemiBold">{partnerName}</Text>
        <Text className="text-sm text-gray-500 font-Jakarta">{lastMessage}</Text>
      </View>
      <Text className="text-xs text-gray-400">
        {lastMessageAt
          ? new Date(lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          : ''}
      </Text>
    </TouchableOpacity>
  );
}
