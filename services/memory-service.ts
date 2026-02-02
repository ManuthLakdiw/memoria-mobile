import {collection, addDoc, Timestamp, orderBy, getDocs, query, deleteDoc} from 'firebase/firestore';
import { db } from "@/config/firebase";
import { uploadImageToCloudinary } from "./image-service";
import { uploadAudioToCloudinary } from "./audio-service";
import {doc} from "@firebase/firestore";

const MOOD_IMAGES: Record<string, string> = {
    'Joy': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop',
    'Calm': 'https://images.unsplash.com/photo-1474418397713-7ede21d49118?q=80&w=2053&auto=format&fit=crop',
    'Sad': 'https://images.unsplash.com/photo-1525120334885-38cc03a6ec77?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'Angry': 'https://images.unsplash.com/photo-1503525537183-c84679c9147f?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'Tired': 'https://images.unsplash.com/photo-1612620980838-5541dad8e254?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'Default': 'https://images.unsplash.com/photo-1528569937393-ee892b976859?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
};

const getImageForMood = (mood: string) => {
    return MOOD_IMAGES[mood] || MOOD_IMAGES['Default'];
};

interface MemoryData {
    title: string;
    content: string;
    mood: string;
    tags: string[];
    entryType: 'text' | 'audio';
    entryDate: Date;
    imageUri: string | null;
    audioUri?: string | null;
}

export const createMemory = async (userId: string, data: MemoryData) => {
    try {
        let downloadUrl = null;
        let audioDownloadUrl = null;

        // Image Upload Logic
        if (data.imageUri) {
            downloadUrl = await uploadImageToCloudinary(data.imageUri);
            if (!downloadUrl) {
                console.warn("Image upload failed. Using mood image as fallback.");
            }
        }

        if (data.audioUri) {
            audioDownloadUrl = await uploadAudioToCloudinary(data.audioUri);
        }

        const finalImageUrl = downloadUrl || getImageForMood(data.mood);

        const docRef = await addDoc(collection(db, "users", userId, "memories"), {
            title: data.title || "Untitled Memory",
            content: data.content,
            mood: data.mood,
            tags: data.tags,
            imageUrl: finalImageUrl,
            audioUrl: audioDownloadUrl,
            type: data.entryType,
            createdAt: Timestamp.fromDate(data.entryDate),
            dateString: data.entryDate.toISOString().split('T')[0]
        });

        return docRef.id;

    } catch (error) {
        throw error;
    }
};


export const getMemories = async (userId: string) => {
    try {
        const memoriesRef = collection(db, "users", userId, "memories");

        const q = query(memoriesRef, orderBy("createdAt", "desc"));

        const querySnapshot = await getDocs(q);

        const memories: any[] = [];
        querySnapshot.forEach((doc) => {
            memories.push({ id: doc.id, ...doc.data() });
        });

        return memories;
    } catch (error) {
        console.error("Error fetching memories:", error);
        throw error;
    }
};

export const deleteMemory = async (userId: string, memoryId: string) => {
    try {
        const memoryRef = doc(db, "users", userId, "memories", memoryId);
        await deleteDoc(memoryRef);
    } catch (error) {
        console.error("Error deleting memory:", error);
        throw error;
    }
};