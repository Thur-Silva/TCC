import { ButtonProps } from "@/types/types";
import { Text, TouchableOpacity } from "react-native";

const getVariantStyle = (variant: ButtonProps['bgVariant']) => {
    switch(variant){
        case "secondary":
            return 'bg-gray-500';
        case "danger":
            return 'bg-red-500';
        case "success":
            return 'bg-green-500';
        case "outline":
            return 'bg-transparant border-neutral-300 border-[0.5px]';
        default:
            return 'bg-[#0286ff]';
    }
}

const getTextVariantStyle = (variant: ButtonProps['textVariant']) => {
    switch(variant){
        case "primary":
            return 'text-black';
        case "secondary":
            return 'text-gray-100';
        case "danger":
            return 'text-red-100';
        case "success":
            return 'text-green-100';
        default:
            return 'text-white';
    }
}

const CustomButton = ({
    onPress,
     title, 
     bgVariant = "primary", 
     textVariant = "default", 
     IconLeft, 
     IconRight,
     className,
     ...props
    }:ButtonProps) => (

    <TouchableOpacity  onPress={onPress}   className={`rounded-full flex flex-row justify-center 
    items-center shadow-md shadow-neutral-400/70 bg-primary-500 p-5  ${bgVariant ? bgVariant : 'bg-primary-500'} ${className ? className : 'w-full'}`} 
    {...props}
    >
        {IconLeft && <IconLeft />}
            <Text className={`text-lg font-bold ${getTextVariantStyle(textVariant)}`}>{title}</Text>
        {IconRight && <IconRight />}
    </TouchableOpacity>
)

export default CustomButton;

