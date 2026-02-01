import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from "@/config/firebase";
import { uploadImageToCloudinary } from "./image-service";

interface MemoryData {
    title: string;
    content: string;
    mood: string;
    tags: string[];
    entryType: 'text' | 'audio';
    entryDate: Date;
    imageUri: string | null;
}

export const createMemory = async (userId: string, data: MemoryData) => {
    try {
        let downloadUrl = null;

        if (data.imageUri) {
            downloadUrl = await uploadImageToCloudinary(data.imageUri);

            if (!downloadUrl) {
                throw new Error("Image upload failed");
            }
        }

        const docRef = await addDoc(collection(db, "users", userId, "memories"), {
            title: data.title || "Untitled Memory",
            content: data.content,
            mood: data.mood,
            tags: data.tags,
            imageUrl: downloadUrl,
            type: data.entryType,
            createdAt: Timestamp.fromDate(data.entryDate),
            dateString: data.entryDate.toISOString().split('T')[0]
        });

        return docRef.id;

    } catch (error) {
        throw error;
    }
};