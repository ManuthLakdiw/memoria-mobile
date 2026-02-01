import {createContext, useEffect, useState} from "react";
import {onAuthStateChanged, User} from "@firebase/auth";
import {useLoader} from "@/hooks/user-loader";
import {auth} from "@/config/firebase";

interface AuthContextTypes {
    user: User | null,
    loading: boolean
}

export const AuthContext = createContext<AuthContextTypes>({
    user: null,
    loading: false
})


export const AuthProvider = ({children}:{children:React.ReactNode}) => {
    const [user, setUser] = useState<User | null>(null)
    const {hideLoader, showLoader, isLoading} = useLoader()

    useEffect(() => {
        showLoader()
        const unsubscribe =  onAuthStateChanged(auth, (usr) => {
            setUser(usr)
            hideLoader()
        })

        return unsubscribe
    })

    return <AuthContext value={{user, loading: isLoading}}>{children}</AuthContext>
}