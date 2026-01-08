import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { SPACING } from '../constants/theme';
import { getFontSize, saveFontSize, getLanguage, saveLanguage, getShowTransliteration, saveShowTransliteration, getQuranStyle, saveQuranStyle } from '../utils/storage';
import { LANGUAGES, getLocalizedString } from '../utils/languageMappings';
import { useTheme } from '../utils/ThemeContext';

const SettingsScreen = ({ navigation }) => {
    const { colors, theme, toggleTheme } = useTheme();
    const insets = useSafeAreaInsets();
    const [fontSize, setFontSize] = useState(18);
    const [language, setLanguage] = useState('en');
    const [showTransliteration, setShowTransliteration] = useState(true);
    const [quranStyle, setQuranStyle] = useState('Uthmani');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        const [size, lang, showTrans, style] = await Promise.all([
            getFontSize(),
            getLanguage(),
            getShowTransliteration(),
            getQuranStyle()
        ]);
        setFontSize(size);
        setLanguage(lang);
        setShowTransliteration(showTrans);
        setQuranStyle(style);
    };

    const handleLanguageChange = (langId) => {
        setLanguage(langId);
        saveLanguage(langId);
        setIsDropdownOpen(false);
    };

    const handleTransliterationToggle = (value) => {
        setShowTransliteration(value);
        saveShowTransliteration(value);
    };

    const handleQuranStyleChange = (style) => {
        setQuranStyle(style);
        saveQuranStyle(style);
    };

    const selectedLanguageName = LANGUAGES.find(l => l.id === language)?.name || 'English';

    const getArabicFont = () => {
        return quranStyle === 'Uthmani' ? 'Amiri_400Regular' : 'NotoNaskhArabic_400Regular';
    };

    const adjustFontSize = (delta) => {
        const newSize = Math.max(12, Math.min(40, fontSize + delta));
        setFontSize(newSize);
        saveFontSize(newSize);
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={[styles.header, { paddingTop: insets.top + 4, backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
                <TouchableOpacity onPress={() => navigation.openDrawer()}>
                    <Ionicons name="menu" size={24} color={colors.accent} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>{getLocalizedString(language, 'settings')}</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                <View style={[styles.section, { zIndex: 10, backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <Text style={[styles.sectionTitle, { color: colors.accent }]}>{getLocalizedString(language, 'translationLanguage')}</Text>

                    <TouchableOpacity
                        style={[styles.dropdownHeader, { backgroundColor: colors.activeItemBackground, borderColor: colors.border }]}
                        onPress={() => setIsDropdownOpen(!isDropdownOpen)}
                        activeOpacity={0.7}
                    >
                        <View style={styles.dropdownHeaderContent}>
                            <Ionicons name="language-outline" size={20} color={colors.accent} style={{ marginRight: 10 }} />
                            <Text style={[styles.dropdownHeaderText, { color: colors.textPrimary }]}>{selectedLanguageName}</Text>
                        </View>
                        <Ionicons
                            name={isDropdownOpen ? "chevron-up" : "chevron-down"}
                            size={20}
                            color={colors.textSecondary}
                        />
                    </TouchableOpacity>

                    {isDropdownOpen && (
                        <View style={[styles.dropdownMenu, { backgroundColor: colors.surface, borderColor: colors.border, shadowColor: '#000' }]}>
                            <ScrollView
                                style={styles.dropdownScroll}
                                nestedScrollEnabled={true}
                                showsVerticalScrollIndicator={false}
                            >
                                {LANGUAGES.map((lang) => (
                                    <TouchableOpacity
                                        key={lang.id}
                                        style={[
                                            styles.dropdownItem,
                                            language === lang.id && { backgroundColor: colors.activeItemBackground }
                                        ]}
                                        onPress={() => handleLanguageChange(lang.id)}
                                    >
                                        <Text style={[
                                            styles.dropdownItemText,
                                            { color: language === lang.id ? colors.accent : colors.textSecondary },
                                            language === lang.id && { fontWeight: '600' }
                                        ]}>
                                            {lang.name}
                                        </Text>
                                        {language === lang.id && (
                                            <Ionicons name="checkmark" size={18} color={colors.accent} />
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                    )}
                </View>

                <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <Text style={[styles.sectionTitle, { color: colors.accent }]}>{getLocalizedString(language, 'readingPreferences') || 'Reading Preferences'}</Text>

                    <View style={[styles.settingItem, { borderBottomColor: colors.background }]}>
                        <View style={styles.settingLabelContainer}>
                            <Text style={[styles.settingLabel, { color: colors.textPrimary }]}>{getLocalizedString(language, 'darkMode') || 'Dark Mode'}</Text>
                        </View>
                        <Switch
                            value={theme === 'dark'}
                            onValueChange={toggleTheme}
                            trackColor={{ false: colors.border, true: colors.accent + '80' }}
                            thumbColor={theme === 'dark' ? colors.accent : '#f4f3f4'}
                        />
                    </View>

                    <View style={[styles.styleSelectorContainer, { borderBottomColor: colors.background }]}>
                        <Text style={[styles.settingLabel, { color: colors.textPrimary }]}>{getLocalizedString(language, 'quranStyle') || 'Quran Font Style'}</Text>
                        <View style={[styles.styleButtons, { backgroundColor: colors.background }]}>
                            <TouchableOpacity
                                style={[styles.styleButton, quranStyle === 'Uthmani' && [styles.activeStyleButton, { backgroundColor: colors.surface, shadowColor: '#000' }]]}
                                onPress={() => handleQuranStyleChange('Uthmani')}
                            >
                                <Text style={[styles.styleButtonText, { color: quranStyle === 'Uthmani' ? colors.accent : colors.textSecondary }]}>Uthmani</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.styleButton, quranStyle === 'IndoPak' && [styles.activeStyleButton, { backgroundColor: colors.surface, shadowColor: '#000' }]]}
                                onPress={() => handleQuranStyleChange('IndoPak')}
                            >
                                <Text style={[styles.styleButtonText, { color: quranStyle === 'IndoPak' ? colors.accent : colors.textSecondary }]}>IndoPak</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={[styles.settingItem, { borderBottomColor: colors.background }]}>
                        <View style={styles.settingLabelContainer}>
                            <Text style={[styles.settingLabel, { color: colors.textPrimary }]}>{getLocalizedString(language, 'showTransliteration')}</Text>
                            <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>{getLocalizedString(language, 'transliterationDesc')}</Text>
                        </View>
                        <Switch
                            value={showTransliteration}
                            onValueChange={handleTransliterationToggle}
                            trackColor={{ false: colors.border, true: colors.accent + '80' }}
                            thumbColor={showTransliteration ? colors.accent : '#f4f3f4'}
                        />
                    </View>

                    <View style={[styles.fontSizeSettingItem, { borderBottomColor: colors.background }]}>
                        <View style={styles.settingLabelContainer}>
                            <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>{getLocalizedString(language, 'fontSizeDesc')}</Text>
                        </View>
                        <View style={[styles.fontControlsContainer, { backgroundColor: colors.background }]}>
                            <TouchableOpacity onPress={() => adjustFontSize(-2)} style={[styles.fontButton, { backgroundColor: colors.surface, borderColor: colors.border, shadowColor: '#000' }]}>
                                <Ionicons name="remove" size={20} color={colors.accent} />
                            </TouchableOpacity>
                            <View style={styles.fontSizeDisplay}>
                                <Text style={[styles.fontSizeText, { color: colors.textPrimary }]}>{fontSize}</Text>
                            </View>
                            <TouchableOpacity onPress={() => adjustFontSize(2)} style={[styles.fontButton, { backgroundColor: colors.surface, borderColor: colors.border, shadowColor: '#000' }]}>
                                <Ionicons name="add" size={20} color={colors.accent} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.previewSection}>
                        <Text style={[styles.previewLabel, { color: colors.textSecondary }]}>{getLocalizedString(language, 'preview')}</Text>
                        <View style={[styles.previewBox, { backgroundColor: colors.background }]}>
                            <Text style={[styles.previewArabic, { fontSize: fontSize + 8, fontFamily: getArabicFont(), color: colors.textPrimary }]}>
                                بِسۡمِ ٱللَّهِ ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ <Text style={[styles.verseNumber, { color: colors.textSecondary }]}>1</Text>
                            </Text>

                            {showTransliteration && (
                                <Text style={[styles.previewTransliteration, { fontSize: fontSize - 2, color: colors.textSecondary }]}>
                                    Bismi Allāhi Ar-Raḥmāni Ar-Raḥīm
                                </Text>
                            )}

                            <Text style={[styles.previewTranslation, { fontSize: fontSize, color: colors.textPrimary }]}>
                                {getLocalizedString(language, 'bismillahTranslation')}
                            </Text>
                        </View>
                    </View>
                </View>

                <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <Text style={[styles.sectionTitle, { color: colors.accent }]}>{getLocalizedString(language, 'appInformation')}</Text>
                    <View style={[styles.settingItem, { borderBottomColor: colors.background }]}>
                        <Text style={[styles.settingLabel, { color: colors.textPrimary }]}>{getLocalizedString(language, 'version')}</Text>
                        <Text style={[styles.settingValue, { color: colors.textSecondary }]}>1.0.0</Text>
                    </View>
                    <View style={[styles.settingItem, { borderBottomColor: colors.background }]}>
                        <Text style={[styles.settingLabel, { color: colors.textPrimary }]}>{getLocalizedString(language, 'developer')}</Text>
                        <Text style={[styles.settingValue, { color: colors.textSecondary }]}>Muzzammil</Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.sm,
        borderBottomWidth: 1,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: 'Outfit_700Bold',
    },
    content: {
        padding: SPACING.md,
    },
    section: {
        marginBottom: SPACING.xl,
        borderRadius: 8,
        padding: SPACING.md,
        borderWidth: 1,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        marginBottom: SPACING.md,
        letterSpacing: 1,
        fontFamily: 'Outfit_700Bold',
    },
    settingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: SPACING.sm,
        borderBottomWidth: 1,
    },
    settingLabelContainer: {
        flex: 1,
        marginRight: SPACING.md,
    },
    settingLabel: {
        fontSize: 16,
        fontWeight: '500',
    },
    settingDescription: {
        fontSize: 12,
        marginTop: 2,
    },
    fontSizeSettingItem: {
        paddingTop: SPACING.md,
    },
    fontControlsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        padding: SPACING.sm,
    },
    fontButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        elevation: 1,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    fontSizeDisplay: {
        paddingHorizontal: 12,
    },
    fontSizeText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    previewSection: {
        marginTop: SPACING.lg,
        paddingTop: SPACING.md,
    },
    previewLabel: {
        fontSize: 12,
        textTransform: 'uppercase',
        marginBottom: SPACING.sm,
        letterSpacing: 0.5,
    },
    previewBox: {
        padding: SPACING.md,
        borderRadius: 8,
    },
    previewArabic: {
        textAlign: 'right',
        marginBottom: SPACING.sm,
        lineHeight: 50,
    },
    previewTransliteration: {
        fontStyle: 'italic',
        marginBottom: SPACING.xs,
        lineHeight: 24,
        fontFamily: 'Outfit_400Regular',
    },
    previewTranslation: {
        lineHeight: 24,
        letterSpacing: -0.3,
        fontFamily: 'Lora_400Regular',
    },
    verseNumber: {
        fontSize: 14,
        fontFamily: 'Outfit_400Regular',
    },
    styleSelectorContainer: {
        marginTop: SPACING.md,
        marginBottom: SPACING.lg,
        paddingBottom: SPACING.md,
        borderBottomWidth: 1,
    },
    styleButtons: {
        flexDirection: 'row',
        marginTop: SPACING.sm,
        padding: 4,
        borderRadius: 10,
    },
    styleButton: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 8,
    },
    activeStyleButton: {
        elevation: 2,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    styleButtonText: {
        fontSize: 14,
        fontFamily: 'Outfit_600SemiBold',
    },
    dropdownHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: SPACING.md,
        borderRadius: 12,
        borderWidth: 1,
        marginTop: SPACING.xs,
    },
    dropdownHeaderContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dropdownHeaderText: {
        fontSize: 16,
        fontWeight: '600',
        fontFamily: 'Outfit_600SemiBold',
    },
    dropdownMenu: {
        marginTop: SPACING.xs,
        borderRadius: 12,
        borderWidth: 1,
        maxHeight: 250,
        overflow: 'hidden',
        elevation: 4,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    dropdownScroll: {
        padding: 5,
    },
    dropdownItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: SPACING.md,
        borderRadius: 8,
    },
    dropdownItemText: {
        fontSize: 15,
    },
    settingValue: {
        fontSize: 16,
        fontFamily: 'Outfit_600SemiBold',
    },
});

export default SettingsScreen;
