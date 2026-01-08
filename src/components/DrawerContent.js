import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useDrawerStatus } from '@react-navigation/drawer';
import { SPACING } from '../constants/theme';
import { getChapterIndex, getLocalizedString } from '../utils/languageMappings';
import { getLanguage, getQuranStyle } from '../utils/storage';
import { useTheme } from '../utils/ThemeContext';

const DrawerContent = (props) => {
    const { navigation, state } = props;
    const { colors } = useTheme();
    const insets = useSafeAreaInsets();
    const [chapters, setChapters] = useState([]);
    const [language, setLanguage] = useState('en');
    const [quranStyle, setQuranStyle] = useState('Uthmani');

    const drawerStatus = useDrawerStatus();
    const activeChapterId = state.routes[state.index]?.params?.chapterId;

    useEffect(() => {
        if (drawerStatus === 'open') {
            loadChapters();
        }
    }, [drawerStatus]);

    const loadChapters = async () => {
        const [lang, style] = await Promise.all([
            getLanguage(),
            getQuranStyle()
        ]);
        const index = getChapterIndex(lang);
        setChapters(index);
        setLanguage(lang);
        setQuranStyle(style);
    };

    const renderItem = ({ item }) => {
        const isActive = item.id === activeChapterId;
        const arabicFont = quranStyle === 'Uthmani' ? 'Amiri_400Regular' : 'NotoNaskhArabic_400Regular';

        return (
            <TouchableOpacity
                style={[styles.item, { borderBottomColor: colors.background }, isActive && { backgroundColor: colors.activeItemBackground }]}
                onPress={() => {
                    navigation.navigate('Chapter', {
                        chapterId: item.id,
                        chapterName: item.name,
                        chapterTransliteration: item.transliteration,
                        chapterTranslation: item.translation,
                        language: language,
                        initialVerseId: 1,
                    });
                }}
            >
                <View style={[styles.numberContainer, { backgroundColor: colors.background }, isActive && { backgroundColor: colors.accent }]}>
                    <Text style={[styles.number, { color: colors.textSecondary }, isActive && { color: colors.surface }]}>{item.id}</Text>
                </View>
                <View style={styles.textContainer}>
                    <Text style={[styles.transliteration, { color: colors.textPrimary }, isActive && { color: colors.accent }]}>{item.transliteration}</Text>
                    <Text style={[styles.translation, { color: colors.textSecondary }]}>{item.translation} • {item.total_verses} {getLocalizedString(language, 'verses')}</Text>
                </View>
                <Text style={[styles.arabicName, { color: colors.textPrimary }, isActive && { color: colors.accent }, { fontFamily: arabicFont }]}>{item.name}</Text>
            </TouchableOpacity>
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.surface, paddingTop: insets.top + 4 }]}>
            <View style={[styles.header, { borderBottomColor: colors.border }]}>
                <Text style={[styles.title, { color: colors.textPrimary }]}>{getLocalizedString(language, 'quranChapters')}</Text>
                <TouchableOpacity
                    onPress={() => navigation.navigate('Settings')}
                    style={styles.settingsButton}
                >
                    <Ionicons name="settings-outline" size={22} color={colors.accent} />
                </TouchableOpacity>
            </View>
            <FlatList
                data={chapters}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.sm,
        borderBottomWidth: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    settingsButton: {
        padding: 4,
    },
    listContent: {
        paddingVertical: SPACING.sm,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.md,
        borderBottomWidth: 1,
    },
    numberContainer: {
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SPACING.md,
    },
    number: {
        fontSize: 12,
        fontWeight: 'bold',
        fontFamily: 'Outfit_700Bold',
    },
    textContainer: {
        flex: 1,
    },
    transliteration: {
        fontSize: 16,
        fontWeight: '600',
        fontFamily: 'Outfit_600SemiBold',
    },
    translation: {
        fontSize: 12,
        fontFamily: 'Outfit_400Regular',
    },
    arabicName: {
        fontSize: 18,
    },
});

export default DrawerContent;
