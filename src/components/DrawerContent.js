import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useDrawerStatus } from '@react-navigation/drawer';
import { COLORS, SPACING } from '../constants/theme';
import { getChapterIndex, getLocalizedString } from '../utils/languageMappings';
import { getLanguage } from '../utils/storage';

const DrawerContent = (props) => {
    const { navigation, state } = props;
    const insets = useSafeAreaInsets();
    const [chapters, setChapters] = useState([]);
    const [language, setLanguage] = useState('en');

    const drawerStatus = useDrawerStatus();
    const activeChapterId = state.routes[state.index]?.params?.chapterId;

    useEffect(() => {
        if (drawerStatus === 'open') {
            loadChapters();
        }
    }, [drawerStatus]);

    const loadChapters = async () => {
        const lang = await getLanguage();
        const index = getChapterIndex(lang);
        setChapters(index);
        setLanguage(lang);
    };

    const renderItem = ({ item }) => {
        const isActive = item.id === activeChapterId;

        return (
            <TouchableOpacity
                style={[styles.item, isActive && styles.activeItem]}
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
                <View style={[styles.numberContainer, isActive && styles.activeNumberContainer]}>
                    <Text style={[styles.number, isActive && styles.activeNumber]}>{item.id}</Text>
                </View>
                <View style={styles.textContainer}>
                    <Text style={[styles.transliteration, isActive && styles.activeText]}>{item.transliteration}</Text>
                    <Text style={styles.translation}>{item.translation} • {item.total_verses} {getLocalizedString(language, 'verses')}</Text>
                </View>
                <Text style={[styles.arabicName, isActive && styles.activeText]}>{item.name}</Text>
            </TouchableOpacity>
        );
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top + 4 }]}>
            <View style={styles.header}>
                <Text style={styles.title}>{getLocalizedString(language, 'quranChapters')}</Text>
                <TouchableOpacity
                    onPress={() => navigation.navigate('Settings')}
                    style={styles.settingsButton}
                >
                    <Ionicons name="settings-outline" size={22} color={COLORS.accent} />
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
        backgroundColor: COLORS.surface,
    },
    header: {
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.sm,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
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
        borderBottomColor: COLORS.background,
    },
    activeItem: {
        backgroundColor: COLORS.activeItemBackground,
    },
    numberContainer: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: COLORS.background,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SPACING.md,
    },
    activeNumberContainer: {
        backgroundColor: COLORS.accent,
    },
    number: {
        fontSize: 12,
        color: COLORS.textSecondary,
        fontWeight: 'bold',
        fontFamily: 'Outfit_700Bold',
    },
    activeNumber: {
        color: COLORS.surface,
    },
    textContainer: {
        flex: 1,
    },
    transliteration: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.textPrimary,
        fontFamily: 'Outfit_600SemiBold',
    },
    activeText: {
        color: COLORS.accent,
    },
    translation: {
        fontSize: 12,
        color: COLORS.textSecondary,
        fontFamily: 'Outfit_400Regular',
    },
    arabicName: {
        fontSize: 18,
        color: COLORS.textPrimary,
        fontFamily: 'Amiri_400Regular',
    },
});

export default DrawerContent;
