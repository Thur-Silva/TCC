import { Ionicons } from "@expo/vector-icons";
import { Image, Text, TouchableOpacity, View } from "react-native";

import { formatTime } from "@/lib/utils";
import { DriverCardProps } from "@/types/types";

const DriverCard = ({ item, selected, setSelected }: DriverCardProps) => {
    return (
        <TouchableOpacity
            onPress={setSelected}
            className={`
                ${selected === item.id ? "bg-[#eef5ff] border-[#4598ff] border-2" : "bg-white border-gray-200 border"} 
                flex-row items-center p-4 my-2 rounded-2xl shadow-md
            `}
        >
            <Image
                source={{ uri: item.profile_image_url! }}
                className="w-20 h-20 rounded-full border-2 border-gray-300"
            />

            <View className="flex-1 flex-col mx-4">
                <View className="flex-row items-center mb-1">
                    <Text className="text-xl font-JakartaBold text-[#1456a7]">{item.title}</Text>
                    <View className="flex-row items-center ml-2">
                        <Ionicons name="star" size={16} color="#F5B21E" />
                        <Text className="text-base font-JakartaMedium text-gray-600 ml-1">
                            {item.rating || "4"}
                        </Text>
                    </View>
                </View>

                <View className="flex-row flex-wrap items-center">
                    <View className="flex-row items-center mr-3">
                        <Ionicons name="cash-outline" size={16} color="#1456a7" />
                        <Text className="text-sm font-JakartaRegular text-gray-700 ml-1">
                            R$ {item.price}
                        </Text>
                    </View>
                    
                    <View className="flex-row items-center mr-3">
                        <Ionicons name="time-outline" size={16} color="#1456a7" />
                        <Text className="text-sm font-JakartaRegular text-gray-700 ml-1">
                            {formatTime(item.time || "Agendamento flexível")}
                        </Text>
                    </View>

                    <View className="flex-row items-center">
                        <Ionicons name="people-outline" size={16} color="#1456a7" />
                        <Text className="text-sm font-JakartaRegular text-gray-700 ml-1">
                            {item.car_seats} assentos
                        </Text>
                    </View>
                </View>
            </View>

            <Image
                source={{ uri: item.car_image_url! }}
                className="h-16 w-16"
                resizeMode="contain"
            />
        </TouchableOpacity>
    );
};

export default DriverCard;