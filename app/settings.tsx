import { View, Text, ScrollView, TouchableOpacity, Image, Switch, Alert } from 'react-native';
import React, { useState } from 'react';
import { MotiSafeAreaView } from 'moti';
import { useRouter } from "expo-router";
import { useIsFocused } from "@react-navigation/core";
import {
    ChevronLeft,
    User,
    Bell,
    ChevronRight,
    Fingerprint,
    Shield,
    CircleHelp
} from 'lucide-react-native';
import { useAuth } from "@/hooks/use-auth";
import { logout } from "@/services/auth-service";
import { useLoader } from "@/hooks/user-loader";

const Settings = () => {
    const router = useRouter();
    const isFocused = useIsFocused();
    const { user } = useAuth();
    const { showLoader, hideLoader, isLoading } = useLoader();

    const [isDailyRemindersEnabled, setIsDailyRemindersEnabled] = useState(true);
    const [isBiometricEnabled, setIsBiometricEnabled] = useState(false);

    const userName = user?.displayName || "Friend";
    const userEmail = user?.email || "No Email";
    const profileImage = user?.photoURL ? user.photoURL.replace("svg", "png") : null;

    const handleLogout = () => {
        Alert.alert(
            "Sign Out",
            "Are you sure you want to sign out?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Sign Out",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            showLoader();
                            await logout();
                            router.replace("/login");
                        } catch (error) {
                            Alert.alert("Error", "Failed to sign out");
                        } finally {
                            hideLoader();
                        }
                    }
                }
            ]
        );
    };

    return (
        <MotiSafeAreaView
            from={{ opacity: 0, translateX: 20 }}
            animate={{ opacity: isFocused ? 1 : 0, translateX: isFocused ? 0 : 20 }}
            transition={{ type: 'timing', duration: 300 }}
            className="flex-1 bg-[#F6F7F8]"
        >
            <View className="px-4 py-3 bg-[#F6F7F8]/80 flex-row items-center justify-between border-b border-gray-200/50">
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="w-10 h-10 items-center justify-center bg-gray-50 rounded-full active:bg-gray-200"
                >
                    <ChevronLeft color="#0E141B" size={24} />
                </TouchableOpacity>

                <Text className="text-[#0E141B] text-lg font-jakarta-bold">Settings</Text>

                <View className="w-10" />
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 50 }}
                className="flex-1"
            >
                <View className="px-6 mt-6 mb-8">
                    <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 items-center">

                        <View className="relative mb-4">
                            <View className="w-24 h-24 rounded-full p-1 bg-white border border-gray-100 shadow-sm">
                                {profileImage ? (
                                    <Image
                                        source={{ uri: profileImage }}
                                        className="w-full h-full rounded-full"
                                        resizeMode="cover"
                                    />
                                ) : (
                                    <View className="w-full h-full rounded-full bg-primary/10 items-center justify-center">
                                        <Text className="text-4xl font-jakarta-bold text-primary">
                                            {userName.charAt(0).toUpperCase()}
                                        </Text>
                                    </View>
                                )}
                            </View>
                        </View>

                        <Text className="text-xl font-jakarta-bold text-[#0E141B]">{userName}</Text>
                        <Text className="text-sm font-jakarta text-gray-500 mt-1">{userEmail}</Text>
                    </View>
                </View>

                <View className="px-6 mb-8">
                    <Text className="text-xs font-jakarta-bold text-gray-400 uppercase tracking-widest mb-3 ml-1">Account</Text>

                    <View className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                        <TouchableOpacity
                            onPress={() => router.push('/(dashboard)/profile')}
                            className="flex-row items-center justify-between p-4 active:bg-gray-50">
                            <View className="flex-row items-center gap-4">
                                <View className="w-10 h-10 rounded-lg bg-primary/10 items-center justify-center">
                                    <User color="#197fe6" size={20} />
                                </View>
                                <Text className="text-base font-jakarta text-[#0E141B]">Edit Profile</Text>
                            </View>
                            <ChevronRight color="#D1D5DB" size={20} />
                        </TouchableOpacity>

                        <View className="h-[1px] bg-gray-100 mx-4" />

                        <View className="flex-row items-center justify-between p-4">
                            <View className="flex-row items-center gap-4">
                                <View className="w-10 h-10 rounded-lg bg-primary/10 items-center justify-center">
                                    <Bell color="#197fe6" size={20} />
                                </View>
                                <Text className="text-base font-jakarta text-[#0E141B]">Daily Reminders</Text>
                            </View>
                            <Switch
                                trackColor={{ false: "#E5E7EB", true: "#197fe6" }}
                                thumbColor={"#FFFFFF"}
                                ios_backgroundColor="#E5E7EB"
                                onValueChange={() => setIsDailyRemindersEnabled(prev => !prev)}
                                value={isDailyRemindersEnabled}
                            />
                        </View>
                    </View>
                </View>

                <View className="px-6 mb-8">
                    <Text className="text-xs font-jakarta-bold text-gray-400 uppercase tracking-widest mb-3 ml-1">Security</Text>

                    <View className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                        <View className="flex-row items-center justify-between p-4">
                            <View className="flex-row items-center gap-4">
                                <View className="w-10 h-10 rounded-lg bg-primary/10 items-center justify-center">
                                    <Fingerprint color="#197fe6" size={20} />
                                </View>
                                <Text className="text-base font-jakarta text-[#0E141B]">FaceID / TouchID</Text>
                            </View>
                            <Switch
                                trackColor={{ false: "#E5E7EB", true: "#197fe6" }}
                                thumbColor={"#FFFFFF"}
                                ios_backgroundColor="#E5E7EB"
                                onValueChange={() => setIsBiometricEnabled(prev => !prev)}
                                value={isBiometricEnabled}
                            />
                        </View>

                        <View className="h-[1px] bg-gray-100 mx-4" />

                        <TouchableOpacity className="flex-row items-center justify-between p-4 active:bg-gray-50">
                            <View className="flex-row items-center gap-4">
                                <View className="w-10 h-10 rounded-lg bg-primary/10 items-center justify-center">
                                    <Shield color="#197fe6" size={20} />
                                </View>
                                <Text className="text-base font-jakarta text-[#0E141B]">Privacy & Data</Text>
                            </View>
                            <ChevronRight color="#D1D5DB" size={20} />
                        </TouchableOpacity>
                    </View>
                </View>

                <View className="px-6 mb-8">
                    <Text className="text-xs font-jakarta-bold text-gray-400 uppercase tracking-widest mb-3 ml-1">Memoria</Text>

                    <View className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                        <TouchableOpacity className="flex-row items-center justify-between p-4 active:bg-gray-50">
                            <View className="flex-row items-center gap-4">
                                <View className="w-10 h-10 rounded-lg bg-primary/10 items-center justify-center">
                                    <CircleHelp color="#197fe6" size={20} />
                                </View>
                                <Text className="text-base font-jakarta text-[#0E141B]">Help Center</Text>
                            </View>
                            <ChevronRight color="#D1D5DB" size={20} />
                        </TouchableOpacity>
                    </View>
                </View>

                <View className="px-6 items-center">
                    <TouchableOpacity
                        onPress={handleLogout}
                        disabled={isLoading}
                        className="w-full bg-[#F3F4F6] py-4 rounded-2xl items-center active:scale-95"
                    >
                        <Text className="text-[#EF4444] font-jakarta-bold text-base">Sign Out</Text>
                    </TouchableOpacity>

                    <Text className="text-gray-400 text-xs text-center mt-4 font-jakarta">
                        Memoria Version 1.0 {'\n'}
                        Made with ❤️ for your mindfulness
                    </Text>
                </View>

            </ScrollView>
        </MotiSafeAreaView>
    );
};

export default Settings;