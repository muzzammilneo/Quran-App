import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { StatusBar } from 'expo-status-bar';
import { useFonts, Outfit_400Regular, Outfit_600SemiBold, Outfit_700Bold } from '@expo-google-fonts/outfit';
import { Lora_400Regular } from '@expo-google-fonts/lora';
import { Amiri_400Regular, Amiri_700Bold } from '@expo-google-fonts/amiri';
import { NotoNaskhArabic_400Regular, NotoNaskhArabic_700Bold } from '@expo-google-fonts/noto-naskh-arabic';
import * as SplashScreen from 'expo-splash-screen';

import ChapterScreen from './src/screens/ChapterScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import DrawerContent from './src/components/DrawerContent';
import HeaderTitle from './src/components/HeaderTitle';
import HeaderVerseCount from './src/components/HeaderVerseCount';
import { getLastRead, getLanguage } from './src/utils/storage';
import { getChapterIndex } from './src/utils/languageMappings';
import { COLORS } from './src/constants/theme';
import { ThemeProvider, useTheme } from './src/utils/ThemeContext';

const Drawer = createDrawerNavigator();
SplashScreen.preventAutoHideAsync();

function AppContent() {
    const { theme, colors } = useTheme();
    const [initialRouteParams, setInitialRouteParams] = useState(null);

    let [fontsLoaded] = useFonts({
        Outfit_400Regular,
        Outfit_600SemiBold,
        Outfit_700Bold,
        Lora_400Regular,
        Amiri_400Regular,
        Amiri_700Bold,
        NotoNaskhArabic_400Regular,
        NotoNaskhArabic_700Bold,
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
                    const chapterId = Number(lastReadData.chapterId);
                    const verseId = Number(lastReadData.verseId);
                    const chapter = chapters.find(c => Number(c.id) === chapterId);
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

    const navigationTheme = {
        ...(theme === 'dark' ? DarkTheme : DefaultTheme),
        colors: {
            ...(theme === 'dark' ? DarkTheme.colors : DefaultTheme.colors),
            background: colors.background,
            card: colors.surface,
            text: colors.textPrimary,
            border: colors.border,
            primary: colors.accent,
        },
    };

    return (
        <NavigationContainer theme={navigationTheme}>
            <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
            <Drawer.Navigator
                drawerContent={(props) => <DrawerContent {...props} />}
                screenOptions={{
                    headerStyle: {
                        backgroundColor: colors.surface,
                        elevation: 0,
                        shadowOpacity: 0,
                        borderBottomWidth: 1,
                        borderBottomColor: colors.border,
                    },
                    headerTintColor: colors.accent,
                    headerTitleStyle: {
                        fontFamily: 'Outfit_700Bold',
                    },
                    drawerStyle: {
                        width: '80%',
                        backgroundColor: colors.surface,
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
                        headerRight: () => (
                            <HeaderVerseCount
                                currentVerseId={route.params?.currentVerseId}
                                totalVerses={route.params?.totalVerses}
                                language={route.params?.language}
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
                        headerShown: false
                    }}
                />
            </Drawer.Navigator>
        </NavigationContainer>
    );
}

export default function App() {
    return (
        <SafeAreaProvider>
            <ThemeProvider>
                <AppContent />
            </ThemeProvider>
        </SafeAreaProvider>
    );
}
