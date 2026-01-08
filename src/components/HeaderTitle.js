import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { COLORS } from '../constants/theme';
import { getQuranStyle } from '../utils/storage';

const HeaderTitle = ({ chapterId, chapterName, chapterTransliteration, chapterTranslation }) => {
    const [quranStyle, setQuranStyle] = useState('Uthmani');

    useEffect(() => {
        const fetchStyle = async () => {
            const style = await getQuranStyle();
            setQuranStyle(style);
        };
        fetchStyle();
    }, []);

    const arabicFont = quranStyle === 'Uthmani' ? 'Amiri_700Bold' : 'NotoNaskhArabic_700Bold';

    return (
        <View style={styles.container}>
            <Text style={styles.chapterName} numberOfLines={1}>
                {chapterId}. {chapterTransliteration} <Text style={[styles.arabicName, { fontFamily: arabicFont }]}>({chapterName})</Text>
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
