import CustomButton from "@/components/CustomButton";
import { Link, router } from "expo-router";
import { useRef, useState } from "react";
import { Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Swiper from "react-native-swiper";
import { onboarding } from "../../constants/index";
import "../../global.css";

const Onboarding = () => {
    const swiperRef = useRef<Swiper>(null)
    const [activeIndex, serActiveIndex] = useState(0);
    const isLastSliide = activeIndex === onboarding.length - 1;



    return(
        <SafeAreaView className="flex h-full items-center justify-between bg-white">

            {/*Pular*/}
           <View className="w-full flex justify-end items-end p-5">
                <Link href="/sign-in"
                className="text-lg text-center text-general-200"
                >
                    <Text className="text-black-100 text-md font-JakartaBold">Pular  </Text>
                </Link>
           </View>
          

           <Swiper ref={swiperRef}
           loop={false}
           dot={<View className={"w-[32px] h-[4px] max-1 bg-[#E2E8F0]"}/>}
           activeDot={<View className={"w-[32px] h-[4px] max-1 bg-[#0286FF] rounded-full"}/>}

            onIndexChanged = {(index)=> serActiveIndex(index)}
            > 
            {onboarding.map((item) =>( 
                <View key={item.id}  className="flex items-center justify-center p-5" >
                    <Image source={item.image}
                    className="w-full h-[300px]"
                    resizeMode="contain"
                    />

                    <View className="flex flex-row items-center w-full mt-10 justify-center">
                        <Text className="text-black text-3xl font-bold mx-10 text-center">{item.title}</Text>
                    </View>  
                    
                    <Text className="text-lg font-JakartaSemiBold text-center text-[#858585] mx-10 mt-3">{item.description}</Text>
                </View>
            ))}
            </Swiper>
            
            <CustomButton
            title={isLastSliide ? "Comece agora!": "Próximo"}
            onPress={() => 
                isLastSliide ? router.replace('/(auth)/sign-in')
                : swiperRef.current?.scrollBy(1)}
            className="w-11/12 mt-10 mb-5"
            />
           
        </SafeAreaView>
    );
};

export default Onboarding;