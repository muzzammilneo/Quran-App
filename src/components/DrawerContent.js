import React from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SPACING } from '../constants/theme';

const chapters = require('../../assets/data/chapters/en/index.json');

const DrawerContent = ({ navigation }) => {
    const insets = useSafeAreaInsets();

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.item}
            onPress={() => {
                navigation.navigate('Chapter', {
                    chapterId: item.id,
                    chapterName: item.name,
                    chapterTransliteration: item.transliteration,
                    chapterTranslation: item.translation,
                    initialVerseId: 1,
                });
            }}
        >
            <View style={styles.numberContainer}>
                <Text style={styles.number}>{item.id}</Text>
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.transliteration}>{item.transliteration}</Text>
                <Text style={styles.translation}>{item.translation}</Text>
            </View>
            <Text style={styles.arabicName}>{item.name}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={[styles.container, { paddingTop: insets.top + 4 }]}>
            <View style={styles.header}>
                <Text style={styles.title}>Quran Chapters</Text>
            </View>
            <FlatList
                data={chapters}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
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
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
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
    numberContainer: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: COLORS.background,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SPACING.md,
    },
    number: {
        fontSize: 12,
        color: COLORS.textSecondary,
        fontWeight: 'bold',
    },
    textContainer: {
        flex: 1,
    },
    transliteration: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.textPrimary,
    },
    translation: {
        fontSize: 12,
        color: COLORS.textSecondary,
    },
    arabicName: {
        fontSize: 18,
        color: COLORS.textPrimary,
        fontFamily: 'Amiri_400Regular',
    },
});

export default DrawerContent;
