import LottieView from 'lottie-react-native';
import { ActivityIndicator, Platform, View } from 'react-native';



const LoadingLayout = () => {
    const isWeb = Platform.OS === 'web';
    return (
    <View className='flex-1 items-center justify-center bg-white'>
        {!isWeb && (

        <View className='mt-[-40%]'>
            <LottieView
            source={require('@/assets/animations/loading.json')}
            autoPlay
            loop
            style={{ width: 600, height: 600 }}
            resizeMode='contain'
            />
        </View>

        )}
            
        <ActivityIndicator size={'large'} color='#0286ff' className=' absolute mt-[200px] ' />

    </View>
    );

}


export default LoadingLayout;