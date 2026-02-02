import { View, Text, TextInput, TouchableOpacity, ScrollView, Modal, Image, Alert, ActivityIndicator } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { MotiSafeAreaView, MotiView } from 'moti';
import { useRouter, useNavigation } from "expo-router";
import * as ImagePicker from 'expo-image-picker';
import { Audio } from 'expo-av';
import {
    ChevronLeft, Calendar, Smile, Meh, Frown, CloudRain, Moon,
    Plus, X, Camera, Image as ImageIcon, Mic, Type, Clock, StopCircle, PlayCircle, PauseCircle, Trash2
} from 'lucide-react-native';
import { useAuth } from "@/hooks/use-auth";
import { createMemory } from "@/services/memory-service";
import { useLoader } from "@/hooks/user-loader";

const CreateEntry = () => {
    const router = useRouter();
    const navigation = useNavigation();
    const { user } = useAuth();

    const [entryType, setEntryType] = useState<'text' | 'audio' | null>(null);
    const [mood, setMood] = useState('Joy');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const {showLoader, hideLoader, isLoading: isMainLoading} = useLoader();
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [selectedTags, setSelectedTags] = useState<string[]>(['Personal']);

    const [recording, setRecording] = useState<Audio.Recording | null>(null);
    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [recordingUri, setRecordingUri] = useState<string | null>(null);
    const [isRecording, setIsRecording] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [playbackProgress, setPlaybackProgress] = useState(0);

    const [tagModalVisible, setTagModalVisible] = useState(false);
    const [attachModalVisible, setAttachModalVisible] = useState(false);
    const [entryDate, setEntryDate] = useState(new Date());

    const isSavingRef = useRef(false);

    const availableTags = ['Work', 'Personal', 'Family', 'Friends', 'Health', 'Travel', 'Hobby'];

    const moods = [
        { label: 'Joy', icon: <Smile size={28} color="#CA8A04" />, bg: 'bg-yellow-50', activeBorder: 'border-yellow-400', activeBg: 'bg-yellow-100' },
        { label: 'Calm', icon: <Meh size={28} color="#2563EB" />, bg: 'bg-blue-50', activeBorder: 'border-blue-400', activeBg: 'bg-blue-100' },
        { label: 'Sad', icon: <Frown size={28} color="#4F46E5" />, bg: 'bg-indigo-50', activeBorder: 'border-indigo-400', activeBg: 'bg-indigo-100' },
        { label: 'Angry', icon: <CloudRain size={28} color="#DC2626" />, bg: 'bg-red-50', activeBorder: 'border-red-400', activeBg: 'bg-red-100' },
        { label: 'Tired', icon: <Moon size={28} color="#475569" />, bg: 'bg-slate-100', activeBorder: 'border-slate-400', activeBg: 'bg-slate-200' },
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setEntryDate(new Date());
        }, 60000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        (async () => {
            await Audio.requestPermissionsAsync();
        })();
        return () => {
            if (sound) {
                sound.unloadAsync();
            }
        };
    }, [sound]);

    useEffect(() => {
        const hasUnsavedChanges = title.trim() !== '' || content.trim() !== '' || selectedImage !== null || recordingUri !== null;

        const unsubscribe = navigation.addListener('beforeRemove', (e) => {
            if (!hasUnsavedChanges || !entryType || isSavingRef.current) return;

            e.preventDefault();
            Alert.alert(
                'Discard changes?',
                'You have unsaved changes. Are you sure you want to discard them and leave?',
                [
                    { text: "Don't leave", style: 'cancel', onPress: () => {} },
                    { text: 'Discard', style: 'destructive', onPress: () => navigation.dispatch(e.data.action) },
                ]
            );
        });
        return unsubscribe;
    }, [navigation, title, content, selectedImage, entryType, recordingUri]);

    const startRecording = async () => {
        try {
            await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
            const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
            setRecording(recording);
            setIsRecording(true);
        } catch (err) {
            console.error('Failed to start recording', err);
            Alert.alert('Error', 'Failed to start recording');
        }
    };

    const stopRecording = async () => {
        if (!recording) return;
        setIsRecording(false);
        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();
        setRecording(null);
        setRecordingUri(uri);
    };

    const playSound = async () => {
        if (!recordingUri) return;
        try {
            const { sound } = await Audio.Sound.createAsync(
                { uri: recordingUri },
                { shouldPlay: true }
            );
            setSound(sound);
            setIsPlaying(true);

            sound.setOnPlaybackStatusUpdate((status) => {
                if (status.isLoaded) {
                    const progress = status.durationMillis
                        ? status.positionMillis / status.durationMillis
                        : 0;

                    setPlaybackProgress(progress * 100);

                    if (status.didJustFinish) {
                        setIsPlaying(false);
                        setPlaybackProgress(100);
                        setTimeout(() => setPlaybackProgress(0), 500);
                    }
                }
            });
        } catch (error) {
            console.error("Error playing sound", error);
        }
    };

    const stopSound = async () => {
        if (sound) {
            await sound.stopAsync();
            setIsPlaying(false);
        }
    };

    const deleteRecording = () => {
        setRecordingUri(null);
        setSound(null);
        setIsPlaying(false);
        setPlaybackProgress(0);
    };

    const resetForm = () => {
        setTitle('');
        setContent('');
        setSelectedImage(null);
        deleteRecording();
        setSelectedTags(['Personal']);
        setMood('Joy');
        setEntryType(null);
    };

    const handleBackPress = () => {
        const hasUnsavedChanges = title.trim() !== '' || content.trim() !== '' || selectedImage !== null || recordingUri !== null;
        if (hasUnsavedChanges) {
            Alert.alert('Discard changes?', 'You have unsaved changes. Are you sure to discard them?', [
                { text: "Cancel", style: 'cancel' },
                { text: 'Discard', style: 'destructive', onPress: () => resetForm() },
            ]);
        } else {
            resetForm();
        }
    };

    const formattedDateTime = entryDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + " • " + entryDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    const toggleTag = (tag: string) => {
        if (selectedTags.includes(tag)) setSelectedTags(selectedTags.filter(t => t !== tag));
        else setSelectedTags([...selectedTags, tag]);
    };

    const pickImage = async (mode: 'camera' | 'gallery') => {
        setAttachModalVisible(false);
        showLoader();
        setTimeout(async () => {
            try {
                let result;
                if (mode === 'camera') {
                    const { status } = await ImagePicker.requestCameraPermissionsAsync();
                    if (status !== 'granted') { Alert.alert('Permission Required', 'Camera permission is needed.'); return; }
                    result = await ImagePicker.launchCameraAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [4, 3], quality: 0.5 });
                } else {
                    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                    if (status !== 'granted') { Alert.alert('Permission Required', 'Library permission is needed.'); return; }
                    result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [4, 3], quality: 0.5 });
                }
                if (!result.canceled && result.assets && result.assets.length > 0) setSelectedImage(result.assets[0].uri);
            } catch (error) {
                console.error('Image picker error:', error);
                Alert.alert('Error', 'Failed to pick image.');
            } finally { hideLoader(); }
        }, 1500);
    };

    const handleSave = async () => {
        if (entryType === 'text' && (!title.trim() || !content.trim())) {
            Alert.alert("Incomplete Entry", "Please add a title and description.");
            return;
        }
        if (entryType === 'audio' && (!title.trim() || !recordingUri)) {
            Alert.alert("Incomplete Entry", "Please add a title and record audio.");
            return;
        }

        try {
            isSavingRef.current = true;
            setIsLoading(true);

            await createMemory(user?.uid!, {
                title,
                content: entryType === 'audio' ? 'Audio Memory' : content,
                mood,
                tags: selectedTags,
                entryType: entryType!,
                entryDate: new Date(),
                imageUri: selectedImage,
                audioUri: recordingUri
            });

            Alert.alert("Success", "Memory saved successfully!", [{
                text: "OK",
                onPress: () => {

                    router.back();
                }
            }]);
        } catch (error) {
            isSavingRef.current = false;
            Alert.alert("Error", "Could not save your memory. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    if (!entryType) {
        return (
            <MotiSafeAreaView from={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 bg-white px-6">
                <TouchableOpacity onPress={() => router.back()} className="mt-4 w-10 h-10 bg-gray-50 rounded-full items-center justify-center active:bg-gray-100 ml-4">
                    <ChevronLeft color="#0E141B" size={24} />
                </TouchableOpacity>
                <View className="flex-1 justify-center -mt-20 p-4">
                    <View className="mb-10"><Text className="text-3xl font-jakarta-bold text-[#0E141B] mb-2">New Memory</Text><Text className="text-gray-500 font-jakarta text-base">What kind of entry would you like to create today?</Text></View>
                    <View className="gap-4">
                        <TouchableOpacity onPress={() => setEntryType('text')} className="flex-row items-center p-5 bg-[#F6F7F8] rounded-3xl border-2 border-transparent active:border-primary active:bg-primary/5 transition-all">
                            <View className="w-14 h-14 rounded-2xl bg-white items-center justify-center shadow-sm"><Type color="#197FE6" size={28} /></View><View className="ml-4 flex-1"><Text className="text-lg font-jakarta-bold text-[#0E141B]">Text Entry</Text><Text className="text-sm text-gray-500 font-jakarta mt-0.5">Write about your day.</Text></View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setEntryType('audio')} className="flex-row items-center p-5 bg-[#F6F7F8] rounded-3xl border-2 border-transparent active:border-primary active:bg-primary/5 transition-all">
                            <View className="w-14 h-14 rounded-2xl bg-white items-center justify-center shadow-sm"><Mic color="#F97316" size={28} /></View><View className="ml-4 flex-1"><Text className="text-lg font-jakarta-bold text-[#0E141B]">Audio Entry</Text><Text className="text-sm text-gray-500 font-jakarta mt-0.5">Record your voice.</Text></View>
                        </TouchableOpacity>
                    </View>
                </View>
            </MotiSafeAreaView>
        );
    }

    return (
        <MotiSafeAreaView from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1, translateY: 0 }} className="flex-1 bg-[#F6F7F8]">
            <View className="px-4 py-3 bg-[#F6F7F8]/90 flex-row items-center justify-between border-b border-gray-200/50 z-10">
                <TouchableOpacity onPress={handleBackPress} className="w-10 h-10 items-center justify-center rounded-full active:bg-gray-200"><ChevronLeft color="#0E141B" size={24} /></TouchableOpacity>
                <Text className="text-[#0E141B] text-lg font-jakarta-bold">{entryType === 'text' ? 'New Text Entry' : 'New Audio Entry'}</Text>
                <TouchableOpacity onPress={handleSave} disabled={isLoading}>
                    {isLoading ? <ActivityIndicator size="small" color="#197FE6" /> : <Text className="text-primary font-jakarta-bold text-base">Save</Text>}
                </TouchableOpacity>
            </View>

            <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 120 }}>
                <View className="items-center py-6">
                    <View className="flex-row items-center bg-white px-5 py-3 rounded-full border border-gray-100 shadow-sm">
                        <Calendar color="#197FE6" size={16} /><Text className="text-sm font-jakarta-bold text-[#4E7397] ml-2 mr-2">{formattedDateTime}</Text><Clock color="#197FE6" size={14} opacity={0.5} />
                    </View>
                </View>

                <View className="px-6 mb-8">
                    <Text className="text-xs font-jakarta-bold text-gray-400 uppercase tracking-widest mb-4 ml-1">How are you feeling?</Text>
                    <View className="flex-row justify-between bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                        {moods.map((m) => {
                            const isActive = mood === m.label;
                            return (
                                <TouchableOpacity key={m.label} onPress={() => setMood(m.label)} className="items-center gap-2">
                                    <MotiView animate={{ scale: isActive ? 1.1 : 1 }} className={`w-12 h-12 rounded-full items-center justify-center ${isActive ? m.activeBg : m.bg} ${isActive ? 'border-2 ' + m.activeBorder : ''}`}>{m.icon}</MotiView><Text className={`text-[10px] font-jakarta-bold uppercase ${isActive ? 'text-[#0E141B]' : 'text-gray-400'}`}>{m.label}</Text>
                                </TouchableOpacity>
                            )
                        })}
                    </View>
                </View>

                {entryType === 'audio' && (
                    <View className="px-6 mb-6">
                        <View className="bg-white p-6 rounded-3xl border border-gray-100 items-center shadow-sm">
                            {recordingUri ? (
                                <View className="w-full items-center">
                                    <View className="flex-row items-center justify-between w-full bg-gray-50 p-4 rounded-2xl mb-4 border border-gray-100">
                                        <TouchableOpacity onPress={isPlaying ? stopSound : playSound}>
                                            {isPlaying ? <PauseCircle size={40} color="#197FE6" /> : <PlayCircle size={40} color="#197FE6" />}
                                        </TouchableOpacity>

                                        <View className="flex-1 h-1.5 bg-gray-200 mx-4 rounded-full overflow-hidden">
                                            <MotiView
                                                animate={{ width: `${playbackProgress}%` }}
                                                transition={{ type: 'timing', duration: 100 }}
                                                className="h-full bg-primary"
                                            />
                                        </View>

                                        <Text className="text-xs font-jakarta-medium text-gray-500">Preview</Text>
                                    </View>

                                    <TouchableOpacity
                                        onPress={deleteRecording}
                                        className="flex-row items-center bg-red-50 px-5 py-2.5 rounded-full active:bg-red-100"
                                    >
                                        <Trash2 size={16} color="#EF4444" />
                                        <Text className="text-red-500 text-xs font-jakarta-bold ml-2 uppercase tracking-wide">Delete & Retry</Text>
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                <View className="items-center gap-4 py-2">
                                    <View className="relative justify-center items-center">
                                        {isRecording && (
                                            <MotiView
                                                from={{ opacity: 0.5, scale: 1 }}
                                                animate={{ opacity: 0, scale: 1.6 }}
                                                transition={{ type: 'timing', duration: 1000, loop: true }}
                                                className="absolute w-24 h-24 rounded-full bg-red-100"
                                            />
                                        )}

                                        <TouchableOpacity
                                            onPress={isRecording ? stopRecording : startRecording}
                                            className={`w-20 h-20 rounded-full items-center justify-center ${isRecording ? 'bg-red-500 shadow-red-200' : 'bg-primary shadow-blue-200'} shadow-xl`}
                                        >
                                            {isRecording ? <StopCircle size={32} color="white" /> : <Mic size={32} color="white" />}
                                        </TouchableOpacity>
                                    </View>

                                    <View className="items-center">
                                        <Text className="text-lg font-jakarta-bold text-[#0E141B] mb-1">
                                            {isRecording ? 'Recording...' : 'Tap to Record'}
                                        </Text>
                                        <Text className="text-sm text-gray-400 font-jakarta">
                                            {isRecording ? 'Tap the button to stop' : 'Capture your thoughts'}
                                        </Text>
                                    </View>
                                </View>
                            )}
                        </View>
                    </View>
                )}

                <View className="px-6 gap-4">
                    <TextInput placeholder="Title" placeholderTextColor="#9CA3AF" value={title} onChangeText={setTitle} className="text-2xl font-jakarta-bold text-[#0E141B]" />
                    {entryType === 'text' && (
                        <TextInput multiline placeholder="Start writing here..." placeholderTextColor="#9CA3AF" className="text-lg font-jakarta text-[#0E141B] leading-7 min-h-[150px]" style={{ textAlignVertical: 'top' }} value={content} onChangeText={setContent} />
                    )}
                    {entryType === 'audio' && (
                        <TextInput multiline placeholder="Add a description (optional)..." placeholderTextColor="#9CA3AF" className="text-lg font-jakarta text-[#0E141B] leading-7 min-h-[100px]" style={{ textAlignVertical: 'top' }} value={content} onChangeText={setContent} />
                    )}
                </View>

                {entryType === 'text' && selectedImage && (
                    <View className="px-6 mt-4">
                        <View className="relative w-full h-56 rounded-2xl overflow-hidden shadow-sm">
                            <Image source={{ uri: selectedImage }} className="w-full h-full" resizeMode="cover" />
                            <TouchableOpacity onPress={() => setSelectedImage(null)} className="absolute top-2 right-2 bg-black/50 p-2 rounded-full"><X color="white" size={20} /></TouchableOpacity>
                        </View>
                    </View>
                )}

                <View className="px-6 mt-6">
                    <Text className="text-xs font-jakarta-bold text-gray-400 uppercase tracking-widest mb-3 ml-1">Details</Text>
                    <View className="flex-row flex-wrap gap-3">
                        {entryType === 'text' && (
                            <TouchableOpacity onPress={() => setAttachModalVisible(true)} className="flex-row items-center bg-white px-4 py-3 rounded-xl border border-gray-200 shadow-sm active:bg-gray-50"><Camera color="#197FE6" size={18} /><Text className="text-[#0E141B] text-xs font-jakarta-bold ml-2 uppercase">Add Photo</Text></TouchableOpacity>
                        )}
                        <TouchableOpacity onPress={() => setTagModalVisible(true)} className="flex-row items-center bg-white px-4 py-3 rounded-xl border border-gray-200 shadow-sm active:bg-gray-50"><Plus color="#197FE6" size={18} /><Text className="text-[#0E141B] text-xs font-jakarta-bold ml-2 uppercase">Add Tag</Text></TouchableOpacity>
                    </View>
                    <View className="flex-row flex-wrap gap-2 mt-4">
                        {selectedTags.map((tag) => (
                            <View key={tag} className="flex-row items-center bg-primary/10 px-3 py-1.5 rounded-lg border border-primary/20"><Text className="text-primary text-xs font-jakarta-bold mr-2 uppercase">{tag}</Text><TouchableOpacity onPress={() => toggleTag(tag)}><X color="#197FE6" size={12} /></TouchableOpacity></View>
                        ))}
                    </View>
                </View>
            </ScrollView>

            <Modal visible={attachModalVisible} transparent={true} animationType="slide" onRequestClose={() => setAttachModalVisible(false)}>
                <View className="flex-1 justify-end bg-black/40">
                    <TouchableOpacity className="absolute inset-0" onPress={() => setAttachModalVisible(false)} />
                    <View className="bg-white rounded-t-[32px] p-6 pb-10 shadow-2xl">
                        <View className="w-12 h-1.5 bg-gray-200 rounded-full self-center mb-6 opacity-50" />
                        <Text className="text-xl font-jakarta-bold text-[#0E141B] mb-1">Add Photo</Text>
                        <View className="gap-3 mt-4">
                            <TouchableOpacity disabled={isMainLoading} onPress={() => pickImage('camera')} className="flex-row items-center p-4 bg-gray-50 rounded-2xl border border-gray-100 active:bg-gray-100"><Camera color="#197FE6" size={24} /><Text className="ml-4 text-base font-jakarta-bold text-[#0E141B]">Take Photo</Text></TouchableOpacity>
                            <TouchableOpacity disabled={isMainLoading} onPress={() => pickImage('gallery')} className="flex-row items-center p-4 bg-gray-50 rounded-2xl border border-gray-100 active:bg-gray-100"><ImageIcon color="#9333EA" size={24} /><Text className="ml-4 text-base font-jakarta-bold text-[#0E141B]">From Gallery</Text></TouchableOpacity>
                        </View>
                        <TouchableOpacity onPress={() => setAttachModalVisible(false)} className="mt-6 bg-gray-100 py-4 rounded-2xl items-center"><Text className="text-gray-600 font-jakarta-bold">Cancel</Text></TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <Modal visible={tagModalVisible} transparent={true} animationType="slide" onRequestClose={() => setTagModalVisible(false)}>
                <View className="flex-1 justify-end bg-black/40"><TouchableOpacity className="absolute inset-0" onPress={() => setTagModalVisible(false)} /><MotiView from={{translateY: 300}} animate={{translateY: 0}} className="bg-white rounded-t-[32px] p-6 pb-10 shadow-2xl h-[50%]"><View className="w-12 h-1.5 bg-gray-200 rounded-full self-center mb-6 opacity-50" /><Text className="text-xl font-jakarta-bold text-[#0E141B] mb-4">Select Tags</Text><ScrollView contentContainerStyle={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>{availableTags.map((tag) => {const isSelected = selectedTags.includes(tag);return (<TouchableOpacity key={tag} onPress={() => toggleTag(tag)} className={`px-4 py-3 rounded-xl border ${isSelected ? 'bg-primary border-primary' : 'bg-gray-50 border-gray-200'}`}><Text className={`text-sm font-jakarta-bold ${isSelected ? 'text-white' : 'text-gray-600'}`}>{tag}</Text></TouchableOpacity>)})}</ScrollView><TouchableOpacity onPress={() => setTagModalVisible(false)} className="mt-4 bg-primary py-4 rounded-2xl items-center"><Text className="text-white font-jakarta-bold">Done</Text></TouchableOpacity></MotiView></View>
            </Modal>
        </MotiSafeAreaView>
    );
};

export default CreateEntry;