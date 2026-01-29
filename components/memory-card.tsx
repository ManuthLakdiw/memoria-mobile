import { View, Text, Image } from 'react-native';
import React from 'react';
import { Image as ImageIcon, Mic } from 'lucide-react-native';
import { MotiView } from 'moti';
import { useIsFocused } from '@react-navigation/native';

interface MemoryCardProps {
    imageUri?: string;
    emoji: string;
    date: string;
    title: string;
    description: string;
    type: 'image' | 'audio';
    index?: number;
}

const MemoryCard = ({ imageUri, emoji, date, title, description, type, index = 0 }: MemoryCardProps) => {
    const isFocused = useIsFocused();

    return (
        <MotiView
            from={{
                opacity: 0,
                translateY: 50,
                translateX: -50
            }}
            animate={{
                opacity: isFocused ? 1 : 0,
                translateY: isFocused ? 0 : 50,
                translateX: isFocused ? 0 : -50
            }}
            transition={{
                type: 'timing',
                duration: 700,
                delay: isFocused ? index * 200 : 0,
            }}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-4 overflow-hidden"
        >

            {imageUri && (
                <Image
                    source={{ uri: imageUri }}
                    className="w-full h-48 bg-gray-200"
                    resizeMode="cover"
                />
            )}

            <View className="p-4 flex-col gap-2">
                <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center gap-2">
                        <View className={`w-8 h-8 rounded-full items-center justify-center ${type === 'image' ? 'bg-yellow-100' : 'bg-blue-100'}`}>
                            <Text>{emoji}</Text>
                        </View>
                        <Text className="text-gray-500 text-xs font-jakarta-medium">{date}</Text>
                    </View>
                    {type === 'image' ? (
                        <ImageIcon size={18} color="#9CA3AF" />
                    ) : (
                        <Mic size={18} color="#9CA3AF" />
                    )}
                </View>

                <View className="gap-1">
                    <Text className="text-[#0E141B] text-lg font-jakarta-bold leading-tight">
                        {title}
                    </Text>
                    <Text className="text-gray-600 text-sm font-jakarta leading-relaxed" numberOfLines={2}>
                        {description}
                    </Text>
                </View>
            </View>
        </MotiView>
    );
};

export default MemoryCard;