import { View, Text, TouchableOpacity, ScrollView, Modal } from 'react-native';
import React, { useState, useMemo } from 'react';
import { MotiSafeAreaView } from 'moti';
import { ChevronLeft, ChevronRight, MoreHorizontal, Plus, CheckCircle2, X } from 'lucide-react-native';
import SwipeableMemoryCard from '@/components/swipeable-memory-card';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useIsFocused } from "@react-navigation/core";
import { Calendar as RNCalendar } from 'react-native-calendars';

const MEMORIES_BY_DATE: Record<string, any[]> = {
    '2026-01-24': [
        { id: '1', type: 'image', title: 'A quiet walk', description: 'Orange trees...', date: '5:30 PM', emoji: '😊', imageUri: 'https://images.unsplash.com/photo-1507706352938-349f7e8a93cb' },
        { id: '2', type: 'audio', title: 'Evening Gratitude', description: 'Grateful for small wins...', date: '9:00 PM', emoji: '💡' }
    ],
    '2026-01-29': [
        { id: '1', type: 'image', title: 'A quiet walk', description: 'Orange trees...', date: '5:30 PM', emoji: '😊', imageUri: 'https://images.unsplash.com/photo-1507706352938-349f7e8a93cb' },
        { id: '2', type: 'audio', title: 'Evening Gratitude', description: 'Grateful for small wins...', date: '9:00 PM', emoji: '💡' },
        { id: '3', type: 'audio', title: 'Evening Gratitude', description: 'Grateful for small wins...', date: '9:00 PM', emoji: '💡' }
    ],
    '2026-01-10': [
        { id: '3', type: 'audio', title: 'Mid-month checkin', description: 'Productive day!', date: '10:00 AM', emoji: '🚀' }
    ]
};

const Calendar = () => {

    const todayDate = new Date().toISOString().split('T')[0];
    const todayMonth = todayDate.substring(0, 8) + '01';

    const [selectedDate, setSelectedDate] = useState<string>(todayDate);
    const [currentMonth, setCurrentMonth] = useState<string>(todayMonth);
    const [pickerVisible, setPickerVisible] = useState<boolean>(false);

    const currentYear = parseInt(currentMonth.split('-')[0]);
    const currentMonthNum = parseInt(currentMonth.split('-')[1]) - 1;

    const [pickerYear, setPickerYear] = useState(currentYear);
    const [pickerMonth, setPickerMonth] = useState(currentMonthNum);

    const isFocused = useIsFocused();
    const currentMemories = MEMORIES_BY_DATE[selectedDate] || [];


    const headerDate = new Date(currentMonth).toLocaleString('default', { month: 'long', year: 'numeric' });

    const changeMonth = (increment: number) => {
        const date = new Date(currentMonth);
        date.setMonth(date.getMonth() + increment);
        const newDateString = date.toISOString().split('T')[0];
        setCurrentMonth(newDateString);
    };

    const handleOpenPicker = () => {
        setPickerYear(currentYear);
        setPickerMonth(currentMonthNum);
        setPickerVisible(true);
    };

    const handleApplyPicker = () => {
        // Direct string formatting - timezone issues නැති
        const month = String(pickerMonth + 1).padStart(2, '0'); // 0-11 → 1-12
        const newDateString = `${pickerYear}-${month}-01`;

        setCurrentMonth(newDateString);
        setPickerVisible(false);
    };

    // Picker එකේ year වෙනස් කරන්න
    const changePickerYear = (increment: number) => {
        setPickerYear(prev => prev + increment);
    };

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const markedDates = useMemo(() => {
        let marks: any = {};
        Object.keys(MEMORIES_BY_DATE).forEach(date => {
            if (MEMORIES_BY_DATE[date].length > 0) {
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
    }, [selectedDate]);

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
                        <TouchableOpacity
                            onPress={() => changeMonth(-1)}
                            className="w-8 h-8 items-center justify-center rounded-full active:bg-gray-200"
                        >
                            <ChevronLeft color="#0E141B" size={24} />
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => changeMonth(1)}
                            className="w-8 h-8 items-center justify-center rounded-full active:bg-gray-200"
                        >
                            <ChevronRight color="#0E141B" size={24} />
                        </TouchableOpacity>
                    </View>

                    <Text className="text-[#0E141B] text-lg font-jakarta-bold">{headerDate}</Text>

                    <TouchableOpacity
                        onPress={handleOpenPicker}
                        className="w-10 h-10 items-center justify-center rounded-full active:bg-gray-200"
                    >
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
                            onDayPress={day => {
                                setSelectedDate(day.dateString);
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
                                textDayFontFamily: 'Plus Jakarta Sans',
                                textMonthFontFamily: 'Plus Jakarta Sans',
                                textDayHeaderFontFamily: 'Plus Jakarta Sans',
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
                                        onPress={() => setSelectedDate(date.dateString)}
                                        className={`w-[45px] h-10 items-center justify-center rounded-lg mb-1
                                            ${isSelected ? 'bg-primary/10 border border-primary/20' : ''}
                                        `}
                                    >
                                        <Text className={`text-sm font-jakarta-medium 
                                            ${isSelected ? 'text-primary font-bold' : 'text-[#0E141B]'}
                                            ${isToday && !isSelected ? 'text-primary font-bold' : ''}
                                            ${state === 'disabled' ? 'text-gray-300' : ''}
                                        `}>
                                            {date.day}
                                        </Text>
                                        {marking?.marked && (
                                            <View
                                                style={{ backgroundColor: marking.dotColor || '#197FE6' }}
                                                className="w-1 h-1 rounded-full mt-1"
                                            />
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
                        {currentMemories.length > 0 ? (
                            currentMemories.map((memory: any, index: number) => (
                                <SwipeableMemoryCard
                                    key={memory.id}
                                    index={index}
                                    item={memory}
                                    onEdit={() => console.log('Edit')}
                                    onDelete={() => console.log('Delete')}
                                />
                            ))
                        ) : (
                            <View className="items-center py-10 opacity-50">
                                <Text className="text-gray-400 text-sm font-jakarta">No memories for this day</Text>
                            </View>
                        )}
                    </View>

                    <View className="items-center py-6 opacity-50">
                        <CheckCircle2 color="#9CA3AF" size={24} />
                        <Text className="text-gray-400 text-xs font-jakarta-medium mt-2">You&#39;re all caught up!</Text>
                    </View>
                </ScrollView>

                <TouchableOpacity className="absolute bottom-12 right-6 w-14 h-14 bg-primary rounded-full items-center justify-center shadow-lg shadow-primary/40 active:scale-95">
                    <Plus color="white" size={32} />
                </TouchableOpacity>

                <Modal
                    visible={pickerVisible}
                    transparent={true}
                    animationType="fade"
                    onRequestClose={() => setPickerVisible(false)}
                >
                    <View className="flex-1 bg-black/50 justify-center items-center px-6">
                        <View className="bg-white rounded-2xl w-full max-w-sm overflow-hidden">
                            {/* Modal Header */}
                            <View className="px-5 py-4 bg-[#F6F7F8] flex-row items-center justify-between border-b border-gray-200">
                                <Text className="text-[#0E141B] text-lg font-jakarta-bold">Select Date</Text>
                                <TouchableOpacity
                                    onPress={() => setPickerVisible(false)}
                                    className="w-8 h-8 items-center justify-center rounded-full active:bg-gray-200"
                                >
                                    <X color="#0E141B" size={20} />
                                </TouchableOpacity>
                            </View>

                            <View className="px-5 py-6">
                                <Text className="text-gray-500 text-xs font-jakarta-medium mb-3">YEAR</Text>
                                <View className="flex-row items-center justify-between">
                                    <TouchableOpacity
                                        onPress={() => changePickerYear(-1)}
                                        className="w-10 h-10 items-center justify-center rounded-full bg-gray-100 active:bg-gray-200"
                                    >
                                        <ChevronLeft color="#0E141B" size={24} />
                                    </TouchableOpacity>

                                    <Text className="text-[#0E141B] text-2xl font-jakarta-bold">{pickerYear}</Text>

                                    <TouchableOpacity
                                        onPress={() => changePickerYear(1)}
                                        className="w-10 h-10 items-center justify-center rounded-full bg-gray-100 active:bg-gray-200"
                                    >
                                        <ChevronRight color="#0E141B" size={24} />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View className="px-5 pb-6">
                                <Text className="text-gray-500 text-xs font-jakarta-medium mb-3">MONTH</Text>
                                <View className="flex-row flex-wrap gap-2">
                                    {months.map((month, index) => (
                                        <TouchableOpacity
                                            key={month}
                                            onPress={() => setPickerMonth(index)}
                                            className={`px-4 py-2 rounded-lg ${
                                                pickerMonth === index
                                                    ? 'bg-primary'
                                                    : 'bg-gray-100'
                                            }`}
                                        >
                                            <Text
                                                className={`text-sm font-jakarta-medium ${
                                                    pickerMonth === index
                                                        ? 'text-white'
                                                        : 'text-[#0E141B]'
                                                }`}
                                            >
                                                {month.substring(0, 3)}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>

                            <View className="px-5 pb-5">
                                <TouchableOpacity
                                    onPress={handleApplyPicker}
                                    className="bg-primary py-3 rounded-xl items-center active:opacity-80"
                                >
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
