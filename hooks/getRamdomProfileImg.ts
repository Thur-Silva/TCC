import { images } from "@/constants";
import { ImageSourcePropType } from "react-native";

const getRandomProfileImage = (): ImageSourcePropType  => {
  const isWoman = Math.random() < 0.5;

  const womanTyped: ImageSourcePropType = images.womanImageProfile
  const manTyped: ImageSourcePropType = images.manImageProfile

  return isWoman ? womanTyped : manTyped;
};

export default getRandomProfileImage;