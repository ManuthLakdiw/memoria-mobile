import { View, Text } from 'react-native';
import React, { useEffect } from 'react';
import { Notebook } from "lucide-react-native";
import { MotiView } from 'moti';
import { useRouter } from "expo-router";

const SplashScreen = () => {
    const router = useRouter();
    useEffect(() => {
        const timer = setTimeout(() => {
            router.replace("/welcome-screen")
        }, 2500);

        return () => clearTimeout(timer);
    }, []);

    return (
        <MotiView
            from={{
                opacity: 0,
                scale: 0.9
            }}
            animate={{
                opacity: 1,
                scale: 1
            }}
            transition={{
                type: 'timing',
                duration: 1000,
            }}
            className="flex-1 bg-white relative">

            <View className="flex-1 justify-center items-center">
                <View className="flex flex-col items-center gap-8">
                    <View className="flex items-center justify-center w-36 h-36 bg-primary/10 rounded-3xl shadow-sm">
                        <Notebook color="#197FE6" size={72} strokeWidth={2} />
                    </View>
                    <View className="items-center">
                        <Text className="font-jakarta-bold text-4xl text-secondary">Memoria</Text>
                        <Text className="text-lg font-jakarta-medium text-tertiary mt-2">Your mindful space</Text>
                    </View>
                </View>
            </View>

            <View className="absolute bottom-20 w-full items-center">
                <View className="w-32 h-1.5 bg-primary/20 rounded-full overflow-hidden">

                    <MotiView
                        className="h-full bg-primary rounded-full opacity-80"
                        from={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{
                            type: 'timing',
                            duration: 2500,
                        }}
                    />
                </View>
            </View>
        </MotiView>
    );
};

export default SplashScreen;