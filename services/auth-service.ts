import {createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile} from "@firebase/auth";
import {doc, setDoc} from "@firebase/firestore";
import {db, auth} from "@/config/firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {getDoc} from "firebase/firestore";


interface UpdateProfileData {
    name: string;
    photoURL: string;
    bio: string;
    status: string;
}


export const registerUser = async (name:string, email:string, password:string) => {
    try {
        const userCred =  await  createUserWithEmailAndPassword(auth, email, password)
        const profileImage = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`;

        await updateProfile(userCred.user, {
            displayName: name,
            photoURL: profileImage
        })

        await setDoc(doc(db, "users", userCred.user.uid), {
            uid:  userCred.user.uid,
            name: name,
            email: email,
            role: "user",
            photoURL: profileImage,
            bio: "Exploring my memories...",
            status: "New Member",
            createdAt: new Date().toISOString()
        });

        return userCred.user
    }catch (error: any) {
        throw error;
    }
}

export const loginUser = async (email: string, password: string) => {
    try {
        const userCred = await signInWithEmailAndPassword(auth, email, password);
        return userCred.user;
    } catch (error: any) {
        throw error;
    }
}


export const getUserProfile = async (uid: string) => {
    try {
        const userDocRef = doc(db, "users", uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
            return userDocSnap.data();
        } else {
            return null;
        }
    } catch (error: any) {
        throw error;
    }
};

export const updateUserProfile = async (uid: string, data: UpdateProfileData) => {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error("No authenticated user found");

        await updateProfile(user, {
            displayName: data.name,
            photoURL: data.photoURL,
        });

        const userDocRef = doc(db, "users", uid);
        await setDoc(userDocRef, {
            name: data.name,
            photoURL: data.photoURL,
            bio: data.bio,
            status: data.status,
            updatedAt: new Date().toISOString()
        }, { merge: true });

        return true;
    } catch (error: any) {
        console.error("Error updating profile:", error);
        throw error;
    }
};


export const logout = async () => {
    try {
        await signOut(auth)
        await AsyncStorage.clear()
        return
    }catch (error: any) {
        throw error;
    }


}