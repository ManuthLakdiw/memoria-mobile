import { CLOUDINARY_CONFIG } from "@/config/cloudinary";

export const uploadAudioToCloudinary = async (audioUri: string) => {
    if (!audioUri) return null;

    try {
        const data = new FormData();
        const filename = audioUri.split('/').pop() || "sound.m4a";
        const type = 'audio/m4a';

        // @ts-ignore
        data.append('file', { uri: audioUri, name: filename, type });
        data.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
        data.append('cloud_name', CLOUDINARY_CONFIG.cloudName);
        data.append('resource_type', 'video');

        const audioUploadUrl = CLOUDINARY_CONFIG.uploadUrl.replace("image/upload", "video/upload");

        const response = await fetch(audioUploadUrl, {
            method: 'POST',
            body: data
        });

        const result = await response.json();

        if (result.secure_url) {
            return result.secure_url;
        } else {
            console.error("Cloudinary Error:", result);
            return null;
        }

    } catch (error) {
        console.error("Audio Upload Failed:", error);
        return null;
    }
};