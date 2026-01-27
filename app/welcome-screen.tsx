import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Notebook } from "lucide-react-native";
import { useRouter } from "expo-router";

const WelcomeScreen = () => {
    const router = useRouter();
    return (
        <SafeAreaView className="flex-1 bg-white">

            <View className="flex-1 px-8 justify-between pb-4 pt-10">

                <View className="flex-1 justify-center items-center">

                    <View className="w-24 h-24 bg-primary/10 rounded-3xl justify-center items-center mb-8">
                        <Notebook
                            color="#197FE6"
                            size={48}
                            strokeWidth={2}
                            fill="#197FE6"
                            fillOpacity={0.1}
                        />
                    </View>

                    <View className="items-center gap-3">
                        <Text className="text-secondary font-jakarta-bold text-[28px] text-center leading-tight">
                            Welcome to your mindful space
                        </Text>

                        <Text className="text-tertiary font-jakarta-medium text-base text-center px-4 leading-6">
                            Begin your journey of self-reflection and inner peace.
                        </Text>
                    </View>
                </View>

                <View className="w-full gap-4 mb-4">
                    <TouchableOpacity
                        onPress={() => router.push("/register")}
                        className="w-full bg-primary py-4 rounded-2xl items-center shadow-sm active:opacity-90"
                    >
                        <Text className="text-white font-jakarta-bold text-lg">
                            Sign Up
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => router.push("/login")}
                        className="w-full bg-[#E0E3FF] py-4 rounded-2xl items-center active:opacity-90"
                    >
                        <Text className="text-[#5A6199] font-jakarta-bold text-lg">
                            Log In
                        </Text>
                    </TouchableOpacity>

                    <Text className="text-center text-tertiary/60 text-xs mt-2 font-jakarta">
                        By continuing, you agree to our Terms and Privacy Policy.
                    </Text>
                </View>

            </View>
        </SafeAreaView>
    );
};

export default WelcomeScreen;