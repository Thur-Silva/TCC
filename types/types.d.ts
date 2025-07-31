import { ImageSourcePropType, TextInputProps, TouchableOpacityProps, ViewStyle } from "react-native";

declare interface Driver {
    driver_id: number;
    first_name: string;
    last_name: string;
    profile_image_url: string;
    car_image_url: string;
    car_seats: number;
    rating: number;
}

declare interface MarkerData {
    latitude: number;
    longitude: number;
    id: number;
    title: string;
    profile_image_url: string;
    car_image_url: string;
    car_seats: number;
    rating: number;
    first_name: string;
    last_name: string;
    time?: number;
    price?: string;
}

declare interface SuccessModalProps{

     ShowSuccessModal:boolean;

     title?: string;

     description:string;

     onClose: () => void;

     ButtomText?:string;

     ButtomOnPress?: void;

     link?: any

}

export interface HomeHeaderProps {
    showInput?:  boolean ;
    globalClassName?: string;
}



declare interface ErrorModalProps {

    title?: string;

    isErrorVisible: boolean;

    errorMessage: any;

     icon?: ImageSourcePropType;

     iconStyle?: string;
     
     secondOption?: boolean;
     
     onFirstButtonPress?: () => void;
     

    onClose: () => void;

}

declare interface MapProps {
    destinationLatitude?: number;
    destinationLongitude?: number;
    onDriverTimesCalculated?: (driversWithTimes: MarkerData[]) => void;
    selectedDriver?: number | null;
    onMapReady?: () => void;
}

declare interface Ride {
    origin_address: string;
    destination_address: string;
    origin_latitude: number;
    origin_longitude: number;
    destination_latitude: number;
    destination_longitude: number;
    ride_time: number;
    fare_price: number;
    payment_status: string;
    driver_id: number;
    user_email: string;
    created_at: string;
    driver: {
        first_name: string;
        last_name: string;
        car_seats: number;
    };
}



declare interface ButtonProps extends TouchableOpacityProps {
    title: string;
    bgVariant?: string;
    textVariant?: "primary" | "default" | "secondary" | "danger" | "success";
    IconLeft?: React.ComponentType<any>;
    IconRight?: React.ComponentType<any>;
    className?: string;
}

declare interface GoogleInputProps {
    icon?: string;
    initialLocation?: string;
    style?: ViewStyle
    containerStyle?: string;
    textInputBackgroundColor?: string;
    handlePress: ({
                      latitude,
                      longitude,
                      address,
                  }: {
        latitude: number;
        longitude: number;
        address: string;
    }) => void;
}

declare interface InputFieldProps extends TextInputProps {
    label: string;
    icon?: any;
    secureTextEntry?: boolean;
    labelStyle?: string;
    containerStyle?: string;
    inputStyle?: string;
    iconStyle?: string;
    className?: string;
}

declare interface PaymentProps {
    fullName: string;
    email: string;
    amount: string;
    driverId: number;
    rideTime: number;
}

declare interface LocationStore {
    userLatitude: number | null;
    userLongitude: number | null;
    userAddress: string | null;
    destinationLatitude: number | null;
    destinationLongitude: number | null;
    destinationAddress: string | null;
    setUserLocation: ({
                          latitude,
                          longitude,
                          address,
                      }: {
        latitude: number;
        longitude: number;
        address: string;
    }) => void;
    setDestinationLocation: ({
                                 latitude,
                                 longitude,
                                 address,
                             }: {
        latitude: number;
        longitude: number;
        address: string;
    }) => void;
}

declare interface DriverStore {
    drivers: MarkerData[];
    selectedDriver: number | null;
    setSelectedDriver: (driverId: number) => void;
    setDrivers: (drivers: MarkerData[]) => void;
    clearSelectedDriver: () => void;
}

declare interface DriverCardProps {
    item: MarkerData;
    selected: number;
    setSelected: () => void;
}

export interface Chat {
  id: string;
  partnerName: string;
  partnerProfileImg: string;
  lastMessage: string;
  lastMessageAt: string; // ISO string ou Date
}

export interface Message {
  id: string;
  sender_id: string; // ou number, dependendo do DB
  sender_name: string;
  message: string;
  sent_at: string; // ISO string ou Date
  profile_img: string;
  status: 'pending' | 'sent' | 'failed';
  temp_id?: string; // usado para mensagens pendentes antes de serem enviadas
}

export interface ChatParticipant {
  id: string;
  chat_id: string;
  user_id: number;
  joined_at: string; // ISO string ou Date
}

export interface User {
  id: number | string;
  name: string;
  email?: string;
  profile_img?: string;
  clerk_id?: string;
}