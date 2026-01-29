import {View, Text, TextInput, ScrollView, TouchableOpacity, Alert, BackHandler, Platform} from 'react-native';
import React, {useEffect} from 'react';
import {Settings, Search, Plus, BookHeart, CheckCircle2} from 'lucide-react-native';
import MemoryCard from '@/components/memory-card';
import {MotiSafeAreaView} from "moti";
import {useIsFocused} from "@react-navigation/core";

const Home = () => {
    const isFocused = useIsFocused();
    return (
        <MotiSafeAreaView
            from={{
                opacity: 0,
                translateY: 15,
            }}
            animate={{
                opacity: isFocused ? 1 : 0,
                translateY: isFocused ? 0 : 15
            }}
            transition={{
                type: 'timing',
                duration: 300,
            }}
            className="flex-1 bg-[#F6F7F8]">
            <View className="px-4 py-3 bg-[#F6F7F8]/80 flex-row items-center justify-between border-b border-gray-200/50">
                <View className="w-12 h-12 bg-primary/10 rounded-full items-center justify-center">
                    <BookHeart color="#197FE6" size={24} />
                </View>
                <Text className="text-[#0E141B] text-xl font-jakarta-bold">Memoria</Text>
                <TouchableOpacity className="w-10 h-10 items-center justify-center rounded-full active:bg-gray-200">
                    <Settings color="#0E141B" size={24} />
                </TouchableOpacity>
            </View>

            <ScrollView
                className="flex-1"
                contentContainerStyle={{
                    paddingHorizontal: 16,
                    paddingBottom: 100
                }}
                showsVerticalScrollIndicator={false}
            >
                <View className="mt-4 mb-2 bg-white rounded-xl flex-row items-center px-4 py-3 border border-gray-100 shadow-sm">
                    <Search color="#9CA3AF" size={20} />
                    <TextInput
                        placeholder="Search memories..."
                        placeholderTextColor="#9CA3AF"
                        className="flex-1 ml-2 text-gray-700 font-jakarta text-sm"
                    />
                </View>

                <View className="py-4">
                    <Text className="text-primary text-xs font-jakarta-bold uppercase tracking-wider mb-3 ml-1">
                        This Week
                    </Text>

                    <MemoryCard
                        index={0}
                        type="image"
                        imageUri="https://images.unsplash.com/photo-1507706352938-349f7e8a93cb?q=80&w=3154&auto=format&fit=crop"
                        emoji="😊"
                        date="Monday, Oct 24 • 5:30 PM"
                        title="A quiet walk in the park"
                        description="The trees are starting to turn orange and the air felt so crisp today. It was the perfect time to clear my head..."
                    />

                    <MemoryCard
                        index={1}
                        type="audio"
                        emoji="✨"
                        date="Sunday, Oct 23 • 8:15 AM"
                        title="Morning reflection"
                        description="Woke up feeling refreshed today. Decided to start the day with a long meditation session and some journaling about my goals..."
                    />

                    <MemoryCard
                        index={2}
                        type="audio"
                        emoji="✨"
                        date="Sunday, Oct 23 • 8:15 AM"
                        title="Morning reflection"
                        description="Woke up feeling refreshed today. Decided to start the day with a long meditation session and some journaling about my goals..."
                    />

                    <MemoryCard
                        type="audio"
                        emoji="✨"
                        date="Sunday, Oct 23 • 8:15 AM"
                        title="Morning reflection"
                        description="Woke up feeling refreshed today. Decided to start the day with a long meditation session and some journaling about my goals..."
                    />

                    <MemoryCard
                        index={3}
                        type="audio"
                        emoji="✨"
                        date="Sunday, Oct 23 • 8:15 AM"
                        title="Morning reflection"
                        description="Woke up feeling refreshed today. Decided to start the day with a long meditation session and some journaling about my goals..."
                    />

                    <MemoryCard
                        index={4}
                        type="audio"
                        emoji="✨"
                        date="Sunday, Oct 23 • 8:15 AM"
                        title="Morning reflection"
                        description="Woke up feeling refreshed today. Decided to start the day with a long meditation session and some journaling about my goals..."
                    />

                    <MemoryCard
                        index={5}
                        type="audio"
                        emoji="✨"
                        date="Sunday, Oct 23 • 8:15 AM"
                        title="Morning reflection"
                        description="Woke up feeling refreshed today. Decided to start the day with a long meditation session and some journaling about my goals..."
                    />
                </View>
                <View className="mb-4">
                    <Text className="text-gray-400 text-xs font-jakarta-bold uppercase tracking-wider mb-3 ml-1">
                        Earlier
                    </Text>

                    <MemoryCard
                        index={6}
                        type="image"
                        imageUri="https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?q=80&w=3087&auto=format&fit=crop"
                        emoji="🌧️"
                        date="Saturday, Oct 22 • 3:45 PM"
                        title="Rainy afternoon"
                        description="Watched the rain from the window while sipping warm tea. Very cozy and introspective. I finally finished reading my book..."
                    />
                    <MemoryCard
                        index={7}
                        type="image"
                        imageUri="https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?q=80&w=3087&auto=format&fit=crop"
                        emoji="🌧️"
                        date="Saturday, Oct 22 • 3:45 PM"
                        title="Rainy afternoon"
                        description="Watched the rain from the window while sipping warm tea. Very cozy and introspective. I finally finished reading my book..."
                    />
                    <MemoryCard
                        index={8}
                        type="image"
                        imageUri="https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?q=80&w=3087&auto=format&fit=crop"
                        emoji="🌧️"
                        date="Saturday, Oct 22 • 3:45 PM"
                        title="Rainy afternoon"
                        description="Watched the rain from the window while sipping warm tea. Very cozy and introspective. I finally finished reading my book..."
                    />
                </View>

                <View className="items-center opacity-50">
                    <CheckCircle2 color="#9CA3AF" size={24} />
                    <Text className="text-gray-400 text-xs font-jakarta-medium mt-2">
                        You&#39;re all caught up!
                    </Text>
                </View>
            </ScrollView>

            <TouchableOpacity
                className="absolute bottom-12 right-6 w-14 h-14 bg-primary rounded-full items-center justify-center shadow-lg shadow-primary/40 active:scale-95"
            >
                <Plus color="white" size={32} />
            </TouchableOpacity>
        </MotiSafeAreaView>
    );
};

export default Home;