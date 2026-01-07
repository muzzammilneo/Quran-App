import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { StatusBar } from 'expo-status-bar';
import { useFonts, Outfit_400Regular, Outfit_600SemiBold, Outfit_700Bold } from '@expo-google-fonts/outfit';
import { Lora_400Regular } from '@expo-google-fonts/lora';
import { Amiri_400Regular, Amiri_700Bold } from '@expo-google-fonts/amiri';
import * as SplashScreen from 'expo-splash-screen';

import ChapterScreen from './src/screens/ChapterScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import DrawerContent from './src/components/DrawerContent';
import HeaderTitle from './src/components/HeaderTitle';
import { getLastRead, getLanguage } from './src/utils/storage';
import { getChapterIndex } from './src/utils/languageMappings';
import { COLORS } from './src/constants/theme';

const Drawer = createDrawerNavigator();
SplashScreen.preventAutoHideAsync();

export default function App() {
    const [lastRead, setLastRead] = useState(null);
    const [initialRouteParams, setInitialRouteParams] = useState(null);

    let [fontsLoaded] = useFonts({
        Outfit_400Regular,
        Outfit_600SemiBold,
        Outfit_700Bold,
        Lora_400Regular,
        Amiri_400Regular,
        Amiri_700Bold,
    });

    useEffect(() => {
        async function prepare() {
            try {
                const [lastReadData, lang] = await Promise.all([
                    getLastRead(),
                    getLanguage()
                ]);
                const chapters = getChapterIndex(lang);
                if (lastReadData) {
                    const { chapterId, verseId } = lastReadData;
                    const chapter = chapters.find(c => Number(c.id) === Number(chapterId));
                    if (chapter) {
                        setInitialRouteParams({
                            chapterId: chapter.id,
                            chapterName: chapter.name,
                            chapterTransliteration: chapter.transliteration,
                            chapterTranslation: chapter.translation,
                            language: lang,
                            initialVerseId: verseId,
                        });
                    }
                } else {
                    // Default to Al-Fatihah
                    const chapter = chapters.find(c => Number(c.id) === 1) || chapters[0];
                    setInitialRouteParams({
                        chapterId: chapter.id,
                        chapterName: chapter.name,
                        chapterTransliteration: chapter.transliteration,
                        chapterTranslation: chapter.translation,
                        language: lang,
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
                        headerTintColor: COLORS.accent,
                        headerTitleStyle: {
                            fontFamily: 'Outfit_700Bold',
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
                        options={({ route }) => ({
                            headerTitle: () => (
                                <HeaderTitle
                                    chapterId={route.params?.chapterId}
                                    chapterName={route.params?.chapterName}
                                    chapterTransliteration={route.params?.chapterTransliteration}
                                    chapterTranslation={route.params?.chapterTranslation}
                                />
                            ),
                            headerTitleAlign: 'left',
                        })}
                    />
                    <Drawer.Screen
                        name="Settings"
                        component={SettingsScreen}
                        options={{
                            title: 'Settings',
                            headerShown: false // We use a custom header in SettingsScreen
                        }}
                    />
                </Drawer.Navigator>
            </NavigationContainer>
        </SafeAreaProvider>
    );
}
