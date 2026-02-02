import { View, Text, ScrollView, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import { MotiSafeAreaView } from 'moti';
import { useIsFocused, useFocusEffect } from "@react-navigation/core";
import {
    Edit2,
    Book,
    Flame,
    Smile,
    Shield,
    Bell,
    CircleHelp,
    LogOut,
    ChevronRight
} from 'lucide-react-native';
import {getUserProfile, logout} from "@/services/auth-service";
import { useAuth } from "@/hooks/use-auth";
import { useLoader } from "@/hooks/user-loader";
import { useRouter } from "expo-router";
import { getMemories } from "@/services/memory-service";

const Profile = () => {
    const isFocused = useIsFocused();
    const { showLoader, hideLoader, isLoading: isLogoutLoading } = useLoader();
    const { user } = useAuth();
    const router = useRouter();

    const [totalMemories, setTotalMemories] = useState(0);
    const [streak, setStreak] = useState(0);
    const [primaryMood, setPrimaryMood] = useState('N/A');
    const [isLoadingStats, setIsLoadingStats] = useState(true);
    const [bio, setBio] = useState('');
    const [status, setStatus] = useState('');

    const userName = user?.displayName || "Friend";
    const userEmail = user?.email || "No Email";
    const profileImage = user?.photoURL ? user.photoURL.replace("svg", "png") : null;

    useFocusEffect(
        useCallback(() => {
            if (!user) return;

            const fetchData = async () => {
                setIsLoadingStats(true);
                try {
                    const data = await getMemories(user.uid);
                    processStats(data);

                    const userData = await getUserProfile(user.uid);

                    if (userData) {
                        console.log(userData);
                        setBio(userData.bio || "No bio available");
                        setStatus(userData.status || "Active");
                    }

                } catch (error) {
                    console.error("Error fetching stats:", error);
                } finally {
                    setIsLoadingStats(false);
                }
            };

            fetchData();
        }, [user])
    );

    const processStats = (memories: any[]) => {
        setTotalMemories(memories.length);

        if (memories.length === 0) {
            setStreak(0);
            setPrimaryMood('N/A');
            return;
        }

        const moodCounts: Record<string, number> = {};
        memories.forEach(m => {
            moodCounts[m.mood] = (moodCounts[m.mood] || 0) + 1;
        });

        let maxMood = 'N/A';
        let maxCount = 0;
        for (const [mood, count] of Object.entries(moodCounts)) {
            if (count > maxCount) {
                maxCount = count;
                maxMood = mood;
            }
        }
        setPrimaryMood(maxMood);

        const uniqueDates = new Set<string>();
        memories.forEach(m => {
            const date = m.createdAt?.toDate ? m.createdAt.toDate() : new Date(m.createdAt);
            uniqueDates.add(date.toISOString().split('T')[0]);
        });

        let currentStreak = 0;
        const today = new Date();
        for (let i = 0; i < 365; i++) {
            const d = new Date();
            d.setDate(today.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];

            if (uniqueDates.has(dateStr)) {
                currentStreak++;
            } else if (i === 0 && !uniqueDates.has(dateStr)) {
                continue;
            } else {
                break;
            }
        }
        setStreak(currentStreak);
    };

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
            from={{ opacity: 0, translateY: 15 }}
            animate={{ opacity: isFocused ? 1 : 0, translateY: isFocused ? 0 : 15 }}
            transition={{ type: 'timing', duration: 300 }}
            className="flex-1 bg-[#F6F7F8]"
        >
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
                className="flex-1"
            >
                <View className="items-center pt-8 pb-8 px-6">
                    <View className="relative mb-4">
                        <View className="w-32 h-32 rounded-full p-1 bg-white shadow-lg shadow-black/5">
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

                        <TouchableOpacity
                            onPress={() => router.push('/edit-profile')}
                            className="absolute bottom-1 right-1 bg-primary w-8 h-8 rounded-full items-center justify-center border-4 border-white active:scale-90">
                            <Edit2 color="white" size={14} />
                        </TouchableOpacity>
                    </View>

                    <Text className="text-2xl font-jakarta-bold text-[#0E141B]">{userName}</Text>
                    <Text className="text-sm font-jakarta text-gray-500 mt-1">{userEmail}</Text>
                    {!isLoadingStats && (
                        <View className="mt-4 items-center w-full">
                            {status ? (
                                <View className="bg-blue-50 px-4 py-1.5 rounded-full mb-3 border border-blue-100">
                                    <Text className="text-xs font-jakarta-bold text-primary uppercase tracking-wider">
                                        {status}
                                    </Text>
                                </View>
                            ) : null}

                            {bio ? (
                                <Text className="text-sm font-jakarta text-gray-600 text-center leading-6 px-4">
                                    {bio}
                                </Text>
                            ) : null}
                        </View>
                    )}
                </View>

                <View className="px-6 gap-4 mb-8">
                    {isLoadingStats ? (
                        <ActivityIndicator size="small" color="#197FE6" className="py-4" />
                    ) : (
                        <>
                            <View className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex-row items-center gap-4">
                                <View className="w-12 h-12 rounded-xl bg-blue-50 items-center justify-center">
                                    <Book color="#197FE6" size={24} />
                                </View>
                                <View>
                                    <Text className="text-[10px] font-jakarta-bold text-gray-400 uppercase tracking-wider">Total Memories</Text>
                                    <Text className="text-lg font-jakarta-bold text-[#0E141B]">{totalMemories}</Text>
                                </View>
                            </View>

                            <View className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex-row items-center gap-4">
                                <View className="w-12 h-12 rounded-xl bg-orange-50 items-center justify-center">
                                    <Flame color="#F97316" size={24} fill="#F97316" fillOpacity={0.2} />
                                </View>
                                <View>
                                    <Text className="text-[10px] font-jakarta-bold text-gray-400 uppercase tracking-wider">Current Streak</Text>
                                    <Text className="text-lg font-jakarta-bold text-[#0E141B]">{streak} days</Text>
                                </View>
                            </View>

                            <View className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex-row items-center gap-4">
                                <View className="w-12 h-12 rounded-xl bg-yellow-50 items-center justify-center">
                                    <Smile color="#EAB308" size={24} />
                                </View>
                                <View>
                                    <Text className="text-[10px] font-jakarta-bold text-gray-400 uppercase tracking-wider">Primary Mood</Text>
                                    <Text className="text-lg font-jakarta-bold text-[#0E141B]">{primaryMood}</Text>
                                </View>
                            </View>
                        </>
                    )}
                </View>

                <View className="px-6 pb-6">
                    <Text className="text-xs font-jakarta-bold text-gray-400 uppercase tracking-widest mb-3 ml-1">
                        Settings
                    </Text>

                    <View className="gap-3">
                        <TouchableOpacity className="w-full flex-row items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 shadow-xs active:bg-gray-50">
                            <View className="flex-row items-center gap-3">
                                <Shield color="#9CA3AF" size={20} />
                                <Text className="font-jakarta-medium text-[#0E141B]">Security</Text>
                            </View>
                            <ChevronRight color="#D1D5DB" size={20} />
                        </TouchableOpacity>

                        <TouchableOpacity className="w-full flex-row items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 shadow-xs active:bg-gray-50">
                            <View className="flex-row items-center gap-3">
                                <Bell color="#9CA3AF" size={20} />
                                <Text className="font-jakarta-medium text-[#0E141B]">Notifications</Text>
                            </View>
                            <ChevronRight color="#D1D5DB" size={20} />
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => router.push('/help')}
                            className="w-full flex-row items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 shadow-xs active:bg-gray-50">
                            <View className="flex-row items-center gap-3">
                                <CircleHelp color="#9CA3AF" size={20} />
                                <Text className="font-jakarta-medium text-[#0E141B]">Help Center</Text>
                            </View>
                            <ChevronRight color="#D1D5DB" size={20} />
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={handleLogout}
                            disabled={isLogoutLoading}
                            className="w-full flex-row items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 shadow-xs mt-2 active:bg-red-50"
                        >
                            <View className="flex-row items-center gap-3">
                                <LogOut color="#EF4444" size={20} />
                                <Text className="font-jakarta-medium text-[#EF4444]">Sign Out</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

            </ScrollView>
        </MotiSafeAreaView>
    );
};

export default Profile;