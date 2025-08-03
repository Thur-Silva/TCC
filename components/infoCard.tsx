import { Ionicons } from "@expo/vector-icons"
import { Text, TextInput, TouchableOpacity, View } from "react-native"

type InfoCardProps = {
  label: string
  value: string
  onPress?: () => void
  iconName: keyof typeof Ionicons.glyphMap
  editable?: boolean
  isEditing?: boolean
  onChangeText?: (text: string) => void
}

const InfoCard = ({
  label,
  value,
  onPress,
  iconName,
  editable = false,
  isEditing = false,
  onChangeText = () => {},
}: InfoCardProps) => (
  <View className="flex-row items-center justify-between p-4 mb-4 rounded-xl bg-[#eef5ff]">
    <View className="flex-row items-center flex-1">
      <Ionicons name={iconName} size={24} color="#1456a7" />
      <View className="ml-4 flex-1">
        <Text className="text-sm font-JakartaMedium text-gray-500">{label}</Text>
        {isEditing ? (
          <TextInput
            className="text-lg font-JakartaBold text-[#1456a7] p-0"
            value={value}
            onChangeText={onChangeText}
          />
        ) : (
          <Text className="text-lg font-JakartaBold text-[#1456a7]">{value}</Text>
        )}
      </View>
    </View>
    {editable && !isEditing && (
      <TouchableOpacity onPress={onPress}>
        <Ionicons name="create-outline" size={24} color="#4598ff" />
      </TouchableOpacity>
    )}
  </View>
)

export default InfoCard
