import React, {useEffect} from 'react'
import './../global.css'
import {
    useFonts,
    PlusJakartaSans_200ExtraLight,
    PlusJakartaSans_300Light,
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
} from "@expo-google-fonts/plus-jakarta-sans";
import {SplashScreen, Stack} from "expo-router";

SplashScreen.preventAutoHideAsync();
const Layout = () => {

    const [fontsLoaded, error] = useFonts({
        "Jakarta-ExtraLight": PlusJakartaSans_200ExtraLight,
        "Jakarta-Light": PlusJakartaSans_300Light,
        "Jakarta-Regular": PlusJakartaSans_400Regular,
        "Jakarta-Medium": PlusJakartaSans_500Medium,
        "Jakarta-SemiBold": PlusJakartaSans_600SemiBold,
        "Jakarta-Bold": PlusJakartaSans_700Bold,
        "Jakarta-ExtraBold": PlusJakartaSans_800ExtraBold,
    });

    useEffect(() => {
        if (error) throw error;

        if (fontsLoaded) {
            SplashScreen.hideAsync();
        }
    }, [fontsLoaded, error]);

    if (!fontsLoaded) {
        return null;
    }

    return (
        <Stack screenOptions={{ headerShown: false }}></Stack>
    );
}
export default Layout
