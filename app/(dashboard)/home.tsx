import { View, Text, TextInput, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import React, { useState, useCallback } from 'react';
import { Settings, Search, Plus, BookHeart, CheckCircle2, History, Coffee } from 'lucide-react-native';
import MemoryCard from '@/components/memory-card';
import { MotiSafeAreaView, MotiView } from "moti";
import { useFocusEffect, useRouter } from "expo-router";
import { useAuth } from "@/hooks/use-auth";
import { getMemories } from "@/services/memory-service";

const formatDate = (timestamp: any) => {
    if (!timestamp) return '';
    // Firestore Timestamp එක JS Date එකක් බවට පත් කිරීම
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }) +
        " • " +
        date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
};

const Home = () => {
    const router = useRouter();
    const { user } = useAuth();

    // State management
    const [thisWeekMemories, setThisWeekMemories] = useState<any[]>([]);
    const [olderMemories, setOlderMemories] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [hasAnyMemories, setHasAnyMemories] = useState(false);

    const firstName = user?.displayName ? user.displayName.split(' ')[0] : "Friend";
    const profileImage = user?.photoURL ? user.photoURL.replace("svg", "png") : null;

    useFocusEffect(
        useCallback(() => {
            if (!user) return;

            const fetchData = async () => {
                setIsLoading(true);
                try {
                    const data = await getMemories(user.uid);
                    setHasAnyMemories(data.length > 0);

                    const now = new Date();
                    const oneWeekAgo = new Date();
                    oneWeekAgo.setDate(now.getDate() - 7);

                    const recent: any[] = [];
                    const old: any[] = [];

                    data.forEach((item) => {
                        const itemDate = item.createdAt?.toDate ? item.createdAt.toDate() : new Date(item.createdAt);
                        if (itemDate >= oneWeekAgo) {
                            recent.push(item);
                        } else {
                            old.push(item);
                        }
                    });

                    setThisWeekMemories(recent);
                    setOlderMemories(old);
                } catch (error) {
                    console.error("Fetch Error:", error);
                } finally {
                    setIsLoading(false);
                }
            };

            fetchData();
        }, [user])
    );

    return (
        <MotiSafeAreaView
            from={{ opacity: 0, translateY: 15 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 300 }}
            className="flex-1 bg-[#F6F7F8]">

            <View className="px-4 py-3 bg-[#F6F7F8]/80 flex-row items-center justify-between border-b border-gray-200/50">
                <View className="w-12 h-12 bg-primary/10 rounded-full items-center justify-center overflow-hidden">
                    {profileImage ? (
                        <Image source={{ uri: profileImage }} className="w-full h-full" resizeMode="cover" />
                    ) : (
                        <BookHeart color="#197FE6" size={24} />
                    )}
                </View>
                <Text className="text-[#0E141B] text-xl font-jakarta-bold">Memoria</Text>
                <TouchableOpacity onPress={() => router.push('/settings')} className="w-10 h-10 items-center justify-center rounded-full active:bg-gray-200">
                    <Settings color="#0E141B" size={24} />
                </TouchableOpacity>
            </View>

            <ScrollView className="flex-1" contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>

                <View className="mt-6 mb-4 flex-row items-center">
                    <MotiView
                        from={{ rotate: '-15deg', scale: 0.9 }}
                        animate={{ rotate: '15deg', scale: 1.1 }}
                        transition={{ type: 'timing', duration: 1500, loop: true, repeatReverse: true }}
                        className="mr-4"
                    >
                        <Text className="text-4xl">👋</Text>
                    </MotiView>

                    <View>
                        <Text className="text-2xl font-jakarta-bold text-[#0E141B]">{`Welcome back, ${firstName}!`}</Text>
                        <Text className="text-sm text-gray-500 font-jakarta-medium mt-0.5">How are you feeling today?</Text>
                    </View>
                </View>

                <View className="mt-2 mb-2 bg-white rounded-xl flex-row items-center px-4 py-3 border border-gray-100 shadow-sm">
                    <Search color="#9CA3AF" size={20} />
                    <TextInput placeholder="Search memories..." placeholderTextColor="#9CA3AF" className="flex-1 ml-2 text-gray-700 font-jakarta text-sm" />
                </View>

                {isLoading ? (
                    <View className="py-20 items-center">
                        <ActivityIndicator size="large" color="#197FE6" />
                    </View>
                ) : (
                    <>
                        {!hasAnyMemories ? (
                            <View className="items-center justify-center py-20 opacity-50 gap-4">
                                <View className="w-20 h-20 bg-gray-100 rounded-full items-center justify-center">
                                    <Coffee color="#9CA3AF" size={40} />
                                </View>
                                <Text className="text-gray-400 font-jakarta-medium text-center">No memories yet.{'\n'}Tap + to create your first one!</Text>
                            </View>
                        ) : (
                            <>
                                {thisWeekMemories.length > 0 && (
                                    <View className="py-4">
                                        <Text className="text-primary text-xs font-jakarta-bold uppercase tracking-wider mb-3 ml-1">This Week</Text>
                                        {thisWeekMemories.map((item, index) => (
                                            <TouchableOpacity
                                                key={item.id}
                                                activeOpacity={0.9}
                                                onPress={() => router.push({
                                                    pathname: '/memory/[id]',
                                                    params: {
                                                        id: item.id,
                                                        title: item.title,
                                                        content: item.content,
                                                        imageUrl: item.imageUrl,
                                                        audioUrl: item.audioUrl || '',
                                                        mood: item.mood,
                                                        date: formatDate(item.createdAt),
                                                        tags: item.tags.join(','),
                                                        type: item.type
                                                    }
                                                })}
                                            >
                                                <MemoryCard
                                                    index={index}
                                                    type={item.type}
                                                    imageUrl={item.imageUrl}
                                                    mood={item.mood}
                                                    date={formatDate(item.createdAt)}
                                                    title={item.title}
                                                    content={item.content}
                                                    tags={item.tags}
                                                />
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                )}

                                <View className="pb-4 mt-2">
                                    <Text className="text-gray-400 text-xs font-jakarta-bold uppercase tracking-wider mb-3 ml-1">Last Week</Text>

                                    {olderMemories.length > 0 ? (
                                        olderMemories.map((item, index) => (
                                                <TouchableOpacity
                                                    key={item.id}
                                                    activeOpacity={0.9}
                                                    onPress={() => router.push({
                                                        pathname: '/memory/[id]',
                                                        params: {
                                                            id: item.id,
                                                            title: item.title,
                                                            content: item.content,
                                                            imageUrl: item.imageUrl,
                                                            audioUrl: item.audioUrl || '',
                                                            mood: item.mood,
                                                            date: formatDate(item.createdAt),
                                                            tags: item.tags.join(','),
                                                            type: item.type
                                                        }
                                                    })}
                                                >
                                                    <MemoryCard
                                                        index={index + 5}
                                                        type={item.type}
                                                        imageUrl={item.imageUrl}
                                                        mood={item.mood}
                                                        date={formatDate(item.createdAt)}
                                                        title={item.title}
                                                        content={item.content}
                                                        tags={item.tags}
                                                    />
                                                </TouchableOpacity>
                                        ))
                                    ) : (
                                        <View className="bg-white p-6 rounded-3xl items-center justify-center border border-dashed border-gray-200 gap-3">
                                            <View className="w-12 h-12 bg-gray-50 rounded-full items-center justify-center">
                                                <History color="#9CA3AF" size={20} />
                                            </View>
                                            <Text className="text-gray-400 text-xs font-jakarta-medium text-center">
                                                No older memories to show.{'\n'}Your history is clean!
                                            </Text>
                                        </View>
                                    )}
                                </View>

                                <View className="items-center opacity-50 py-6">
                                    <CheckCircle2 color="#9CA3AF" size={24} />
                                    <Text className="text-gray-400 text-xs font-jakarta-medium mt-2">You&#39;re all caught up!</Text>
                                </View>
                            </>
                        )}
                    </>
                )}
            </ScrollView>

            <TouchableOpacity
                onPress={() => router.push('/create-entry')}
                className="absolute bottom-12 right-6 w-14 h-14 bg-primary rounded-full items-center justify-center shadow-lg shadow-primary/40 active:scale-95"
            >
                <Plus color="white" size={32} />
            </TouchableOpacity>
        </MotiSafeAreaView>
    );
};

export default Home;