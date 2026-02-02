import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { useIsFocused } from '@react-navigation/native';
import { Edit2, Trash2 } from 'lucide-react-native';
import MemoryCard from './memory-card';

interface SwipeableMemoryCardProps {
    item: any;
    index: number;
    onEdit: () => void;
    onDelete: () => void;
}

const SwipeableMemoryCard = ({ item, index, onEdit, onDelete }: SwipeableMemoryCardProps) => {

    const swipeableRef = useRef<Swipeable>(null);

    const isFocused = useIsFocused();

    useEffect(() => {
        if (!isFocused) {
            swipeableRef.current?.close();
        }
    }, [isFocused]);

    const renderRightActions = (progress: Animated.AnimatedInterpolation<number>, dragX: Animated.AnimatedInterpolation<number>) => {
        const scale = progress.interpolate({
            inputRange: [0, 1],
            outputRange: [0.8, 1],
            extrapolate: 'clamp',
        });

        const opacity = progress.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
            extrapolate: 'clamp',
        });

        return (
            <View className="flex-row pl-3 h-full pb-4 items-center">
                <Animated.View style={{ transform: [{ scale }], opacity }}>
                    <TouchableOpacity
                        onPress={() => {
                            swipeableRef.current?.close();
                            onEdit();
                        }}
                        className="w-16 h-full bg-[#E0E7FF] rounded-xl justify-center items-center mr-2 active:scale-95"
                    >
                        <Edit2 color="#6366F1" size={20} />
                        <Text className="text-[10px] font-bold text-[#6366F1] mt-1">Update</Text>
                    </TouchableOpacity>
                </Animated.View>

                <Animated.View style={{ transform: [{ scale }], opacity }}>
                    <TouchableOpacity
                        onPress={() => {
                            swipeableRef.current?.close();
                            onDelete();
                        }}
                        className="w-16 h-full bg-[#FEE2E2] rounded-xl justify-center items-center active:scale-95"
                    >
                        <Trash2 color="#EF4444" size={20} />
                        <Text className="text-[10px] font-bold text-[#EF4444] mt-1">Delete</Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        );
    };

    return (
        <Swipeable
            ref={swipeableRef}
            renderRightActions={renderRightActions}
            friction={2}
            rightThreshold={40}
        >
            <MemoryCard
                key={item.id}
                index={index}
                type={item.type as 'text' | 'audio'}
                imageUrl={item.imageUrl}
                mood={item.mood}
                date={item.date}
                title={item.title}
                content={item.content}
                tags={item.tags}
            />
        </Swipeable>
    );
};

export default SwipeableMemoryCard;