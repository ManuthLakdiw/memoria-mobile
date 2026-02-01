import {createContext, useEffect, useState} from "react";
import {onAuthStateChanged, User} from "@firebase/auth";
import {useLoader} from "@/hooks/user-loader";
import {auth} from "@/config/firebase";

interface AuthContextTypes {
    user: User | null,
    isLoading: boolean
}

export const AuthContext = createContext<AuthContextTypes>({
    user: null,
    isLoading: true
})


export const AuthProvider = ({children}:{children:React.ReactNode}) => {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // showLoader()
        const unsubscribe =  onAuthStateChanged(auth, (usr) => {
            setUser(usr)
            // hideLoader()
            setIsLoading(false)
        })

        return unsubscribe
    }, []);

    return <AuthContext.Provider value={{user, isLoading}}>{children}</AuthContext.Provider>
}