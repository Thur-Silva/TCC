import { Ride } from "@/types/types";

export const sortRides = (rides: Ride[]): Ride[] => {
    const result = rides.sort((a, b) => {
        const dateA = new Date(`${a.created_at}T${a.ride_time}`);
        const dateB = new Date(`${b.created_at}T${b.ride_time}`);
        return dateB.getTime() - dateA.getTime();
    });

    return result.reverse();
};

export function formatTime(minutes: number | string): string {
    // O tipo string server somente para exibir mesagens específicas como:
    // Entre em contato com o motorista, Agende, etc
    if( typeof minutes === 'string'){
        return minutes
    }

    const formattedMinutes = +minutes?.toFixed(0) || 0;

    if (formattedMinutes < 60) {
        return `${minutes} min`;
    } else {
        const hours = Math.floor(formattedMinutes / 60);
        const remainingMinutes = formattedMinutes % 60;
        return `${hours}h ${remainingMinutes}m`;
    }
}

export function formatDate(dateString: string): string {
    const date = new Date(dateString);
    const day = date.getDate();
    const monthNames = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro"
    ];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();

    return `${day < 10 ? "0" + day : day} ${month} ${year}`;
}

// utils/config.ts
import Constants from 'expo-constants';
export const GEOAPIFY_KEY = Constants.manifest?.extra?.EXPO_PUBLIC_GEOPIFY_API_KEY;
