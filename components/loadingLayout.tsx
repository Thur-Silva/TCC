import LottieView from 'lottie-react-native';
import { ActivityIndicator, View } from 'react-native';



const LoadingLayout = () => {
    return (
    <View className='flex-1 items-center justify-center bg-white'>
        <View className='mt-[-40%]'>
            <LottieView
            source={require('@/assets/animations/loading.json')}
            autoPlay
            loop
            style={{ width: 600, height: 600 }}
            resizeMode='contain'
            />
        </View>
            

        <ActivityIndicator size={'large'} color='#0286ff' className=' absolute mt-[200px] ' />

    </View>
    );

}


export default LoadingLayout;