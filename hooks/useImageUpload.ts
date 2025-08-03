import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';

interface ImageUploadResult {
    uri: string | null;
    uploadImage: () => Promise<void>;
}

export const useImageUpload = (): ImageUploadResult => {
    const [uri, setUri] = useState<string | null>(null);

    const uploadImage = async () => {
        // Asks for media library permission
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('Desculpe, precisamos de permissão para aceder à sua galeria!');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setUri(result.assets[0].uri);
        }
    };

    return { uri, uploadImage };
};
