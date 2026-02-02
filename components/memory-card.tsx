import { View, Text, Image } from 'react-native';
import React from 'react';
import {
    Image as ImageIcon, Mic,
    Smile, Meh, Frown, CloudRain, Moon
} from 'lucide-react-native';
import { MotiView } from 'moti';
import { useIsFocused } from '@react-navigation/native';

interface MemoryCardProps {
    imageUrl?: string;
    mood: string;
    date: string;
    title: string;
    content: string;
    tags: string[];
    type: 'text' | 'audio';
    index?: number;
}

const getMoodConfig = (mood: string) => {
    switch (mood) {
        case 'Joy': return { icon: Smile, color: '#CA8A04', bg: 'bg-yellow-50', border: 'border-yellow-200' };
        case 'Calm': return { icon: Meh, color: '#2563EB', bg: 'bg-blue-50', border: 'border-blue-200' };
        case 'Sad': return { icon: Frown, color: '#4F46E5', bg: 'bg-indigo-50', border: 'border-indigo-200' };
        case 'Angry': return { icon: CloudRain, color: '#DC2626', bg: 'bg-red-50', border: 'border-red-200' };
        case 'Tired': return { icon: Moon, color: '#475569', bg: 'bg-slate-100', border: 'border-slate-200' };
        default: return { icon: Smile, color: '#9CA3AF', bg: 'bg-gray-50', border: 'border-gray-200' };
    }
};

const MemoryCard = ({ imageUrl, mood, date, title, content, tags, type, index = 0 }: MemoryCardProps) => {
    const isFocused = useIsFocused();

    const moodConfig = getMoodConfig(mood);
    const MoodIcon = moodConfig.icon;

    return (
        <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: isFocused ? 1 : 0, translateY: isFocused ? 0 : 20 }}
            transition={{ type: 'timing', duration: 600, delay: isFocused ? index * 100 : 0 }}
            className="bg-white rounded-3xl border border-gray-100 shadow-sm mb-4 overflow-hidden"
        >
            {type === 'text' && imageUrl ? (
                <Image
                    source={{ uri: imageUrl }}
                    className="w-full h-48 bg-gray-100"
                    resizeMode="cover"
                />
            ) : null}

            <View className="p-5">
                <View className="flex-row items-center justify-between mb-3">
                    <View className="flex-row items-center gap-3">
                        {/* Mood Icon Box */}
                        <View className={`w-10 h-10 rounded-full items-center justify-center ${moodConfig.bg} border ${moodConfig.border}`}>
                            <MoodIcon size={20} color={moodConfig.color} />
                        </View>

                        {/* Date Text */}
                        <Text className="text-gray-400 text-xs font-jakarta-bold uppercase tracking-wider">
                            {date}
                        </Text>
                    </View>

                    {type === 'audio' ? (
                        <Mic size={18} color="#9CA3AF" />
                    ) : (
                        <ImageIcon size={18} color="#9CA3AF" />
                    )}
                </View>

                <View className="mb-4">
                    <Text className="text-[#0E141B] text-xl font-jakarta-bold leading-tight mb-2">
                        {title}
                    </Text>

                    <Text
                        className="text-gray-500 text-base font-jakarta leading-relaxed"
                        numberOfLines={3}
                    >
                        {content}
                    </Text>
                </View>

                {tags && tags.length > 0 && (
                    <View className="flex-row flex-wrap gap-2 pt-2">
                        {tags.map((tag, i) => (
                            <View key={i} className="bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200/60">
                                <Text className="text-[10px] text-gray-500 font-jakarta-bold uppercase tracking-wider">
                                    {tag}
                                </Text>
                            </View>
                        ))}
                    </View>
                )}
            </View>
        </MotiView>
    );
};

export default MemoryCard;