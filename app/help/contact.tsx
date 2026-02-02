import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import React, { useState } from 'react';
import { MotiSafeAreaView } from 'moti';
import { useRouter } from "expo-router";
import { ChevronLeft, Mail, ExternalLink } from 'lucide-react-native';
import * as Linking from 'expo-linking';

const ContactSupport = () => {
    const router = useRouter();
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');

    const handleEmailSupport = () => {
        if (!subject.trim() || !message.trim()) {
            Alert.alert("Missing Info", "Please fill in both subject and message.");
            return;
        }

        const email = "manuthlakdiv2006@gmail.com";
        const body = `Message:\n${message}`;

        const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

        Linking.openURL(mailtoUrl).catch((err) => {
            console.error(err)
            Alert.alert("Error", "Could not open your email app. Please email us directly at " + email);
        });
    };

    return (
        <MotiSafeAreaView
            from={{ opacity: 0, translateX: 20 }}
            animate={{ opacity: 1, translateX: 0 }}
            className="flex-1 bg-[#F8F9FA]"
        >
            <View className="px-6 py-4 flex-row items-center justify-between bg-[#F8F9FA]/80 border-b border-gray-100/50">
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="w-10 h-10 items-center justify-center rounded-full bg-white shadow-sm active:bg-gray-50"
                >
                    <ChevronLeft color="#4B5563" size={24} />
                </TouchableOpacity>
                <Text className="text-xl font-jakarta-bold text-[#0E141B]">Contact Support</Text>
                <View className="w-10" />
            </View>

            <ScrollView className="flex-1 px-6 pt-8" showsVerticalScrollIndicator={false}>
                <View className="items-center mb-8">
                    <View className="w-16 h-16 bg-primary/10 rounded-2xl items-center justify-center mb-4">
                        <Mail color="#197FE6" size={32} />
                    </View>
                    <Text className="text-lg font-jakarta-bold text-[#0E141B]">Email Our Team</Text>
                    <Text className="text-sm text-gray-500 font-jakarta text-center mt-1 px-4">
                        Fill this form and we&#39;ll help you through your favorite email app.
                    </Text>
                </View>

                <View className="gap-6">
                    <View className="gap-2">
                        <Text className="text-xs font-jakarta-bold text-gray-400 uppercase tracking-widest ml-1">Subject</Text>
                        <TextInput
                            value={subject}
                            onChangeText={setSubject}
                            placeholder="What's the issue?"
                            placeholderTextColor="#9CA3AF"
                            className="bg-white p-4 rounded-2xl border border-gray-100 font-jakarta text-[#0E141B] text-base shadow-sm shadow-black/5"
                        />
                    </View>

                    <View className="gap-2">
                        <Text className="text-xs font-jakarta-bold text-gray-400 uppercase tracking-widest ml-1">Your Message</Text>
                        <TextInput
                            value={message}
                            onChangeText={setMessage}
                            placeholder="Describe what's happening..."
                            placeholderTextColor="#9CA3AF"
                            multiline
                            numberOfLines={8}
                            textAlignVertical="top"
                            className="bg-white p-4 rounded-2xl border border-gray-100 font-jakarta text-[#0E141B] text-base min-h-[180px] shadow-sm shadow-black/5"
                        />
                    </View>

                    <TouchableOpacity
                        onPress={handleEmailSupport}
                        className="w-full flex-row items-center justify-center py-4 rounded-2xl mt-4 bg-primary active:scale-95 shadow-lg shadow-primary/20"
                    >
                        <ExternalLink color="white" size={20} />
                        <Text className="text-white font-jakarta-bold text-base ml-2">Open Email App</Text>
                    </TouchableOpacity>

                    <Text className="text-[10px] text-gray-400 font-jakarta text-center mt-2 px-6">
                        Note: This will open your default email application to send the message.
                    </Text>
                </View>
            </ScrollView>
        </MotiSafeAreaView>
    );
};

export default ContactSupport;