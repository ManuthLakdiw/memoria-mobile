import {View, Text, TouchableOpacity, ScrollView, Modal, ActivityIndicator, Alert} from 'react-native';
import React, { useState, useMemo, useCallback } from 'react';
import { MotiSafeAreaView } from 'moti';
import { ChevronLeft, ChevronRight, MoreHorizontal, Plus, CheckCircle2, X, Coffee } from 'lucide-react-native';
import SwipeableMemoryCard from '@/components/swipeable-memory-card';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useIsFocused, useFocusEffect } from "@react-navigation/core";
import { Calendar as RNCalendar } from 'react-native-calendars';
import { useRouter } from "expo-router";
import { useAuth } from "@/hooks/use-auth";
import { getMemories, deleteMemory } from "@/services/memory-service";

const Calendar = () => {
    const router = useRouter();
    const { user } = useAuth();
    const isFocused = useIsFocused();

    const todayDate = new Date().toISOString().split('T')[0];
    const [currentMonth, setCurrentMonth] = useState<string>(todayDate);
    const [selectedDate, setSelectedDate] = useState<string>(todayDate);

    const [pickerVisible, setPickerVisible] = useState<boolean>(false);
    const [memoriesByDate, setMemoriesByDate] = useState<Record<string, any[]>>({});
    const [isLoading, setIsLoading] = useState(true);

    const dateObject = new Date(currentMonth);
    const currentYear = dateObject.getFullYear();
    const currentMonthNum = dateObject.getMonth();

    const [pickerYear, setPickerYear] = useState(currentYear);
    const [pickerMonth, setPickerMonth] = useState(currentMonthNum);

    const headerDate = new Date(currentMonth).toLocaleString('default', { month: 'long', year: 'numeric' });

    useFocusEffect(
        useCallback(() => {
            if (!user) return;

            const fetchData = async () => {
                setIsLoading(true);
                try {
                    const data = await getMemories(user.uid);
                    const grouped: Record<string, any[]> = {};

                    data.forEach((memory) => {
                        let dateKey = memory.dateString;
                        if (memory.createdAt) {
                            const dateObj = memory.createdAt.toDate ? memory.createdAt.toDate() : new Date(memory.createdAt);
                            const year = dateObj.getFullYear();
                            const month = String(dateObj.getMonth() + 1).padStart(2, '0');
                            const day = String(dateObj.getDate()).padStart(2, '0');
                            dateKey = `${year}-${month}-${day}`;
                        }
                        if (!grouped[dateKey]) {
                            grouped[dateKey] = [];
                        }
                        grouped[dateKey].push(memory);
                    });

                    setMemoriesByDate(grouped);
                } catch (error) {
                    console.error("Error fetching memories:", error);
                } finally {
                    setIsLoading(false);
                }
            };

            fetchData();
        }, [user])
    );

    const currentMemories = useMemo(() => {
        return memoriesByDate[selectedDate] || [];
    }, [selectedDate, memoriesByDate]);

    const changeMonth = (increment: number) => {
        const date = new Date(currentMonth);
        date.setMonth(date.getMonth() + increment);
        const newDateString = date.toISOString().split('T')[0];
        setCurrentMonth(newDateString);
    };

    const handleOpenPicker = () => {
        const d = new Date(currentMonth);
        setPickerYear(d.getFullYear());
        setPickerMonth(d.getMonth());
        setPickerVisible(true);
    };

    const handleApplyPicker = () => {
        const month = String(pickerMonth + 1).padStart(2, '0');
        const newDateString = `${pickerYear}-${month}-01`;
        setCurrentMonth(newDateString);
        setPickerVisible(false);
    };

    const changePickerYear = (increment: number) => {
        setPickerYear(prev => prev + increment);
    };

    const handleDeleteMemory = (memoryId: string) => {
        if (!user) return;

        Alert.alert(
            "Delete Memory",
            "Are you sure you want to delete this memory? This cannot be undone.",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await deleteMemory(user.uid, memoryId);
                            const updatedMemories = { ...memoriesByDate };
                            if (updatedMemories[selectedDate]) {
                                updatedMemories[selectedDate] = updatedMemories[selectedDate].filter(m => m.id !== memoryId);
                                setMemoriesByDate(updatedMemories);
                            }
                        } catch (error) {
                            console.error("Failed to delete memory", error);
                            Alert.alert("Error", "Could not delete memory.");
                        }
                    }
                }
            ]
        );
    };

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const markedDates = useMemo(() => {
        let marks: any = {};
        Object.keys(memoriesByDate).forEach(date => {
            if (memoriesByDate[date].length > 0) {
                marks[date] = { marked: true, dotColor: '#197FE6' };
            }
        });
        marks[selectedDate] = {
            ...marks[selectedDate],
            selected: true,
            selectedColor: 'rgba(25, 127, 230, 0.1)',
            selectedTextColor: '#197FE6',
        };
        return marks;
    }, [selectedDate, memoriesByDate]);

    const formatDate = (timestamp: any) => {
        if (!timestamp) return '';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <MotiSafeAreaView
                from={{ opacity: 0, translateY: 15 }}
                animate={{ opacity: isFocused ? 1 : 0, translateY: isFocused ? 0 : 15 }}
                transition={{ type: 'timing', duration: 300 }}
                className="flex-1 bg-[#F6F7F8]"
            >
                <View className="px-4 py-3 bg-[#F6F7F8]/80 flex-row items-center justify-between border-b border-gray-200/50">
                    <View className="flex-row items-center gap-1">
                        <TouchableOpacity onPress={() => changeMonth(-1)} className="w-8 h-8 items-center justify-center rounded-full active:bg-gray-200">
                            <ChevronLeft color="#0E141B" size={24} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => changeMonth(1)} className="w-8 h-8 items-center justify-center rounded-full active:bg-gray-200">
                            <ChevronRight color="#0E141B" size={24} />
                        </TouchableOpacity>
                    </View>
                    <Text className="text-[#0E141B] text-lg font-jakarta-bold">{headerDate}</Text>
                    <TouchableOpacity onPress={handleOpenPicker} className="w-10 h-10 items-center justify-center rounded-full active:bg-gray-200">
                        <MoreHorizontal color="#0E141B" size={24} />
                    </TouchableOpacity>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                    <View className="bg-white border-b border-gray-100 pb-2">
                        <RNCalendar
                            key={currentMonth}
                            current={currentMonth}
                            onMonthChange={(month) => {
                                setCurrentMonth(month.dateString);
                            }}
                            onDayPress={(day: any) => {
                                setSelectedDate(day.dateString);
                                setCurrentMonth(day.dateString);
                            }}
                            enableSwipeMonths={true}
                            hideArrows={true}
                            renderHeader={() => null}
                            theme={{
                                backgroundColor: '#ffffff',
                                calendarBackground: '#ffffff',
                                textSectionTitleColor: '#9CA3AF',
                                selectedDayBackgroundColor: 'rgba(25, 127, 230, 0.1)',
                                selectedDayTextColor: '#197FE6',
                                todayTextColor: '#197FE6',
                                dayTextColor: '#0E141B',
                                textDisabledColor: '#d9e1e8',
                                textDayFontFamily: 'PlusJakartaSans-Medium',
                                textMonthFontFamily: 'PlusJakartaSans-Medium',
                                textDayHeaderFontFamily: 'PlusJakartaSans-Bold',
                                textDayFontWeight: '500',
                                textDayHeaderFontWeight: 'bold',
                                textDayFontSize: 14,
                                textDayHeaderFontSize: 10,
                                textDayStyle: { marginTop: 4 }
                            }}
                            dayComponent={({ date, state, marking }: any) => {
                                const isSelected = date.dateString === selectedDate;
                                const isToday = state === 'today';
                                return (
                                    <TouchableOpacity
                                        onPress={() => {
                                            setSelectedDate(date.dateString);
                                            setCurrentMonth(date.dateString);
                                        }}
                                        className={`w-[45px] h-10 items-center justify-center rounded-lg mb-1 ${isSelected ? 'bg-primary/10 border border-primary/20' : ''}`}
                                    >
                                        <Text className={`text-sm font-jakarta-medium ${isSelected ? 'text-primary font-bold' : 'text-[#0E141B]'} ${isToday && !isSelected ? 'text-primary font-bold' : ''} ${state === 'disabled' ? 'text-gray-300' : ''}`}>
                                            {date.day}
                                        </Text>
                                        {marking?.marked && (
                                            <View style={{ backgroundColor: marking.dotColor || '#197FE6' }} className="w-1 h-1 rounded-full mt-1" />
                                        )}
                                    </TouchableOpacity>
                                );
                            }}
                            markedDates={markedDates}
                        />
                    </View>

                    <View className="px-5 py-4">
                        <Text className="text-sm font-jakarta-bold text-[#0E141B]">
                            {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                        </Text>
                        <Text className="text-xs text-gray-500 mt-1 font-jakarta">
                            {currentMemories.length} entries recorded
                        </Text>
                    </View>

                    <View className="px-4 gap-4">
                        {isLoading ? (
                            <ActivityIndicator size="small" color="#197FE6" className="py-10" />
                        ) : currentMemories.length > 0 ? (
                            currentMemories.map((memory: any, index: number) => (
                                <TouchableOpacity
                                    key={memory.id}
                                    activeOpacity={0.9}
                                    onPress={() => router.push({
                                        pathname: '/memory/[id]',
                                        params: {
                                            id: memory.id,
                                            title: memory.title,
                                            content: memory.content,
                                            imageUrl: memory.imageUrl,
                                            audioUrl: memory.audioUrl || '',
                                            mood: memory.mood,
                                            date: formatDate(memory.createdAt),
                                            tags: memory.tags.join(','),
                                            type: memory.type
                                        }
                                    })}
                                >
                                    <SwipeableMemoryCard
                                        index={index}
                                        item={memory}
                                        onEdit={() => {
                                            router.push({
                                                pathname: '/memory/update-entry',
                                                params: {
                                                    id: memory.id,
                                                    title: memory.title,
                                                    content: memory.content,
                                                    imageUrl: memory.imageUrl,
                                                    audioUrl: memory.audioUrl || '',
                                                    mood: memory.mood,
                                                    tags: Array.isArray(memory.tags) ? memory.tags.join(',') : memory.tags,
                                                    type: memory.type
                                                }
                                            });
                                        }}
                                        onDelete={() => handleDeleteMemory(memory.id)}
                                    />
                                </TouchableOpacity>
                            ))
                        ) : (
                            <View className="items-center justify-center py-10 opacity-50 gap-4">
                                <View className="w-16 h-16 bg-gray-100 rounded-full items-center justify-center">
                                    <Coffee color="#9CA3AF" size={32} />
                                </View>
                                <Text className="text-gray-400 font-jakarta-medium text-center text-sm">No memories for this day.{'\n'}Enjoy the moment!</Text>
                            </View>
                        )}
                    </View>

                    {currentMemories.length > 0 && (
                        <View className="items-center py-6 opacity-50">
                            <CheckCircle2 color="#9CA3AF" size={24} />
                            <Text className="text-gray-400 text-xs font-jakarta-medium mt-2">You&#39;re all caught up!</Text>
                        </View>
                    )}
                </ScrollView>

                <TouchableOpacity
                    onPress={() => router.push('/memory/create-entry')}
                    className="absolute bottom-12 right-6 w-14 h-14 bg-primary rounded-full items-center justify-center shadow-lg shadow-primary/40 active:scale-95"
                >
                    <Plus color="white" size={32} />
                </TouchableOpacity>

                <Modal visible={pickerVisible} transparent={true} animationType="fade" onRequestClose={() => setPickerVisible(false)}>
                    <View className="flex-1 bg-black/50 justify-center items-center px-6">
                        <View className="bg-white rounded-2xl w-full max-w-sm overflow-hidden">
                            <View className="px-5 py-4 bg-[#F6F7F8] flex-row items-center justify-between border-b border-gray-200">
                                <Text className="text-[#0E141B] text-lg font-jakarta-bold">Select Date</Text>
                                <TouchableOpacity onPress={() => setPickerVisible(false)} className="w-8 h-8 items-center justify-center rounded-full active:bg-gray-200">
                                    <X color="#0E141B" size={20} />
                                </TouchableOpacity>
                            </View>
                            <View className="px-5 py-6">
                                <Text className="text-gray-500 text-xs font-jakarta-medium mb-3">YEAR</Text>
                                <View className="flex-row items-center justify-between">
                                    <TouchableOpacity onPress={() => changePickerYear(-1)} className="w-10 h-10 items-center justify-center rounded-full bg-gray-100 active:bg-gray-200">
                                        <ChevronLeft color="#0E141B" size={24} />
                                    </TouchableOpacity>
                                    <Text className="text-[#0E141B] text-2xl font-jakarta-bold">{pickerYear}</Text>
                                    <TouchableOpacity onPress={() => changePickerYear(1)} className="w-10 h-10 items-center justify-center rounded-full bg-gray-100 active:bg-gray-200">
                                        <ChevronRight color="#0E141B" size={24} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View className="px-5 pb-6">
                                <Text className="text-gray-500 text-xs font-jakarta-medium mb-3">MONTH</Text>
                                <View className="flex-row flex-wrap gap-2">
                                    {months.map((month, index) => (
                                        <TouchableOpacity key={month} onPress={() => setPickerMonth(index)} className={`px-4 py-2 rounded-lg ${pickerMonth === index ? 'bg-primary' : 'bg-gray-100'}`}>
                                            <Text className={`text-sm font-jakarta-medium ${pickerMonth === index ? 'text-white' : 'text-[#0E141B]'}`}>{month.substring(0, 3)}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                            <View className="px-5 pb-5">
                                <TouchableOpacity onPress={handleApplyPicker} className="bg-primary py-3 rounded-xl items-center active:opacity-80">
                                    <Text className="text-white text-base font-jakarta-bold">Apply</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            </MotiSafeAreaView>
        </GestureHandlerRootView>
    );
};

export default Calendar;