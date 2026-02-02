import { View, Text, ScrollView, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import { MotiSafeAreaView, MotiView } from 'moti';
import { Share2, TrendingUp, CalendarDays } from 'lucide-react-native';
import { useIsFocused, useFocusEffect } from "@react-navigation/core";
import { LineChart } from "react-native-gifted-charts";
import { useAuth } from "@/hooks/use-auth";
import { getMemories } from "@/services/memory-service";

const Insights = () => {
    const isFocused = useIsFocused();
    const { user } = useAuth();
    const screenWidth = Dimensions.get('window').width;

    const [chartKey, setChartKey] = useState(0);
    const [isLoading, setIsLoading] = useState(true);


    const [weeklyData, setWeeklyData] = useState<any[]>([]);
    const [mostLoggedMood, setMostLoggedMood] = useState<{ label: string, icon: string, count: number } | null>(null);
    const [moodStats, setMoodStats] = useState<Record<string, number>>({});
    const [totalEntries, setTotalEntries] = useState(0);
    const [streak, setStreak] = useState(0);


    const MOOD_SCORES: Record<string, number> = {
        'Joy': 100,
        'Calm': 75,
        'Tired': 50,
        'Sad': 25,
        'Angry': 10
    };

    const MOOD_ICONS: Record<string, string> = {
        'Joy': '😊', 'Calm': '😌', 'Sad': '😢', 'Angry': '😠', 'Tired': '😴'
    };

    const MOOD_COLORS: Record<string, { bg: string, dot: string }> = {
        'Joy': { bg: '#fef3c7', dot: '#fcd34d' },
        'Calm': { bg: '#e0f2fe', dot: '#7dd3fc' },
        'Sad': { bg: '#fee2e2', dot: '#fca5a5' },
        'Angry': { bg: '#fee2e2', dot: '#ef4444' },
        'Tired': { bg: '#ffedd5', dot: '#fdba74' }
    };

    useEffect(() => {
        if (isFocused) {
            setChartKey(prev => prev + 1);
        }
    }, [isFocused]);

    useFocusEffect(
        useCallback(() => {
            if (!user) return;

            const fetchData = async () => {
                setIsLoading(true);
                try {
                    const data = await getMemories(user.uid);
                    processInsights(data);
                } catch (error) {
                    console.error("Error fetching insights:", error);
                } finally {
                    setIsLoading(false);
                }
            };

            fetchData();
        }, [user])
    );

    const processInsights = (memories: any[]) => {
        const now = new Date();
        const startOfWeek = new Date(now);
        const day = now.getDay();
        const diff = now.getDate() - day + (day === 0 ? -6 : 1);
        startOfWeek.setDate(diff);
        startOfWeek.setHours(0, 0, 0, 0);

        const days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

        const tempWeekMap = Array(7).fill(0).map(() => ({ totalScore: 0, count: 0 }));

        const moodCounts: Record<string, number> = { 'Joy': 0, 'Calm': 0, 'Sad': 0, 'Angry': 0, 'Tired': 0 };
        const uniqueDates = new Set<string>();

        memories.forEach(memory => {
            const date = memory.createdAt?.toDate ? memory.createdAt.toDate() : new Date(memory.createdAt);
            const dateString = date.toISOString().split('T')[0];
            uniqueDates.add(dateString);

            if (moodCounts[memory.mood] !== undefined) {
                moodCounts[memory.mood]++;
            }

            if (date >= startOfWeek) {
                let dayIndex = date.getDay() - 1;
                if (dayIndex === -1) dayIndex = 6;

                const score = MOOD_SCORES[memory.mood] || 50;
                tempWeekMap[dayIndex].totalScore += score;
                tempWeekMap[dayIndex].count += 1;
            }
        });

        const finalChartData = tempWeekMap.map((data, index) => ({
            value: data.count > 0 ? data.totalScore / data.count : 0,
            label: days[index],
            labelTextStyle: { color: '#9CA3AF', fontSize: 10, fontFamily: 'PlusJakartaSans-Bold' }
        }));

        // 2. Most Logged Mood (වැඩියෙන්ම තිබ්බ මූඩ් එක)
        let maxMood = 'Joy';
        let maxCount = 0;
        for (const [mood, count] of Object.entries(moodCounts)) {
            if (count > maxCount) {
                maxCount = count;
                maxMood = mood;
            }
        }

        calculateStreak(uniqueDates);

        setWeeklyData(finalChartData);
        setMostLoggedMood({ label: maxMood, icon: MOOD_ICONS[maxMood], count: maxCount });
        setMoodStats(moodCounts);
        setTotalEntries(memories.length);
    };

    const calculateStreak = (uniqueDates: Set<string>) => {
        let currentStreak = 0;
        const today = new Date();

        for (let i = 0; i < 365; i++) {
            const d = new Date();
            d.setDate(today.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];

            if (uniqueDates.has(dateStr)) {
                currentStreak++;
            } else if (i === 0 && !uniqueDates.has(dateStr)) {

                continue;
            } else {
                break;
            }
        }
        setStreak(currentStreak);
    };

    const getPercentage = (count: number) => {
        if (totalEntries === 0) return 0;
        return Math.round((count / totalEntries) * 100);
    };

    if (isLoading) {
        return (
            <View className="flex-1 justify-center items-center bg-[#F6F7F8]">
                <ActivityIndicator size="large" color="#197FE6" />
            </View>
        );
    }

    return (
        <MotiSafeAreaView
            from={{ opacity: 0, translateY: 15 }}
            animate={{ opacity: isFocused ? 1 : 0, translateY: isFocused ? 0 : 15 }}
            transition={{ type: 'timing', duration: 300 }}
            className="flex-1 bg-[#F6F7F8]"
        >
            <View className="px-4 py-3 bg-[#F6F7F8]/80 flex-row items-center justify-between border-b border-gray-200/50">
                <View className="w-10" />
                <Text className="text-[#0E141B] text-xl font-jakarta-bold">Mood Insights</Text>
                <TouchableOpacity className="w-10 h-10 items-center justify-center rounded-full active:bg-gray-200">
                    <Share2 color="#0E141B" size={20} />
                </TouchableOpacity>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
                className="flex-1"
            >
                <View className="mt-6 mb-6">
                    <View className="flex-row justify-between items-end mb-4 px-1">
                        <Text className="text-sm font-jakarta-bold text-gray-500 uppercase tracking-wider">Weekly Mood Trend</Text>
                        <Text className="text-xs font-jakarta-medium text-primary">This Week</Text>
                    </View>

                    <View className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 overflow-hidden">
                        <View style={{ marginLeft: -10 }}>
                            {weeklyData.every(d => d.value === 0) ? (
                                <View className="h-[150px] justify-center items-center">
                                    <Text className="text-gray-400 text-xs font-jakarta-medium">Not enough data for this week</Text>
                                </View>
                            ) : (
                                <LineChart
                                    key={chartKey}
                                    data={weeklyData}
                                    areaChart={false}
                                    isAnimated
                                    animationDuration={1200}
                                    curved
                                    thickness={3}
                                    color="#92a8d1"
                                    hideDataPoints={false}
                                    dataPointsColor="#92a8d1"
                                    dataPointsRadius={4}
                                    dataPointsColor2="#fff"
                                    width={screenWidth - 80}
                                    height={150}
                                    spacing={44}
                                    initialSpacing={20}
                                    hideRules={true}
                                    hideYAxisText={true}
                                    hideAxesAndRules={true}
                                    yAxisThickness={0}
                                    xAxisThickness={0}
                                    maxValue={100}
                                    pointerConfig={{
                                        pointerStripHeight: 160,
                                        pointerStripColor: 'lightgray',
                                        pointerStripWidth: 2,
                                        pointerColor: 'lightgray',
                                        radius: 6,
                                        pointerLabelWidth: 100,
                                        pointerLabelHeight: 90,
                                        activatePointersOnLongPress: false,
                                        autoAdjustPointerLabelPosition: false,
                                        pointerComponent: (items: any) => {
                                            return (
                                                <View className="h-2 w-2 bg-primary rounded-full border-2 border-white"/>
                                            );
                                        },
                                        pointerLabelComponent: (items: any) => {
                                            return (
                                                <View className="bg-slate-800 px-3 py-2 rounded-lg -ml-4 -mt-10">
                                                    <Text className="text-white text-xs font-jakarta-bold text-center">
                                                        {items[0].value > 0 ? 'Score: ' + Math.round(items[0].value) : 'No Data'}
                                                    </Text>
                                                </View>
                                            );
                                        },
                                    }}
                                />
                            )}
                        </View>
                    </View>
                </View>

                <View className="flex-row gap-4 mb-8">
                    <View className="flex-1 bg-white rounded-2xl p-5 shadow-sm border border-gray-100 items-center">
                        <Text className="text-[10px] font-jakarta-bold text-gray-400 uppercase tracking-wider mb-3">
                            Most Logged
                        </Text>
                        <View className="w-14 h-14 rounded-full bg-[#E6E6FA] items-center justify-center mb-3">
                            <Text className="text-2xl">{mostLoggedMood?.icon || '😐'}</Text>
                        </View>
                        <Text className="text-sm font-jakarta-bold text-[#0E141B]">{mostLoggedMood?.label || 'N/A'}</Text>
                    </View>

                    <View className="flex-1 bg-white rounded-2xl p-5 shadow-sm border border-gray-100 items-center">
                        <Text className="text-[10px] font-jakarta-bold text-gray-400 uppercase tracking-wider mb-3">
                            Current Streak
                        </Text>
                        <View className="w-14 h-14 items-center justify-center mb-3">
                            <Text className="text-3xl font-jakarta-bold text-primary">{streak}</Text>
                        </View>
                        <Text className="text-sm font-jakarta-bold text-[#0E141B]">Days</Text>
                    </View>
                </View>

                <View className="mb-6">
                    <Text className="text-sm font-jakarta-bold text-gray-500 uppercase tracking-wider mb-4 px-1">
                        Mood Distribution (Total: {totalEntries})
                    </Text>

                    <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 gap-6">
                        {Object.keys(MOOD_SCORES).map((mood) => {
                            const count = moodStats[mood] || 0;
                            return (
                                <MoodBar
                                    key={mood}
                                    label={mood}
                                    color={MOOD_COLORS[mood].bg}
                                    dotColor={MOOD_COLORS[mood].dot}
                                    percentage={getPercentage(count)}
                                    isFocused={isFocused}
                                />
                            );
                        })}
                    </View>
                </View>

            </ScrollView>
        </MotiSafeAreaView>
    );
};

const MoodBar = ({ label, color, dotColor, percentage, isFocused }: { label: string, color: string, dotColor: string, percentage: number, isFocused: boolean }) => {
    return (
        <View className="gap-2">
            <View className="flex-row justify-between items-center">
                <View className="flex-row items-center gap-2">
                    <View className="w-2 h-2 rounded-full" style={{ backgroundColor: dotColor }} />
                    <Text className="text-xs font-jakarta-medium text-[#0E141B]">{label}</Text>
                </View>
                <Text className="text-xs font-jakarta-medium text-gray-400">{percentage}%</Text>
            </View>
            <View className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
                <MotiView
                    from={{ width: '0%' }}
                    animate={{ width: isFocused ? `${percentage}%` : '0%' }}
                    transition={{ type: 'timing', duration: 1000, delay: 300 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: color }}
                />
            </View>
        </View>
    );
};

export default Insights;