import {useContext} from "react";
import {AuthContext} from "@/contexts/auth-context";

export const useAuth = () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error("UseAuth must be used withing a AuthProvider...!")
    }
    return context
}