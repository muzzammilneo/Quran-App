import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SPACING } from '../constants/theme';
import { getFontSize, saveFontSize, saveLastRead } from '../utils/storage';
import { chapterData } from '../utils/chapterMapping';

const ChapterScreen = ({ route, navigation }) => {
    const insets = useSafeAreaInsets();
    const { chapterId, chapterName, chapterTransliteration, chapterTranslation, initialVerseId } = route.params;
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [fontSize, setFontSize] = useState(18);
    const flatListRef = React.useRef(null);
    const chapterIdRef = React.useRef(chapterId);
    const initialScrollDone = React.useRef(false);

    // Update ref whenever chapterId changes
    useEffect(() => {
        chapterIdRef.current = chapterId;
        initialScrollDone.current = false; // Reset for new chapter
    }, [chapterId]);

    useEffect(() => {
        loadChapter();
        loadSettings();
        saveLastRead(chapterId, initialVerseId || 1);
    }, [chapterId]);

    useEffect(() => {
        if (data && initialVerseId > 1) {
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
                }, 200);
            } else {
                initialScrollDone.current = true;
            }
        } else {
            initialScrollDone.current = true;
        }
    }, [data, initialVerseId]);

    const onViewableItemsChanged = React.useRef(({ viewableItems }) => {
        if (initialScrollDone.current && viewableItems.length > 0) {
            const currentVerseId = viewableItems[0].item.id;
            saveLastRead(chapterIdRef.current, currentVerseId);
        }
    }).current;

    const viewabilityConfig = React.useRef({
        itemVisiblePercentThreshold: 50
    }).current;

    const loadChapter = async () => {
        setLoading(true);
        try {
            const content = chapterData[chapterId];
            setData(content);
        } catch (error) {
            console.error('Error loading chapter data', error);
        } finally {
            setLoading(false);
        }
    };

    const loadSettings = async () => {
        const size = await getFontSize();
        setFontSize(size);
    };

    const adjustFontSize = (delta) => {
        const newSize = Math.max(12, Math.min(40, fontSize + delta));
        setFontSize(newSize);
        saveFontSize(newSize);
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
            <View style={[styles.header, { paddingTop: insets.top + 4 }]}>
                <View>
                    <Text style={styles.chapterNumber}>Chapter {chapterId}</Text>
                    <Text style={styles.chapterName}>{chapterTransliteration} ({chapterName})</Text>
                    <Text style={styles.chapterTranslation}>{chapterTranslation}</Text>
                </View>
                <View style={styles.fontControls}>
                    <TouchableOpacity onPress={() => adjustFontSize(-2)} style={styles.fontButton}>
                        <Text style={styles.fontButtonText}>A-</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => adjustFontSize(2)} style={styles.fontButton}>
                        <Text style={styles.fontButtonText}>A+</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <FlatList
                ref={flatListRef}
                data={data?.verses}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.scrollContent}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={viewabilityConfig}
                onScrollToIndexFailed={(info) => {
                    const wait = new Promise(resolve => setTimeout(resolve, 500));
                    wait.then(() => {
                        flatListRef.current?.scrollToIndex({ index: info.index, animated: false });
                    });
                }}
                renderItem={({ item: verse }) => (
                    <View key={verse.id} style={styles.verseContainer}>
                        <Text style={[styles.arabicText, { fontSize: fontSize + 6 }]}>
                            {verse.text} <Text style={styles.verseNumber}>({verse.id})</Text>
                        </Text>
                        <Text style={[styles.transliterationText, { fontSize: fontSize - 2 }]}>
                            {verse.transliteration}
                        </Text>
                        <Text style={[styles.translationText, { fontSize: fontSize }]}>
                            {verse.translation}
                        </Text>
                    </View>
                )}
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
    header: {
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.sm,
        backgroundColor: COLORS.surface,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    chapterNumber: {
        fontSize: 10,
        color: COLORS.textSecondary,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: -2,
    },
    chapterName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
    },
    chapterTranslation: {
        fontSize: 12,
        color: COLORS.textSecondary,
        fontStyle: 'italic',
        marginTop: -2,
    },
    fontControls: {
        flexDirection: 'row',
    },
    fontButton: {
        padding: SPACING.sm,
        marginLeft: SPACING.sm,
        backgroundColor: COLORS.background,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    fontButtonText: {
        fontSize: 14,
        color: COLORS.textPrimary,
        fontWeight: '600',
    },
    scrollContent: {
        padding: SPACING.md,
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
        lineHeight: 28,
        fontFamily: 'Inter_400Regular',
    },
    transliterationText: {
        color: COLORS.accent,
        fontStyle: 'italic',
        marginBottom: SPACING.xs,
        lineHeight: 24,
        fontFamily: 'Inter_400Regular',
    },
    verseNumber: {
        fontSize: 14,
        color: COLORS.textSecondary,
    },
});

export default ChapterScreen;
