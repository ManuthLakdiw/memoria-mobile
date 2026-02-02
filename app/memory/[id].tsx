import { View, Text, Image, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons, Feather, MaterialIcons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { MotiView } from 'moti';
import { useAuth } from '@/hooks/use-auth';
import { deleteMemory } from '@/services/memory-service';

export default function MemoryDetail() {
    const params = useLocalSearchParams();
    const router = useRouter();
    const { user } = useAuth();

    const { id, title, content, imageUrl, audioUrl, mood, date, tags, type } = params;

    const parsedTags = typeof tags === 'string' ? tags.split(',') : [];

    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        return () => {
            if (sound) {
                sound.unloadAsync();
            }
        };
    }, [sound]);

    const togglePlayback = async () => {
        if (!audioUrl) return;

        try {
            if (sound) {
                if (isPlaying) {
                    await sound.pauseAsync();
                    setIsPlaying(false);
                } else {
                    await sound.playAsync();
                    setIsPlaying(true);
                }
            } else {
                const { sound: newSound } = await Audio.Sound.createAsync(
                    { uri: audioUrl as string },
                    { shouldPlay: true }
                );
                setSound(newSound);
                setIsPlaying(true);

                newSound.setOnPlaybackStatusUpdate((status) => {
                    if (status.isLoaded) {
                        const p = status.durationMillis
                            ? status.positionMillis / status.durationMillis
                            : 0;
                        setProgress(p * 100);

                        if (status.didJustFinish) {
                            setIsPlaying(false);
                            setProgress(100);
                            newSound.setPositionAsync(0);
                            setProgress(0);
                        }
                    }
                });
            }
        } catch (error) {
            console.error("Audio Error:", error);
            Alert.alert("Error", "Could not play audio.");
        }
    };

    const handleDelete = () => {
        Alert.alert(
            "Delete Memory",
            "Are you sure you want to delete this memory? This cannot be undone.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        setIsLoading(true);
                        try {
                            if (user?.uid && id) {
                                await deleteMemory(user.uid, id as string);
                                router.back(); // Home එකට යන්න
                            }
                        } catch (error) {
                            Alert.alert("Error", "Failed to delete memory.");
                        } finally {
                            setIsLoading(false);
                        }
                    }
                }
            ]
        );
    };

    const handleEdit = () => {
        Alert.alert("Coming Soon", "Edit functionality will be added next!");
    };

    const getMoodColor = (moodName: string) => {
        switch(moodName) {
            case 'Joy': return { bg: 'bg-yellow-50', text: 'text-yellow-700', icon: '😊' };
            case 'Calm': return { bg: 'bg-blue-50', text: 'text-blue-700', icon: '😌' };
            case 'Sad': return { bg: 'bg-indigo-50', text: 'text-indigo-700', icon: '😢' };
            case 'Angry': return { bg: 'bg-red-50', text: 'text-red-700', icon: '😠' };
            case 'Tired': return { bg: 'bg-slate-100', text: 'text-slate-700', icon: '😴' };
            default: return { bg: 'bg-gray-50', text: 'text-gray-700', icon: '😐' };
        }
    };

    const moodStyle = getMoodColor(mood as string);

    if (isLoading) {
        return (
            <View className="flex-1 justify-center items-center bg-[#F6F7F8]">
                <ActivityIndicator size="large" color="#197FE6" />
            </View>
        );
    }

    return (
        <View className="flex-1 bg-[#F6F7F8]">
            <View className="absolute top-0 left-0 right-0 z-50 flex-row justify-between items-center px-6 pt-14 pb-4">
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="w-10 h-10 bg-gray-50 rounded-full items-center justify-center shadow-sm backdrop-blur-md"
                >
                    <Feather name="chevron-left" size={24} color="#0E141B" />
                </TouchableOpacity>

                <View className="flex-row gap-3">
                    <TouchableOpacity className="w-10 h-10 bg-gray-50  rounded-full items-center justify-center shadow-sm">
                        <Feather name="share" size={20} color="#0E141B" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={handleDelete}
                        className="w-10 h-10 bg-gray-50  rounded-full items-center justify-center shadow-sm"
                    >
                        <Feather name="trash-2" size={20} color="#EF4444" />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                <View className="w-full h-[400px] bg-gray-200 relative">
                    {imageUrl ? (
                        <Image
                            source={{ uri: imageUrl as string }}
                            className="w-full h-full"
                            resizeMode="cover"
                        />
                    ) : (
                        <View className="w-full h-full items-center justify-center bg-gray-300">
                            <Feather name="image" size={40} color="gray" />
                        </View>
                    )}
                    <View className="absolute bottom-0 left-0 right-0 h-10 bg-[#F6F7F8] rounded-t-[40px] -mb-1" />
                </View>

                <View className="px-6 -mt-6">
                    <View className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">

                        <View className="flex-row items-center gap-3 mb-4">
                            <View className={`flex-row items-center gap-2 ${moodStyle.bg} px-3 py-1.5 rounded-full`}>
                                <Text>{moodStyle.icon}</Text>
                                <Text className={`text-sm font-jakarta-bold ${moodStyle.text}`}>{mood}</Text>
                            </View>
                            <View className="h-1 w-1 bg-gray-300 rounded-full" />
                            <Text className="text-gray-400 text-sm font-jakarta-medium">{date}</Text>
                        </View>

                        <Text className="text-2xl font-jakarta-bold text-[#0E141B] mb-4 leading-tight">
                            {title}
                        </Text>

                        {type === 'text' && content ? (
                            <Text className="text-gray-600 text-base font-jakarta leading-7 mb-6">
                                {content}
                            </Text>
                        ) : null}

                        {type === 'audio' && (
                            <View className="mt-2 mb-6 bg-[#F6F7F8] rounded-2xl p-4 flex-row items-center gap-4 border border-gray-200">
                                <TouchableOpacity
                                    onPress={togglePlayback}
                                    className="w-12 h-12 bg-primary rounded-full items-center justify-center shadow-md shadow-blue-200"
                                >
                                    <Ionicons name={isPlaying ? "pause" : "play"} size={24} color="white" style={{ marginLeft: isPlaying ? 0 : 2 }} />
                                </TouchableOpacity>

                                <View className="flex-1">
                                    <View className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                        <MotiView
                                            animate={{ width: `${progress}%` }}
                                            transition={{ type: 'timing', duration: 100 }}
                                            className="h-full bg-primary"
                                        />
                                    </View>
                                </View>

                                <MaterialIcons name="graphic-eq" size={24} color="#9CA3AF" />
                            </View>
                        )}

                        {type === 'audio' && content ? (
                            <View>
                                <Text className="text-xs font-jakarta-bold text-gray-400 uppercase tracking-widest mb-2">Note</Text>
                                <Text className="text-gray-600 text-sm font-jakarta leading-6 mb-6">
                                    {content}
                                </Text>
                            </View>
                        ) : null}

                        {parsedTags.length > 0 && (
                            <View className="flex-row flex-wrap gap-2 pt-4 border-t border-gray-100">
                                {parsedTags.map((tag: string, index: number) => (
                                    <View key={index} className="px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-100">
                                        <Text className="text-xs text-gray-500 font-jakarta-bold">#{tag}</Text>
                                    </View>
                                ))}
                            </View>
                        )}

                    </View>
                </View>
            </ScrollView>

            <View className="absolute bottom-0 left-0 right-0 p-6 pt-10 bg-transparent" pointerEvents="box-none">
                <View className="flex-row justify-end">
                    <TouchableOpacity
                        onPress={handleEdit}
                        className="w-14 h-14 bg-primary rounded-full items-center justify-center shadow-lg shadow-primary/30 active:scale-95"
                    >
                        <MaterialIcons name="edit" size={28} color="white" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

