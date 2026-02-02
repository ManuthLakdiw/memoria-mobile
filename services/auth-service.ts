import {createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile} from "@firebase/auth";
import {doc, setDoc} from "@firebase/firestore";
import {db, auth} from "@/config/firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {getDoc} from "firebase/firestore";

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



export const logout = async () => {
    try {
        await signOut(auth)
        await AsyncStorage.clear()
        return
    }catch (error: any) {
        throw error;
    }


}