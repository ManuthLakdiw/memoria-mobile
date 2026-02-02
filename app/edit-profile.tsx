import { View, Text, ScrollView, TouchableOpacity, Image, TextInput, Alert, ActivityIndicator } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { MotiSafeAreaView } from 'moti';
import { useRouter, useNavigation } from "expo-router";
import { ChevronLeft, Camera, ChevronDown, Check } from 'lucide-react-native';
import { useAuth } from "@/hooks/use-auth";
import { getUserProfile, updateUserProfile } from "@/services/auth-service";
import * as ImagePicker from 'expo-image-picker';
import { uploadImageToCloudinary } from "@/services/image-service";

const STATUS_OPTIONS = ["Active", "Busy", "Away", "Writing", "Reflecting"];

const EditProfile = () => {
    const router = useRouter();
    const navigation = useNavigation(); // Navigation Hook එක ගන්න
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [isInitializing, setIsInitializing] = useState(true);

    const [name, setName] = useState('');
    const [bio, setBio] = useState('');
    const [status, setStatus] = useState(STATUS_OPTIONS[0]);
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [showStatusPicker, setShowStatusPicker] = useState(false);

    const [initialValues, setInitialValues] = useState({
        name: '',
        bio: '',
        status: STATUS_OPTIONS[0],
        imageUri: null as string | null
    });

    const isSavingRef = useRef(false);

    useEffect(() => {
        const loadData = async () => {
            if (user) {
                const initialName = user.displayName || '';
                const initialImage = user.photoURL ? user.photoURL.replace("svg", "png") : null;
                let initialBio = '';
                let initialStatus = STATUS_OPTIONS[0];

                const userData = await getUserProfile(user.uid);
                if (userData) {
                    initialBio = userData.bio || '';
                    initialStatus = userData.status || STATUS_OPTIONS[0];
                }

                setName(initialName);
                setImageUri(initialImage);
                setBio(initialBio);
                setStatus(initialStatus);

                setInitialValues({
                    name: initialName,
                    imageUri: initialImage,
                    bio: initialBio,
                    status: initialStatus
                });
            }
            setIsInitializing(false);
        };
        loadData();
    }, [user]);

    useEffect(() => {
        const hasUnsavedChanges =
            name !== initialValues.name ||
            bio !== initialValues.bio ||
            status !== initialValues.status ||
            imageUri !== initialValues.imageUri;

        const unsubscribe = navigation.addListener('beforeRemove', (e) => {
            if (!hasUnsavedChanges || isSavingRef.current) {
                return;
            }

            e.preventDefault();

            Alert.alert(
                'Discard changes?',
                'You have unsaved changes. Are you sure you want to discard them and leave?',
                [
                    { text: "Don't leave", style: 'cancel', onPress: () => {} },
                    {
                        text: 'Discard',
                        style: 'destructive',
                        onPress: () => navigation.dispatch(e.data.action) // දිගටම යන්න දෙනවා
                    },
                ]
            );
        });

        return unsubscribe;
    }, [navigation, name, bio, status, imageUri, initialValues]);


    const pickImage = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.5,
            });

            if (!result.canceled) {
                setImageUri(result.assets[0].uri);
            }
        } catch (error) {
            Alert.alert("Error", "Could not pick image.");
        }
    };

    const handleSave = async () => {
        if (!user || !name.trim()) {
            Alert.alert("Error", "Name cannot be empty.");
            return;
        }

        setIsLoading(true);
        isSavingRef.current = true;

        try {
            let finalPhotoURL = user.photoURL;

            if (imageUri && imageUri !== user.photoURL?.replace("svg", "png") && !imageUri.startsWith('http')) {
                const uploadedUrl = await uploadImageToCloudinary(imageUri);
                if (uploadedUrl) {
                    finalPhotoURL = uploadedUrl;
                } else {
                    console.warn("Image upload failed, using local uri temporarily (or handle error)");
                }
            }

            await updateUserProfile(user.uid, {
                name: name,
                bio: bio,
                status: status,
                photoURL: finalPhotoURL || "",
            });

            Alert.alert("Success", "Profile updated successfully!", [{
                text: "OK",
                onPress: () => router.back()
            }]);

        } catch (error) {
            console.error(error);
            isSavingRef.current = false;
            Alert.alert("Error", "Failed to update profile. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    if (isInitializing) {
        return (
            <View className="flex-1 justify-center items-center bg-[#F6F7F8]">
                <ActivityIndicator size="large" color="#197FE6" />
            </View>
        );
    }

    return (
        <MotiSafeAreaView className="flex-1 bg-[#F6F7F8]">
            <View className="px-4 py-3 bg-[#F6F7F8]/80 flex-row items-center justify-between border-b border-gray-200/50">
                <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 items-center justify-center bg-gray-50 rounded-full active:bg-gray-200">
                    <ChevronLeft color="#0E141B" size={24} />
                </TouchableOpacity>
                <Text className="text-[#0E141B] text-lg font-jakarta-bold">Edit Profile</Text>
                <View className="w-10" />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 24 }}>

                <View className="items-center mb-8">
                    <View className="relative">
                        <View className="w-32 h-32 rounded-full p-1 bg-white shadow-sm border border-gray-100">
                            {imageUri ? (
                                <Image source={{ uri: imageUri }} className="w-full h-full rounded-full" resizeMode="cover" />
                            ) : (
                                <View className="w-full h-full rounded-full bg-primary/10 items-center justify-center">
                                    <Text className="text-4xl font-jakarta-bold text-primary">{name.charAt(0).toUpperCase()}</Text>
                                </View>
                            )}
                        </View>
                        <TouchableOpacity onPress={pickImage} className="absolute bottom-0 right-0 bg-primary p-2.5 rounded-full border-4 border-[#F6F7F8] active:scale-95">
                            <Camera color="white" size={18} />
                        </TouchableOpacity>
                    </View>
                </View>

                <View className="gap-6">
                    <View className="gap-2">
                        <Text className="text-sm font-jakarta-bold text-gray-500 uppercase tracking-wider ml-1">Full Name</Text>
                        <TextInput
                            value={name}
                            onChangeText={setName}
                            placeholder="Enter your full name"
                            className="bg-white p-4 rounded-2xl border border-gray-100 font-jakarta text-[#0E141B] text-base"
                        />
                    </View>

                    <View className="gap-2 z-10">
                        <Text className="text-sm font-jakarta-bold text-gray-500 uppercase tracking-wider ml-1">Current Status</Text>
                        <TouchableOpacity
                            onPress={() => setShowStatusPicker(!showStatusPicker)}
                            className="bg-white p-4 rounded-2xl border border-gray-100 flex-row justify-between items-center active:bg-gray-50"
                        >
                            <Text className="font-jakarta text-[#0E141B] text-base">{status}</Text>
                            <ChevronDown color="#9CA3AF" size={20} />
                        </TouchableOpacity>

                        {showStatusPicker && (
                            <View className="absolute top-[85px] w-full bg-white rounded-2xl border border-gray-100 shadow-lg z-20 overflow-hidden">
                                {STATUS_OPTIONS.map((option, index) => (
                                    <TouchableOpacity
                                        key={option}
                                        onPress={() => {
                                            setStatus(option);
                                            setShowStatusPicker(false);
                                        }}
                                        className={`p-4 flex-row justify-between items-center active:bg-gray-50 ${index !== STATUS_OPTIONS.length - 1 ? 'border-b border-gray-100' : ''}`}
                                    >
                                        <Text className={`font-jakarta text-base ${status === option ? 'text-primary font-jakarta-bold' : 'text-[#0E141B]'}`}>
                                            {option}
                                        </Text>
                                        {status === option && <Check color="#197FE6" size={18} />}
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    </View>

                    <View className="gap-2">
                        <Text className="text-sm font-jakarta-bold text-gray-500 uppercase tracking-wider ml-1">About</Text>
                        <TextInput
                            value={bio}
                            onChangeText={setBio}
                            placeholder="Write a short bio about yourself..."
                            multiline
                            numberOfLines={4}
                            textAlignVertical="top"
                            className="bg-white p-4 rounded-2xl border border-gray-100 font-jakarta text-[#0E141B] text-base min-h-[120px]"
                        />
                    </View>
                </View>

                <TouchableOpacity
                    onPress={handleSave}
                    disabled={isLoading}
                    className={`w-full bg-primary py-4 rounded-2xl items-center mt-10 ${isLoading ? 'opacity-70' : 'active:scale-95'}`}
                >
                    {isLoading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text className="text-white font-jakarta-bold text-base">Save Changes</Text>
                    )}
                </TouchableOpacity>

            </ScrollView>
        </MotiSafeAreaView>
    );
};

export default EditProfile;