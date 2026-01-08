import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal, ScrollView, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../utils/ThemeContext';
import { SPACING } from '../constants/theme';
import { getLocalizedString } from '../utils/languageMappings';

const { width, height } = Dimensions.get('window');

const HeaderVerseCount = ({ currentVerseId, totalVerses, language }) => {
    const { colors, theme } = useTheme();
    const navigation = useNavigation();
    const [modalVisible, setModalVisible] = useState(false);

    const isDark = theme === 'dark';

    const handleVerseSelect = (id) => {
        setModalVisible(false);
        navigation.setParams({
            jumpToVerseId: id,
            timestamp: Date.now() // Ensure the effect triggers even if same id
        });
    };

    const renderVerseGrid = () => {
        const verses = [];
        for (let i = 1; i <= totalVerses; i++) {
            verses.push(
                <TouchableOpacity
                    key={i}
                    style={[
                        styles.gridItem,
                        { backgroundColor: colors.background },
                        i === currentVerseId && { backgroundColor: colors.accent }
                    ]}
                    onPress={() => handleVerseSelect(i)}
                >
                    <Text style={[
                        styles.gridText,
                        { color: colors.textPrimary },
                        i === currentVerseId && { color: colors.surface }
                    ]}>
                        {i}
                    </Text>
                </TouchableOpacity>
            );
        }
        return verses;
    };

    return (
        <View>
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setModalVisible(true)}
                style={[styles.container, { backgroundColor: isDark ? 'rgba(255, 152, 0, 0.15)' : 'rgba(245, 124, 0, 0.1)' }]}
            >
                <Text style={[styles.text, { color: isDark ? colors.textPrimary : colors.textSecondary }]}>
                    {getLocalizedString(language || 'en', 'verse')}{' '}
                    <Text style={{ color: colors.accent }}>{currentVerseId || '-'}</Text> / {totalVerses || '-'}
                </Text>
            </TouchableOpacity>

            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setModalVisible(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setModalVisible(false)}
                >
                    <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
                        <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
                            <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>
                                {getLocalizedString(language || 'en', 'quranChapters')} - {getLocalizedString(language || 'en', 'verse')}
                            </Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <Text style={{ color: colors.accent, fontWeight: 'bold' }}>Close</Text>
                            </TouchableOpacity>
                        </View>
                        <ScrollView contentContainerStyle={styles.gridContainer}>
                            {renderVerseGrid()}
                        </ScrollView>
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginRight: SPACING.md,
        paddingVertical: 5,
        paddingHorizontal: 12,
        borderRadius: 20,
    },
    text: {
        fontSize: 13,
        fontFamily: 'Outfit_600SemiBold',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: width * 0.85,
        maxHeight: height * 0.7,
        borderRadius: 16,
        padding: SPACING.md,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: SPACING.sm,
        borderBottomWidth: 1,
        marginBottom: SPACING.sm,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: 'Outfit_700Bold',
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
    },
    gridItem: {
        width: (width * 0.85 - SPACING.md * 2 - SPACING.sm * 4) / 5,
        height: 40,
        margin: 2,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    gridText: {
        fontSize: 14,
        fontFamily: 'Outfit_600SemiBold',
    },
});

export default HeaderVerseCount;
