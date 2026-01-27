import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Image } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from "expo-router";
import { ChevronLeft, Eye, EyeOff } from "lucide-react-native"; // Icons

const Register = () => {
    const router = useRouter();
    const [isPasswordVisible, setPasswordVisible] = useState(false);
    const [isConfirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

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
                            className="w-10 h-10 items-center justify-center rounded-full active:bg-gray-100 -ml-2"
                        >
                            <ChevronLeft color="#0E141B" size={28} />
                        </TouchableOpacity>
                        <View className="w-10" />
                    </View>

                    <View className="px-6 mb-8 mt-2">
                        <Text className="text-secondary font-jakarta-bold text-3xl text-center leading-tight">
                            Create Your Safe Space
                        </Text>
                        <Text className="text-tertiary font-jakarta-medium text-base text-center mt-2 leading-6">
                            Begin your journey of mindfulness and reflection.
                        </Text>
                    </View>

                    <View className="px-6 gap-4">

                        <View className="gap-2">
                            <Text className="text-secondary font-jakarta-medium text-sm ml-1">Full Name</Text>
                            <TextInput
                                placeholder="John Doe"
                                placeholderTextColor="#9CA3AF"
                                className="w-full h-14 bg-white border border-[#D0DBE7] rounded-xl px-4 text-secondary font-jakarta text-base focus:border-primary focus:border-2"
                            />
                        </View>

                        <View className="gap-2">
                            <Text className="text-secondary font-jakarta-medium text-sm ml-1">Email</Text>
                            <TextInput
                                placeholder="example@mail.com"
                                placeholderTextColor="#9CA3AF"
                                keyboardType="email-address"
                                className="w-full h-14 bg-white border border-[#D0DBE7] rounded-xl px-4 text-secondary font-jakarta text-base focus:border-primary focus:border-2"
                            />
                        </View>

                        {/* Password */}
                        <View className="gap-2">
                            <Text className="text-secondary font-jakarta-medium text-sm ml-1">Password</Text>
                            <View className="relative w-full">
                                <TextInput
                                    placeholder="••••••••"
                                    placeholderTextColor="#9CA3AF"
                                    secureTextEntry={!isPasswordVisible}
                                    className="w-full h-14 bg-white border border-[#D0DBE7] rounded-xl px-4 text-secondary font-jakarta text-base focus:border-primary focus:border-2 pr-12"
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

                        <View className="gap-2">
                            <Text className="text-secondary font-jakarta-medium text-sm ml-1">Confirm Password</Text>
                            <View className="relative w-full">
                                <TextInput
                                    placeholder="••••••••"
                                    placeholderTextColor="#9CA3AF"
                                    secureTextEntry={!isConfirmPasswordVisible}
                                    className="w-full h-14 bg-white border border-[#D0DBE7] rounded-xl px-4 text-secondary font-jakarta text-base focus:border-primary focus:border-2 pr-12"
                                />
                                <TouchableOpacity
                                    onPress={() => setConfirmPasswordVisible(!isConfirmPasswordVisible)}
                                    className="absolute right-4 top-4"
                                >
                                    {isConfirmPasswordVisible ? (
                                        <EyeOff color="#4E7397" size={20} />
                                    ) : (
                                        <Eye color="#4E7397" size={20} />
                                    )}
                                </TouchableOpacity>
                            </View>
                        </View>

                        <TouchableOpacity className="w-full bg-primary h-14 rounded-xl items-center justify-center shadow-sm shadow-primary/20 mt-4 active:opacity-90">
                            <Text className="text-white font-jakarta-bold text-base tracking-wide">
                                Register
                            </Text>
                        </TouchableOpacity>

                    </View>

                    <View className="flex-row items-center px-8 py-8">
                        <View className="flex-1 h-[1px] bg-[#D0DBE7]" />
                        <Text className="px-4 text-tertiary text-sm font-jakarta-medium">Or continue with</Text>
                        <View className="flex-1 h-[1px] bg-[#D0DBE7]" />
                    </View>

                    <View className="flex-row gap-4 px-6 mb-8">
                        <TouchableOpacity className="flex-1 flex-row items-center justify-center gap-2 h-14 border border-[#D0DBE7] rounded-xl bg-white active:bg-gray-50">
                            <Image
                                source={{ uri: "https://cdn-icons-png.flaticon.com/512/300/300221.png" }}
                                style={{ width: 22, height: 22 }}
                                resizeMode="contain"
                            />
                            <Text className="text-secondary font-jakarta-semibold text-base">Google</Text>
                        </TouchableOpacity>

                        <TouchableOpacity className="flex-1 flex-row items-center justify-center gap-2 h-14 border border-[#D0DBE7] rounded-xl bg-white active:bg-gray-50">
                            <Image
                                source={{ uri: "https://cdn-icons-png.flaticon.com/512/5968/5968764.png" }}
                                style={{ width: 22, height: 22 }}
                                resizeMode="contain"
                            />
                            <Text className="text-secondary font-jakarta-semibold text-base">Facebook</Text>
                        </TouchableOpacity>
                    </View>

                    <View className="items-center pb-8">
                        <Text className="text-tertiary text-sm font-jakarta">
                            Already have an account?
                            <Text
                                className="text-primary font-jakarta-bold ml-1"
                            > Log In</Text>
                        </Text>
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default Register;