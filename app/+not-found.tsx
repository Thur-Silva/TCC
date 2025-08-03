import CustomButton from '@/components/CustomButton';
import { images } from '@/constants';
import { router } from 'expo-router';
import { Image, ScrollView, Text, View } from 'react-native';



export default function NotFoundScreen() {
  return (
    <>
      <ScrollView>
        <View className='w-full h-[1000px] bg-white flex flex-1 justify-center items-center'>
      

          <View className='flex flex-row justify-center mt-[50px]'>
             <Image source={images.bike} className='w-full h-[350px] ' resizeMode='contain'/>
          </View>
        <View className='flex flex-col justify-center items-center mt-[50px]'>
                      <Text className='text-4xl font-JakartaExtraBold'>Que estranho...</Text>
          <Text className='text-2xl font-JakartaSemiBold mt-10 mb-[100px]'>Não foi possível carregar essa página.</Text>
        </View>
         
              <CustomButton
            title={"Inicio"}
            onPress={() => 
                router.replace('/(root)/(tabs)/home')}
            className="w-9/12 mt-10 mb-5"
            />
           
        </View>
      </ScrollView>

    </>
  );
}
