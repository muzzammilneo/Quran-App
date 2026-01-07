import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { StatusBar } from 'expo-status-bar';
import { useFonts, Inter_400Regular, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { Amiri_400Regular, Amiri_700Bold } from '@expo-google-fonts/amiri';
import * as SplashScreen from 'expo-splash-screen';

import ChapterScreen from './src/screens/ChapterScreen';
import DrawerContent from './src/components/DrawerContent';
import { getLastRead } from './src/utils/storage';
import { COLORS } from './src/constants/theme';

const Drawer = createDrawerNavigator();
SplashScreen.preventAutoHideAsync();

export default function App() {
    const [lastRead, setLastRead] = useState(null);
    const [initialRouteParams, setInitialRouteParams] = useState(null);

    let [fontsLoaded] = useFonts({
        Inter_400Regular,
        Inter_600SemiBold,
        Amiri_400Regular,
        Amiri_700Bold,
    });

    useEffect(() => {
        async function prepare() {
            try {
                const lastReadData = await getLastRead();
                if (lastReadData) {
                    const { chapterId, verseId } = lastReadData;
                    const chapters = require('./assets/data/chapters/en/index.json');
                    const chapter = chapters.find(c => Number(c.id) === Number(chapterId));
                    if (chapter) {
                        setInitialRouteParams({
                            chapterId: chapter.id,
                            chapterName: chapter.name,
                            chapterTransliteration: chapter.transliteration,
                            chapterTranslation: chapter.translation,
                            initialVerseId: verseId,
                        });
                    }
                } else {
                    // Default to Al-Fatihah
                    setInitialRouteParams({
                        chapterId: 1,
                        chapterName: 'الفاتحة',
                        chapterTransliteration: 'Al-Fatihah',
                        chapterTranslation: 'The Opener',
                        initialVerseId: 1,
                    });
                }
            } catch (e) {
                console.warn(e);
            } finally {
                if (fontsLoaded) {
                    await SplashScreen.hideAsync();
                }
            }
        }

        prepare();
    }, [fontsLoaded]);

    if (!fontsLoaded || !initialRouteParams) {
        return null;
    }

    return (
        <SafeAreaProvider>
            <NavigationContainer>
                <StatusBar style="dark" />
                <Drawer.Navigator
                    drawerContent={(props) => <DrawerContent {...props} />}
                    screenOptions={{
                        headerStyle: {
                            backgroundColor: COLORS.surface,
                            elevation: 0,
                            shadowOpacity: 0,
                            borderBottomWidth: 1,
                            borderBottomColor: COLORS.border,
                        },
                        headerTintColor: COLORS.textPrimary,
                        headerTitleStyle: {
                            fontFamily: 'Inter_600SemiBold',
                        },
                        drawerStyle: {
                            width: '80%',
                        },
                    }}
                >
                    <Drawer.Screen
                        name="Chapter"
                        component={ChapterScreen}
                        initialParams={initialRouteParams}
                        options={{ title: 'Quran Reader' }}
                    />
                </Drawer.Navigator>
            </NavigationContainer>
        </SafeAreaProvider>
    );
}
