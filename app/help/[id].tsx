import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import React from 'react';
import { MotiSafeAreaView } from 'moti';
import { useRouter, useLocalSearchParams } from "expo-router";
import { ChevronLeft, ThumbsUp, ThumbsDown } from 'lucide-react-native';

const FAQDetail = () => {
    const router = useRouter();
    const { id } = useLocalSearchParams();

    const faqData: any = {
        'backup': {
            title: "How do I back up my diary?",
            intro: "Your privacy and data security are our top priorities. Memoria offers several ways to ensure your reflections are never lost.",
            steps: [
                {
                    id: 1,
                    title: "iCloud Sync:",
                    desc: "By default, if enabled in settings, your diary is automatically backed up to your private iCloud storage. This allows for seamless transitions between your iPhone and iPad."
                },
                {
                    id: 2,
                    title: "Manual Export:",
                    desc: "You can create a manual backup anytime by going to Settings > Data > Export All. This generates a secure ZIP file containing your entries and photos."
                },
                {
                    id: 3,
                    title: "Google Drive:",
                    desc: "For cross-platform peace of mind, you can link your Google account to perform weekly automated backups."
                }
            ],
            footer: "We recommend keeping iCloud Sync active for the most effortless experience. If you ever switch devices, simply log in with your Apple ID and your Memoria will be waiting for you."
        },
        'default': {
            title: "Help Article",
            intro: "Here is the information regarding your query.",
            steps: [
                { id: 1, title: "Step One:", desc: "Go to settings and find the relevant section." },
                { id: 2, title: "Step Two:", desc: "Follow the on-screen instructions." }
            ],
            footer: "If you need more help, please contact support."
        }
    };

    const content = faqData[id as string] || faqData['default'];

    return (
        <MotiSafeAreaView
            from={{ opacity: 0, translateX: 20 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ type: 'timing', duration: 300 }}
            className="flex-1 bg-[#F8F9FA]"
        >
            {/* Header */}
            <View className="px-6 py-4 flex-row items-center justify-between bg-[#F8F9FA]/80 border-b border-gray-100/50 z-10">
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="w-10 h-10 items-center justify-center rounded-full bg-white shadow-sm shadow-black/5 active:bg-gray-50"
                >
                    <ChevronLeft color="#4B5563" size={24} />
                </TouchableOpacity>
                <View className="w-10" />
            </View>

            <ScrollView
                className="flex-1 px-6"
                contentContainerStyle={{ paddingBottom: 50 }}
                showsVerticalScrollIndicator={false}
            >
                <View className="mb-8 mt-4">
                    <Text className="text-2xl md:text-3xl font-jakarta-bold leading-tight tracking-tight text-[#0E141B]">
                        {content.title}
                    </Text>
                </View>

                <View className="bg-white rounded-[24px] shadow-sm shadow-black/5 border border-gray-100/50 p-6 mb-10">
                    <Text className="text-gray-600 font-jakarta text-base leading-7 mb-6">
                        {content.intro}
                    </Text>

                    <View className="gap-6">
                        {content.steps.map((step: any) => (
                            <View key={step.id} className="flex-row gap-4">
                                <View className="w-8 h-8 rounded-full bg-blue-50 flex-shrink-0 items-center justify-center">
                                    <Text className="text-primary font-jakarta-bold text-sm">{step.id}</Text>
                                </View>
                                <Text className="flex-1 text-gray-600 font-jakarta leading-6 text-sm">
                                    <Text className="font-jakarta-bold text-[#0E141B]">{step.title} </Text>
                                    {step.desc}
                                </Text>
                            </View>
                        ))}
                    </View>

                    <View className="mt-6 pt-6 border-t border-gray-50">
                        <Text className="text-gray-600 font-jakarta text-sm leading-6">
                            {content.footer}
                        </Text>
                    </View>
                </View>

                <View className="items-center gap-6 mb-10">
                    <Text className="text-gray-500 font-jakarta-medium">Was this helpful?</Text>
                    <View className="flex-row gap-4 w-full">
                        <TouchableOpacity className="flex-1 flex-row items-center justify-center gap-2 py-4 px-6 bg-blue-50 rounded-2xl active:scale-95 active:bg-blue-100">
                            <ThumbsUp size={20} color="#3B82F6" />
                            <Text className="text-blue-600 font-jakarta-bold">Yes</Text>
                        </TouchableOpacity>

                        <TouchableOpacity className="flex-1 flex-row items-center justify-center gap-2 py-4 px-6 bg-purple-50 rounded-2xl active:scale-95 active:bg-purple-100">
                            <ThumbsDown size={20} color="#9333EA" />
                            <Text className="text-purple-600 font-jakarta-bold">No</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View className="items-center mb-8">
                    <Text className="text-sm text-gray-400 font-jakarta">Need more information?</Text>
                    <TouchableOpacity className="mt-2">
                        <Text className="text-primary font-jakarta-bold underline">Chat with a Specialist</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </MotiSafeAreaView>
    );
};

export default FAQDetail;