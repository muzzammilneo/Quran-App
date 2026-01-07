import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { COLORS } from '../constants/theme';

const HeaderTitle = ({ chapterId, chapterName, chapterTransliteration, chapterTranslation }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.chapterName} numberOfLines={1}>
                {chapterId}. {chapterTransliteration} <Text style={styles.arabicName}>({chapterName})</Text>
            </Text>
            <Text style={styles.chapterTranslation} numberOfLines={1}>{chapterTranslation}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    chapterName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        fontFamily: 'Outfit_700Bold',
        textAlign: 'left',
    },
    arabicName: {
        fontFamily: 'Amiri_700Bold',
        fontSize: 14,
    },
    chapterTranslation: {
        fontSize: 13,
        color: '#424242',
        fontFamily: 'Outfit_400Regular',
        textAlign: 'left',
        marginTop: 0,
    },
});

export default HeaderTitle;
