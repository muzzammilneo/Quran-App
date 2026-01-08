import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { useSharedValue, useAnimatedStyle, useAnimatedScrollHandler } from 'react-native-reanimated';
import { useFocusEffect } from '@react-navigation/native';
import { SPACING } from '../constants/theme';
import { getFontSize, saveFontSize, saveLastRead, getLanguage, getShowTransliteration, getQuranStyle } from '../utils/storage';
import { getChapterData, getChapterIndex, getLocalizedString } from '../utils/languageMappings';
import { useTheme } from '../utils/ThemeContext';

const ChapterScreen = ({ route, navigation }) => {
    const { colors, theme } = useTheme();
    const insets = useSafeAreaInsets();
    const { chapterId, chapterName, chapterTransliteration, chapterTranslation, initialVerseId } = route.params;
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [fontSize, setFontSize] = useState(18);
    const [showTransliteration, setShowTransliteration] = useState(true);
    const [quranStyle, setQuranStyle] = useState('Uthmani');
    const [language, setLanguage] = useState('en');
    const scrollY = useSharedValue(0);
    const currentVerseIndex = useSharedValue(0);
    const totalVersesCount = useSharedValue(1);
    const flatListRef = React.useRef(null);
    const chapterIdRef = React.useRef(chapterId);
    const initialScrollDone = React.useRef(false);

    useEffect(() => {
        chapterIdRef.current = chapterId;
        initialScrollDone.current = false;
        scrollY.value = 0;
        currentVerseIndex.value = 0;
    }, [chapterId]);

    useEffect(() => {
        loadChapter();
        saveLastRead(chapterId, initialVerseId || 1);
    }, [chapterId]);

    useFocusEffect(
        useCallback(() => {
            loadSettings();
            loadChapter();
        }, [chapterId])
    );

    useEffect(() => {
        if (!data) return;
        const targetVerse = Number(initialVerseId);
        totalVersesCount.value = data.verses.length || 1;
        if (targetVerse > 1) {
            const index = data.verses.findIndex(v => Number(v.id) === targetVerse);
            if (index !== -1) {
                initialScrollDone.current = false;
                setTimeout(() => {
                    if (flatListRef.current) {
                        flatListRef.current.scrollToIndex({
                            index,
                            animated: false,
                            viewPosition: 0
                        });
                        setTimeout(() => {
                            initialScrollDone.current = true;
                        }, 1000);
                    }
                }, 500);
            } else {
                initialScrollDone.current = true;
            }
        } else {
            initialScrollDone.current = true;
        }
    }, [data, initialVerseId]);

    const onViewableItemsChanged = React.useRef(({ viewableItems }) => {
        if (viewableItems.length > 0) {
            const firstItem = viewableItems[0];
            const index = firstItem.index;
            const verseId = Number(firstItem.item.id);
            currentVerseIndex.value = index;
            if (initialScrollDone.current) {
                saveLastRead(Number(chapterIdRef.current), verseId);
            }
        }
    }).current;

    const viewabilityConfig = React.useRef({
        itemVisiblePercentThreshold: 50
    }).current;

    const handleScroll = useAnimatedScrollHandler({
        onScroll: (event) => {
            scrollY.value = event.contentOffset.y;
        },
    });

    const progressBarStyle = useAnimatedStyle(() => {
        const progress = currentVerseIndex.value / (totalVersesCount.value - 1 || 1);
        return {
            width: `${Math.min(Math.max(progress * 100, 0), 100)}%`,
        };
    });

    const loadChapter = async () => {
        const lang = await getLanguage();
        setLanguage(lang);
        const isLanguageMatch = route.params?.language === lang;
        if (!data || !isLanguageMatch) {
            setLoading(true);
        }
        try {
            const content = getChapterData(lang, chapterId);
            setData(content);
            if (!isLanguageMatch) {
                navigation.setParams({
                    chapterName: content.name,
                    chapterTransliteration: content.transliteration,
                    chapterTranslation: content.translation,
                    language: lang
                });
            }
        } catch (error) {
            console.error('Error loading chapter data', error);
        } finally {
            setLoading(false);
        }
    };

    const loadSettings = async () => {
        const [size, showTrans, style] = await Promise.all([
            getFontSize(),
            getShowTransliteration(),
            getQuranStyle()
        ]);
        setFontSize(size);
        setShowTransliteration(showTrans);
        setQuranStyle(style);
    };

    const itemLayouts = React.useMemo(() => {
        if (!data?.verses) return [];
        let currentOffset = 0;
        return data.verses.map((verse) => {
            const arabicLines = Math.ceil((verse.text?.length || 0) / 35);
            const translationLines = Math.ceil((verse.translation?.length || 0) / 45);
            const transliterationLines = showTransliteration ? Math.ceil((verse.transliteration?.length || 0) / 45) : 0;
            const verseHeight =
                (arabicLines * (fontSize + 18)) +
                (translationLines * (fontSize + 12)) +
                (transliterationLines * (fontSize + 8)) +
                60;
            const layout = { length: verseHeight, offset: currentOffset };
            currentOffset += verseHeight;
            return layout;
        });
    }, [data, fontSize, showTransliteration]);

    const getItemLayout = useCallback((data, index) => {
        if (!itemLayouts[index]) {
            return { length: 200, offset: 200 * index, index };
        }
        return {
            length: itemLayouts[index].length,
            offset: itemLayouts[index].offset,
            index,
        };
    }, [itemLayouts]);

    const handleNextChapter = () => {
        const chapters = getChapterIndex(language);
        const currentIndex = chapters.findIndex(c => Number(c.id) === Number(chapterId));
        if (currentIndex !== -1 && currentIndex < chapters.length - 1) {
            const nextChapter = chapters[currentIndex + 1];
            navigation.navigate('Chapter', {
                chapterId: nextChapter.id,
                chapterName: nextChapter.name,
                chapterTransliteration: nextChapter.transliteration,
                chapterTranslation: nextChapter.translation,
                language: language,
                initialVerseId: 1,
            });
        } else {
            navigation.openDrawer();
        }
    };

    const renderFooter = () => {
        const isLastChapter = Number(chapterId) === 114;
        return (
            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.nextButton, { backgroundColor: colors.accent, shadowColor: colors.accent }]}
                    onPress={handleNextChapter}
                    activeOpacity={0.8}
                >
                    <Text style={[styles.nextButtonText, { color: colors.surface }]}>
                        {isLastChapter ? getLocalizedString(language, 'backToBeginning') : getLocalizedString(language, 'nextChapter')}
                    </Text>
                    <Ionicons
                        name={isLastChapter ? "menu-outline" : "chevron-forward"}
                        size={20}
                        color={colors.surface}
                        style={{ marginLeft: 8 }}
                    />
                </TouchableOpacity>
            </View>
        );
    };

    if (loading) {
        return (
            <View style={[styles.centered, { backgroundColor: colors.background }]}>
                <ActivityIndicator size="large" color={colors.accent} />
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={[styles.progressBarContainer, { backgroundColor: colors.background, borderBottomColor: colors.border, borderBottomWidth: 1 }]}>
                <Animated.View style={[styles.progressBar, { backgroundColor: colors.accent }, progressBarStyle]} />
            </View>

            <Animated.FlatList
                key={`chapter-list-${chapterId}-${theme}`}
                ref={flatListRef}
                data={data?.verses}
                keyExtractor={(item) => `${chapterId}-${item.id}`}
                extraData={`${chapterId}-${fontSize}-${showTransliteration}-${quranStyle}-${theme}`}
                contentContainerStyle={styles.scrollContent}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={viewabilityConfig}
                onScroll={handleScroll}
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false}
                initialNumToRender={20}
                maxToRenderPerBatch={10}
                windowSize={11}
                removeClippedSubviews={false}
                getItemLayout={getItemLayout}
                onScrollToIndexFailed={(info) => {
                    setTimeout(() => {
                        flatListRef.current?.scrollToIndex({ index: info.index, animated: false });
                    }, 500);
                }}
                renderItem={({ item: verse }) => (
                    <VerseItem verse={verse} fontSize={fontSize} chapterId={chapterId} showTransliteration={showTransliteration} quranStyle={quranStyle} />
                )}
                ListFooterComponent={renderFooter}
            />
        </View>
    );
};

const VerseItem = React.memo(({ verse, fontSize, chapterId, showTransliteration, quranStyle }) => {
    const { colors } = useTheme();
    const arabicFont = quranStyle === 'Uthmani' ? 'Amiri_400Regular' : 'NotoNaskhArabic_400Regular';

    return (
        <View style={[styles.verseContainer, { borderBottomColor: colors.border }]}>
            <Text style={[styles.arabicText, { fontSize: fontSize + 8, fontFamily: arabicFont, color: colors.textPrimary }]}>
                {verse.text} <Text style={[styles.verseNumber, { color: colors.textSecondary }]}>{verse.id}</Text>
            </Text>

            {showTransliteration && (
                <Text style={[styles.transliterationText, { fontSize: fontSize - 2, color: colors.textSecondary }]}>
                    {verse.transliteration}
                </Text>
            )}

            <Text style={[styles.translationText, { fontSize: fontSize, color: colors.textPrimary }]}>
                {verse.translation}
            </Text>
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContent: {
        padding: SPACING.md,
    },
    progressBarContainer: {
        height: 6,
        width: '100%',
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        borderTopRightRadius: 2,
        borderBottomRightRadius: 2,
    },
    verseContainer: {
        marginBottom: SPACING.xl * 1.5,
        paddingBottom: SPACING.lg,
        borderBottomWidth: 1,
    },
    arabicText: {
        textAlign: 'right',
        marginBottom: SPACING.sm,
        lineHeight: 50,
    },
    translationText: {
        lineHeight: 24,
        letterSpacing: -0.3,
        fontFamily: 'Lora_400Regular',
    },
    transliterationText: {
        fontStyle: 'italic',
        marginBottom: SPACING.xs,
        lineHeight: 24,
        fontFamily: 'Outfit_400Regular',
    },
    verseNumber: {
        fontSize: 14,
        fontFamily: 'Outfit_400Regular',
    },
    footer: {
        paddingVertical: SPACING.xl,
        alignItems: 'center',
        marginBottom: SPACING.xl,
    },
    nextButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 32,
        borderRadius: 30,
        elevation: 4,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
    },
    nextButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'Outfit_600SemiBold',
    },
});

export default ChapterScreen;
