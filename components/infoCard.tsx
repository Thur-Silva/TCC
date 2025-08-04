import { Ionicons } from "@expo/vector-icons"
import { Text, TextInput, TouchableOpacity, View } from "react-native"

type InfoCardProps = {
  label: string
  placeholder?: string
  value: string
  onPress?: () => void
  iconName: keyof typeof Ionicons.glyphMap
  editable?: boolean
  isEditing?: boolean
  onChangeText?: (text: string) => void
  multiline?: boolean
  containerClassName?: string
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad' | 'url'
  maxLength?: number
}

const InfoCard = ({
  label,
  placeholder,
  value,
  onPress,
  iconName,
  editable = false,
  isEditing = false,
  onChangeText = () => {},
  multiline = false,
  containerClassName = '',
  keyboardType = 'default',
  maxLength,
}: InfoCardProps) => {
  const safeValue = value || ''
  
  return (
    <View
      className={`flex-row items-center justify-between p-4 mb-4 rounded-xl bg-[#eef5ff] ${multiline ? 'min-h-[100px]' : ''} ${containerClassName}`}
    >
      <View className="flex-row items-center flex-1">
        <Ionicons name={iconName} size={24} color="#1456a7" />
        <View className="ml-4 flex-1">
          <Text className="text-sm font-JakartaMedium text-gray-500">{label}</Text>
          {isEditing ? (
            <TextInput
              className="text-lg font-JakartaBold text-[#1456a7] p-0 flex-1"
              value={safeValue}
              onChangeText={(text) => onChangeText(text || '')}
              multiline={multiline}
              textAlignVertical={multiline ? 'top' : 'auto'}
              placeholder={placeholder ? placeholder : `Digite seu ${label.toLowerCase()}`}
              placeholderTextColor="#A0A0A0"
              editable={editable}
              keyboardType={keyboardType}
              maxLength={maxLength}
            />
          ) : (
            <Text className="text-lg font-JakartaBold text-[#1456a7]">
              {safeValue || `Não informado`}
            </Text>
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
}

export default InfoCard