// components/HomeHeader.tsx
import GoogleTextInput from "@/components/GoogleTextInput";
import { icons } from "@/constants";
import { useLocationStore } from "@/store";
import { HomeHeaderProps } from "@/types/types";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Image,
  Keyboard,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const HomeHeader = ({
   showInput,
   globalClassName
}: HomeHeaderProps) => {
  const router = useRouter();
  const { setDestinationLocation } = useLocationStore();
  const [showAutocomplete, setShowAutocomplete] = useState(true);

  const handleDestinationPress = (location: {
    latitude: number;
    longitude: number;
    address: string;
  }) => {
    setDestinationLocation(location);
    router.push("/(root)/find-ride");
  };

  return (
    <>
    <View className={`${globalClassName && globalClassName} w-full`}>

      {showAutocomplete && (
        <Pressable
          className="absolute top-0 left-0 right-0 bottom-0 z-10"
          onPress={() => {
            Keyboard.dismiss();
            setShowAutocomplete(false);
          }}
        />
      )}

      <View className="w-full h-[150px] bg-[#1456a7] justify-center rounded-b-3xl mt-[-50px]">
        {!showInput && (
          <View className="flex-row items-center justify-center mt-16 ml-[-28px]">
            <Image
              source={icons.Logo}
              className="w-[120px] h-[120px] mr-[-20px]"
              resizeMode="contain"
            />

            <View className="ml-1 pb-5 items-center">
              <Text className="text-5xl mb-[-5] font-bold">
                <Text className="text-[#4598ff]">G</Text>
                <Text className="text-white">O</Text>
              </Text>
              <Text className="text-5xl font-bold">
                <Text className="text-white">T</Text>
                <Text className="text-[#4598ff]">O</Text>
              </Text>
            </View>
          </View>
        )}

        {showInput && (
          <TouchableOpacity
            onPress={() => {}}
            className="justify-center mt-16 ml-7 items-center w-[50px] h-[50px]"
          >
            <Image
              source={icons.Logo}
              className="w-[120px] h-[120px]"
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}

        {showInput && (
          <View className="absolute w-full mt-5 z-50 px-5">
            <GoogleTextInput
              icon={icons.search}
              containerStyle="bg-white shadow-md shadow-neutral-300 rounded-xl"
              handlePress={handleDestinationPress}
              style={{ width: "75%", marginTop: "5%", left: 90 }}
              onFocus={() => setShowAutocomplete(true)}
              onBlur={() => setTimeout(() => setShowAutocomplete(false), 100)}
              showAutocomplete={showAutocomplete}
            />
          </View>
        )}
      </View>

      </View>
    </>
  );
};

export default HomeHeader;
