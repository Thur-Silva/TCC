import { icons } from "@/constants";
import { Image, View } from "react-native";

interface DecorationCloudsProps {
    className?: string;
}

const DecorationClouds = ({className}: DecorationCloudsProps ) => {

    return (
        <View className={`absolute items-center top-0 left-0 w-full h-full ${className}`}>
            <Image
                source={icons.darkCloud}
                className="w-full h-[100] mt-[180%] ml-[-220] absolute"
                resizeMode="contain"
            />

              <Image
                source={icons.blueCloud}
                className="w-ful h-[170] mt-[180%]"
                   resizeMode="contain"
            />

              <Image
                source={icons.blueCloud}
                className="w-ful h-[60] mt-[-50%] ml-[60%]"
                 resizeMode="contain"
            />
        </View>
    );
}

export default DecorationClouds;