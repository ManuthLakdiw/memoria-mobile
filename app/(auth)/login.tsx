import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from "expo-router";
import { ChevronLeft, Eye, EyeOff, Sparkles, Fingerprint } from "lucide-react-native";

const Login = () => {
    const router = useRouter();
    const [isPasswordVisible, setPasswordVisible] = useState(false);

    return (
        <SafeAreaView className="flex-1 bg-white">
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                className="flex-1"
            >
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 20 }}
                >

                    <View className="flex-row items-center justify-between px-6 py-4">
                        <TouchableOpacity
                            onPress={() => router.back()}
                            className="w-10 h-10 items-center justify-center rounded-full -ml-2 active:bg-gray-100"
                        >
                            <ChevronLeft color="#0E141B" size={28} />
                        </TouchableOpacity>

                        <Text className="text-[#0E141B] text-lg font-jakarta-bold">Memoria</Text>

                        <View className="w-10" />
                    </View>

                    <View className="items-center pt-8 pb-8 px-6">
                        <View className="w-16 h-16 bg-primary/10 rounded-2xl items-center justify-center mb-4">
                            <Sparkles color="#197FE6" size={32} fill="#197FE6" fillOpacity={0.2} />
                        </View>
                        <Text className="text-[#0E141B] font-jakarta-bold text-[32px] text-center leading-tight">
                            Welcome Back
                        </Text>
                        <Text className="text-[#4E7397] font-jakarta-medium text-base text-center mt-2">
                            Log in to your calm space
                        </Text>
                    </View>

                    <View className="px-6 flex-col gap-4">

                        <View className="flex-col gap-2">
                            <Text className="text-[#0E141B] font-jakarta-medium text-sm ml-1">Email</Text>
                            <TextInput
                                placeholder="example@email.com"
                                placeholderTextColor="#9CA3AF"
                                keyboardType="email-address"
                                className="w-full h-14 bg-white border border-[#D0DBE7] rounded-xl px-4 text-[#0E141B] font-jakarta text-base focus:border-primary focus:border-2"
                            />
                        </View>

                        <View className="flex-col gap-2">
                            <Text className="text-[#0E141B] font-jakarta-medium text-sm ml-1">Password</Text>
                            <View className="relative w-full">
                                <TextInput
                                    placeholder="Enter your password"
                                    placeholderTextColor="#9CA3AF"
                                    secureTextEntry={!isPasswordVisible}
                                    className="w-full h-14 bg-white border border-[#D0DBE7] rounded-xl px-4 text-[#0E141B] font-jakarta text-base focus:border-primary focus:border-2 pr-12"
                                />
                                <TouchableOpacity
                                    onPress={() => setPasswordVisible(!isPasswordVisible)}
                                    className="absolute right-4 top-4"
                                >
                                    {isPasswordVisible ? (
                                        <EyeOff color="#4E7397" size={20} />
                                    ) : (
                                        <Eye color="#4E7397" size={20} />
                                    )}
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View className="items-end py-1">
                            <TouchableOpacity>
                                <Text className="text-primary font-jakarta-medium text-sm">
                                    Forgot Password?
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity className="w-full bg-primary h-14 rounded-xl items-center justify-center shadow-lg shadow-primary/20 active:opacity-90">
                            <Text className="text-white font-jakarta-bold text-base">
                                Login
                            </Text>
                        </TouchableOpacity>

                    </View>

                    <View className="flex-row items-center px-8 py-8">
                        <View className="flex-1 h-[1px] bg-[#D0DBE7]" />
                        <Text className="px-4 text-[#4E7397] text-sm font-jakarta-medium">or</Text>
                        <View className="flex-1 h-[1px] bg-[#D0DBE7]" />
                    </View>

                    <View className="px-6 flex-col gap-4">
                        <TouchableOpacity className="flex-row items-center justify-center gap-3 w-full h-14 bg-white border border-[#D0DBE7] rounded-xl active:bg-gray-50">
                            <Fingerprint color="#197FE6" size={24} />
                            <Text className="text-[#0E141B] font-jakarta-medium text-base">
                                Login with Touch ID
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View className="items-center pt-8 pb-8">
                        <Text className="text-[#4E7397] text-sm font-jakarta">
                            Don&#39;t have an account?
                            <Text
                                onPress={() => router.push("/(auth)/register")}
                                className="text-primary font-jakarta-bold ml-1"
                            > Register</Text>
                        </Text>
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default Login;