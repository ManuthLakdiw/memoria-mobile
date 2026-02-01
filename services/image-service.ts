import { CLOUDINARY_CONFIG } from "@/config/cloudinary";

export const uploadImageToCloudinary = async (imageUri: string) => {
    if (!imageUri) return null;

    try {
        const data = new FormData();

        const filename = imageUri.split('/').pop() || "memory.jpg";
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image/jpeg`;

        // @ts-ignore: React Native FormData fix
        data.append('file', { uri: imageUri, name: filename, type });
        data.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
        data.append('cloud_name', CLOUDINARY_CONFIG.cloudName);

        const response = await fetch(CLOUDINARY_CONFIG.uploadUrl, {
            method: 'POST',
            body: data
        });

        const result = await response.json();
        return result.secure_url;

    } catch (error) {
        console.error("Image Upload Failed:", error);
        return null;
    }
};