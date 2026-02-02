import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import React from 'react';
import { MotiSafeAreaView } from 'moti';
import { useRouter } from "expo-router";
import {
    ChevronLeft, Search, Rocket, Heart, Shield, UserCog, ChevronRight
} from 'lucide-react-native';

const HelpCenter = () => {
    const router = useRouter();

    const categories = [
        { title: 'Getting Started', icon: <Rocket size={32} color="#3B82F6" />, bg: 'bg-blue-50' },
        { title: 'Mood Tracking', icon: <Heart size={32} color="#F43F5E" />, bg: 'bg-rose-50' },
        { title: 'Privacy & Security', icon: <Shield size={32} color="#10B981" />, bg: 'bg-emerald-50' },
        { title: 'Account Settings', icon: <UserCog size={32} color="#F59E0B" />, bg: 'bg-amber-50' },
    ];

    const faqs = [
        { id: 'backup', question: "How do I back up my diary?" },
        { id: 'export', question: "Can I export my mood history?" },
        { id: 'reminder', question: "How to change my daily reminder?" },
        { id: 'encryption', question: "Is my data end-to-end encrypted?" }
    ];

    return (
        <MotiSafeAreaView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 300 }}
            className="flex-1 bg-[#F8F9FA]"
        >
            <View className="px-6 py-4 flex-row items-center justify-between bg-[#F8F9FA]/80 border-b border-gray-100/50 z-10">
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="w-10 h-10 items-center justify-center rounded-full bg-white shadow-sm shadow-black/5 active:bg-gray-50"
                >
                    <ChevronLeft color="#4B5563" size={24} />
                </TouchableOpacity>
                <Text className="text-xl font-jakarta-bold text-[#0E141B] tracking-tight">Help Center</Text>
                <View className="w-10" />
            </View>

            <ScrollView
                className="flex-1 px-6 pt-6"
                contentContainerStyle={{ paddingBottom: 40 }}
                showsVerticalScrollIndicator={false}
            >

                <View className="mb-8">
                    <View className="bg-white rounded-2xl p-4 flex-row items-center gap-3 border border-gray-100 shadow-sm shadow-black/5">
                        <Search color="#9CA3AF" size={20} />
                        <TextInput
                            placeholder="Search for help"
                            placeholderTextColor="#9CA3AF"
                            className="flex-1 text-sm font-jakarta-medium text-[#0E141B]"
                        />
                    </View>
                </View>

                <View className="flex-row flex-wrap justify-between gap-y-4 mb-10">
                    {categories.map((cat, index) => (
                        <TouchableOpacity
                            key={index}
                            className="w-[48%] bg-white p-6 rounded-2xl border border-gray-100 shadow-sm shadow-black/5 flex-col items-center gap-3 active:scale-95"
                        >
                            <View className={`w-14 h-14 rounded-2xl ${cat.bg} items-center justify-center`}>
                                {cat.icon}
                            </View>
                            <Text className="text-sm font-jakarta-bold text-[#0E141B] text-center leading-tight">
                                {cat.title}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <View>
                    <Text className="text-xs font-jakarta-bold text-gray-400 uppercase tracking-widest mb-4 ml-1">
                        Frequently Asked Questions
                    </Text>
                    <View className="gap-3">
                        {faqs.map((item) => (
                            <TouchableOpacity
                                key={item.id}
                                onPress={() => router.push(`/help/${item.id}`)}
                                className="w-full flex-row items-center justify-between p-5 bg-white rounded-2xl border border-gray-100 shadow-sm shadow-black/5 active:bg-gray-50"
                            >
                                <Text className="font-jakarta-medium text-left text-sm text-[#0E141B] flex-1 mr-2">
                                    {item.question}
                                </Text>
                                <ChevronRight color="#D1D5DB" size={20} />
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <View className="mt-10 items-center mb-8">
                    <Text className="text-sm text-gray-500 font-jakarta">Still need help?</Text>
                    <TouchableOpacity className="mt-2">
                        <Text className="text-primary font-jakarta-bold text-base">Contact Support</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </MotiSafeAreaView>
    );
};

export default HelpCenter;