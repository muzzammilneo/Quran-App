import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useTheme } from '../utils/ThemeContext';
import { SPACING } from '../constants/theme';
import { getLocalizedString } from '../utils/languageMappings';

const HeaderVerseCount = ({ currentVerseId, totalVerses, language }) => {
    const { colors } = useTheme();

    if (!currentVerseId || !totalVerses) return null;

    return (
        <View style={styles.container}>
            <Text style={[styles.text, { color: colors.textSecondary }]}>
                {getLocalizedString(language || 'en', 'verse')} {currentVerseId} / {totalVerses}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginRight: SPACING.md,
        paddingVertical: 4,
        paddingHorizontal: 12,
        borderRadius: 12,
    },
    text: {
        fontSize: 13,
        fontFamily: 'Outfit_600SemiBold',
    },
});

export default HeaderVerseCount;
