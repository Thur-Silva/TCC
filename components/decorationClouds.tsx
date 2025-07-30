import { images } from "@/constants";
import { Image, View } from "react-native";

const DecorationClouds = () => {

    return (
        <View className="absolute top-0 left-0 w-full h-full">
            <Image
                source={images.da}
                className="w-full h-full"
                resizeMode="cover"
            />
        </View>
    );
}

export default DecorationClouds;