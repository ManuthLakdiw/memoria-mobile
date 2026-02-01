import {createUserWithEmailAndPassword, updateProfile} from "@firebase/auth";
import {doc, setDoc} from "@firebase/firestore";
import {db, auth} from "@/config/firebase";

export const registerUser = async (name:string, email:string, password:string) => {
    try {
        const userCred =  await  createUserWithEmailAndPassword(auth, email, password)
        const profileImage = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`;
        await updateProfile(userCred.user, {
            displayName: name,
            photoURL: profileImage
        })

        // firebase db
        await setDoc(doc(db, "users", userCred.user.uid), {
            uid:  userCred.user.uid,
            name: name,
            email: email,
            role: "user",
            photoURL: profileImage,
            createdAt: new Date().toISOString()
        });

        console.log("User registered successfully!");

        return userCred.user
    }catch (error: any) {
        console.error("Registration Error: ", error.message);
        throw error;
    }
}