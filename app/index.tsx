import React, {useEffect, useState} from 'react'
import {Redirect} from "expo-router";
import {useAuth} from "@/hooks/use-auth";
import SplashScreen from  "@/app/splash-screen"

const App = () => {
    const { user, isLoading: isAuthLoading } = useAuth();
    const [isSplashAnimationDone, setIsSplashAnimationDone] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsSplashAnimationDone(true);
        }, 2500);

        return () => clearTimeout(timer);
    }, []);

    if (isAuthLoading || !isSplashAnimationDone) {
        return <SplashScreen />;
    }

    if (user) {
        return <Redirect href="/(dashboard)/home" />;
    }

    return <Redirect href="/welcome-screen" />;
}
export default App
