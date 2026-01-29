import React from 'react';
import { Tabs } from "expo-router";
import { House, Calendar, ChartLine, User } from "lucide-react-native";

const Layout = () => {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: true,
                tabBarActiveTintColor: "#197FE6",
                tabBarInactiveTintColor: "#9CA3AF",
                tabBarStyle: {
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    borderTopColor: '#E5E7EB',
                    borderTopWidth: 1,
                    height: 85,
                    paddingTop: 10,
                    elevation: 0,
                },
                tabBarLabelStyle: {
                    fontFamily: 'Jakarta-Bold',
                    fontSize: 10,
                    marginBottom: 5,
                }
            }}
        >
            <Tabs.Screen
                name="home"
                options={{
                    title: "Home",
                    tabBarIcon: ({ color }) => <House color={color} size={24} />,
                }}
            />
            <Tabs.Screen
                name="calendar"
                options={{
                    title: "Calendar",
                    tabBarIcon: ({ color }) => <Calendar color={color} size={24} />,
                }}
            />
            <Tabs.Screen
                name="insights"
                options={{
                    title: "Insights",
                    tabBarIcon: ({ color }) => <ChartLine color={color} size={24} />,
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profile",
                    tabBarIcon: ({ color }) => <User color={color} size={24} />,
                }}
            />
        </Tabs>
    )
}

export default Layout;