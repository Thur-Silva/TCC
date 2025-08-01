import Map from "@/components/Map";
import { icons } from "@/constants";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import { useRef } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const RideLayout =({title, children, snapPoints}: { // Pequeno erro de digitação aqui: "RIdeLayout" em vez de "RideLayout"
    title?: string
    children: React.ReactNode;
    snapPoints?: string[]
})=>{
    const bottomSheetRef= useRef<BottomSheet>(null)
    return(
        <GestureHandlerRootView>
            <View className="bg-white flex-1">
                <View className="flex flex-col h-screen bg-blue-500">
                    <View className="flex flex-row absolute z-10 top-16 items-center justify-start px-5">
                        <TouchableOpacity onPress={()=>router.back()}>
                            <View className="w-10 h-10 bg-white rounded-full items-center justify-center">
                                <Image source={icons.backArrow} resizeMode="contain" className="w-6 h-6"/>
                            </View>
                        </TouchableOpacity> 
                        <Text className="text-2xl font-JakartaSemiBold ml-5 bg-[#ffffff8f] rounded-full">
                            {title || "Voltar"}
                        </Text>
                    </View>
                        <Map />
                </View>

                    <BottomSheet ref={bottomSheetRef}
                     snapPoints={snapPoints || ['40%', '85%']}
                      index={0}
                      >
                            <BottomSheetView style={{flex:1, padding:20}}>
                                    {children}
                            </BottomSheetView>
                      </BottomSheet>
            </View>
        </GestureHandlerRootView>
                
    )
};

export default RideLayout; // E aqui também: "RIdeLayout" em vez de "RideLayout"