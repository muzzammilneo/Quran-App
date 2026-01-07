import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { useSharedValue, useAnimatedStyle, useAnimatedScrollHandler } from 'react-native-reanimated';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS, SPACING } from '../constants/theme';
import { getFontSize, saveFontSize, saveLastRead, getLanguage, getShowTransliteration } from '../utils/storage';
import { getChapterData, getChapterIndex, getLocalizedString } from '../utils/languageMappings';

const ChapterScreen = ({ route, navigation }) => {
    const insets = useSafeAreaInsets();
    const { chapterId, chapterName, chapterTransliteration, chapterTranslation, initialVerseId } = route.params;
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [fontSize, setFontSize] = useState(18);
    const [showTransliteration, setShowTransliteration] = useState(true);
    const [language, setLanguage] = useState('en');
    const scrollY = useSharedValue(0);
    const contentHeight = useSharedValue(0);
    const layoutHeight = useSharedValue(0);
    const flatListRef = React.useRef(null);
    const chapterIdRef = React.useRef(chapterId);
    const initialScrollDone = React.useRef(false);

    // Update ref whenever chapterId changes
    useEffect(() => {
        chapterIdRef.current = chapterId;
        initialScrollDone.current = false; // Reset for new chapter

        // Reset scroll indicators
        scrollY.value = 0;
        contentHeight.value = 0;
        layoutHeight.value = 0;
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

        if (initialVerseId > 1) {
            const index = data.verses.findIndex(v => v.id === initialVerseId);
            if (index !== -1) {
                // Small delay to ensure FlatList is ready
                setTimeout(() => {
                    flatListRef.current?.scrollToIndex({
                        index,
                        animated: false,
                        viewPosition: 0
                    });
                    // Mark as done after a bit more time to let viewability settle
                    setTimeout(() => {
                        initialScrollDone.current = true;
                    }, 500);
                }, 300); // Increased delay slightly
            } else {
                initialScrollDone.current = true;
            }
        } else {
            initialScrollDone.current = true;
        }
    }, [data, initialVerseId]);

    const onViewableItemsChanged = React.useRef(({ viewableItems }) => {
        if (viewableItems.length > 0) {
            const verseId = viewableItems[0].item.id;
            if (initialScrollDone.current) {
                saveLastRead(chapterIdRef.current, verseId);
            }
        }
    }).current;

    const viewabilityConfig = React.useRef({
        itemVisiblePercentThreshold: 50
    }).current;

    const handleScroll = useAnimatedScrollHandler({
        onScroll: (event) => {
            scrollY.value = event.contentOffset.y;
            contentHeight.value = event.contentSize.height;
            layoutHeight.value = event.layoutMeasurement.height;
        },
    });

    const progressBarStyle = useAnimatedStyle(() => {
        const totalHeight = contentHeight.value - layoutHeight.value;
        const progress = totalHeight > 0 ? scrollY.value / totalHeight : 0;
        return {
            width: `${Math.max(0, Math.min(1, progress)) * 100}%`,
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

            // Sync navigation params for the header if they changed
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
        const [size, showTrans] = await Promise.all([
            getFontSize(),
            getShowTransliteration()
        ]);
        setFontSize(size);
        setShowTransliteration(showTrans);
    };

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
        const chapters = getChapterIndex(language);
        const isLastChapter = Number(chapterId) === 114;

        return (
            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.nextButton}
                    onPress={handleNextChapter}
                    activeOpacity={0.8}
                >
                    <Text style={styles.nextButtonText}>
                        {isLastChapter ? getLocalizedString(language, 'backToBeginning') : getLocalizedString(language, 'nextChapter')}
                    </Text>
                    <Ionicons
                        name={isLastChapter ? "menu-outline" : "chevron-forward"}
                        size={20}
                        color={COLORS.surface}
                        style={{ marginLeft: 8 }}
                    />
                </TouchableOpacity>
            </View>
        );
    };

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color={COLORS.accent} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.progressBarContainer}>
                <Animated.View style={[styles.progressBar, progressBarStyle]} />
            </View>

            <Animated.FlatList
                key={`chapter-list-${chapterId}`}
                ref={flatListRef}
                data={data?.verses}
                keyExtractor={(item) => `${chapterId}-${item.id}`}
                extraData={`${chapterId}-${fontSize}-${showTransliteration}`}
                contentContainerStyle={styles.scrollContent}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={viewabilityConfig}
                onScroll={handleScroll}
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false}
                persistentScrollbar={true}
                initialNumToRender={10}
                maxToRenderPerBatch={10}
                windowSize={5}
                removeClippedSubviews={true}
                onScrollToIndexFailed={(info) => {
                    const wait = new Promise(resolve => setTimeout(resolve, 500));
                    wait.then(() => {
                        flatListRef.current?.scrollToIndex({ index: info.index, animated: false });
                    });
                }}
                renderItem={({ item: verse }) => (
                    <VerseItem verse={verse} fontSize={fontSize} chapterId={chapterId} showTransliteration={showTransliteration} />
                )}
                ListFooterComponent={renderFooter}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.background,
    },
    scrollContent: {
        padding: SPACING.md,
    },
    progressBarContainer: {
        height: 4,
        backgroundColor: COLORS.background,
        width: '100%',
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        backgroundColor: COLORS.accent,
        borderTopRightRadius: 2,
        borderBottomRightRadius: 2,
    },
    verseContainer: {
        marginBottom: SPACING.xl * 1.5,
        paddingBottom: SPACING.lg,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.background,
    },
    arabicText: {
        textAlign: 'right',
        color: COLORS.textPrimary,
        marginBottom: SPACING.sm,
        lineHeight: 50,
        fontFamily: 'Amiri_400Regular',
    },
    translationText: {
        color: COLORS.textSecondary,
        lineHeight: 24,
        letterSpacing: -0.3,
        fontFamily: 'Lora_400Regular',
    },
    transliterationText: {
        color: '#424242', // Dark Grey (as before)
        fontStyle: 'italic',
        marginBottom: SPACING.xs,
        lineHeight: 24,
        fontFamily: 'Outfit_400Regular',
    },
    verseNumber: {
        fontSize: 14,
        color: COLORS.textSecondary,
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
        backgroundColor: COLORS.accent,
        paddingVertical: 14,
        paddingHorizontal: 32,
        borderRadius: 30,
        elevation: 4,
        shadowColor: COLORS.accent,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
    },
    nextButtonText: {
        color: COLORS.surface,
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'Outfit_600SemiBold',
    },
});

const VerseItem = React.memo(({ verse, fontSize, chapterId, showTransliteration }) => (
    <View style={styles.verseContainer}>
        <Text style={[styles.arabicText, { fontSize: fontSize + 8 }]}>
            {verse.text} <Text style={styles.verseNumber}>{verse.id}</Text>
        </Text>

        {showTransliteration && (
            <Text style={[styles.transliterationText, { fontSize: fontSize - 2 }]}>
                {verse.transliteration}
            </Text>
        )}

        <Text style={[styles.translationText, { fontSize: fontSize }]}>
            {verse.translation}
        </Text>
    </View>
));

export default ChapterScreen;
