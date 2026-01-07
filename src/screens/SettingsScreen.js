import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING } from '../constants/theme';
import { getFontSize, saveFontSize, getLanguage, saveLanguage, getShowTransliteration, saveShowTransliteration } from '../utils/storage';
import { LANGUAGES, getLocalizedString } from '../utils/languageMappings';

const SettingsScreen = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const [fontSize, setFontSize] = useState(18);
    const [language, setLanguage] = useState('en');
    const [showTransliteration, setShowTransliteration] = useState(true);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        const [size, lang, showTrans] = await Promise.all([
            getFontSize(),
            getLanguage(),
            getShowTransliteration()
        ]);
        setFontSize(size);
        setLanguage(lang);
        setShowTransliteration(showTrans);
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

    const selectedLanguageName = LANGUAGES.find(l => l.id === language)?.name || 'English';

    const adjustFontSize = (delta) => {
        const newSize = Math.max(12, Math.min(40, fontSize + delta));
        setFontSize(newSize);
        saveFontSize(newSize);
    };

    return (
        <View style={styles.container}>
            <View style={[styles.header, { paddingTop: insets.top + 4 }]}>
                <TouchableOpacity onPress={() => navigation.openDrawer()}>
                    <Ionicons name="menu" size={24} color={COLORS.accent} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{getLocalizedString(language, 'settings')}</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                <View style={[styles.section, { zIndex: 10 }]}>
                    <Text style={styles.sectionTitle}>{getLocalizedString(language, 'translationLanguage')}</Text>

                    <TouchableOpacity
                        style={styles.dropdownHeader}
                        onPress={() => setIsDropdownOpen(!isDropdownOpen)}
                        activeOpacity={0.7}
                    >
                        <View style={styles.dropdownHeaderContent}>
                            <Ionicons name="language-outline" size={20} color={COLORS.accent} style={{ marginRight: 10 }} />
                            <Text style={styles.dropdownHeaderText}>{selectedLanguageName}</Text>
                        </View>
                        <Ionicons
                            name={isDropdownOpen ? "chevron-up" : "chevron-down"}
                            size={20}
                            color={COLORS.textSecondary}
                        />
                    </TouchableOpacity>

                    {isDropdownOpen && (
                        <View style={styles.dropdownMenu}>
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
                                            language === lang.id && styles.activeDropdownItem
                                        ]}
                                        onPress={() => handleLanguageChange(lang.id)}
                                    >
                                        <Text style={[
                                            styles.dropdownItemText,
                                            language === lang.id && styles.activeDropdownItemText
                                        ]}>
                                            {lang.name}
                                        </Text>
                                        {language === lang.id && (
                                            <Ionicons name="checkmark" size={18} color={COLORS.accent} />
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                    )}
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{getLocalizedString(language, 'readingFontSize')}</Text>

                    <View style={styles.settingItem}>
                        <View style={styles.settingLabelContainer}>
                            <Text style={styles.settingLabel}>{getLocalizedString(language, 'showTransliteration')}</Text>
                            <Text style={styles.settingDescription}>{getLocalizedString(language, 'transliterationDesc')}</Text>
                        </View>
                        <Switch
                            value={showTransliteration}
                            onValueChange={handleTransliterationToggle}
                            trackColor={{ false: COLORS.border, true: COLORS.accent + '80' }}
                            thumbColor={showTransliteration ? COLORS.accent : '#f4f3f4'}
                        />
                    </View>

                    <View style={styles.fontSizeSettingItem}>
                        <View style={styles.settingLabelContainer}>
                            <Text style={styles.settingDescription}>{getLocalizedString(language, 'fontSizeDesc')}</Text>
                        </View>
                        <View style={styles.fontControlsContainer}>
                            <TouchableOpacity onPress={() => adjustFontSize(-2)} style={styles.fontButton}>
                                <Ionicons name="remove" size={20} color={COLORS.accent} />
                            </TouchableOpacity>
                            <View style={styles.fontSizeDisplay}>
                                <Text style={styles.fontSizeText}>{fontSize}</Text>
                            </View>
                            <TouchableOpacity onPress={() => adjustFontSize(2)} style={styles.fontButton}>
                                <Ionicons name="add" size={20} color={COLORS.accent} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.previewSection}>
                        <Text style={styles.previewLabel}>{getLocalizedString(language, 'preview')}</Text>
                        <View style={styles.previewBox}>
                            <Text style={[styles.previewArabic, { fontSize: fontSize + 8 }]}>
                                بِسۡمِ ٱللَّهِ ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ <Text style={styles.verseNumber}>1</Text>
                            </Text>

                            {showTransliteration && (
                                <Text style={[styles.previewTransliteration, { fontSize: fontSize - 2 }]}>
                                    Bismi Allāhi Ar-Raḥmāni Ar-Raḥīm
                                </Text>
                            )}

                            <Text style={[styles.previewTranslation, { fontSize: fontSize }]}>
                                {getLocalizedString(language, 'bismillahTranslation')}
                            </Text>
                        </View>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{getLocalizedString(language, 'appInformation')}</Text>
                    <View style={styles.settingItem}>
                        <Text style={styles.settingLabel}>{getLocalizedString(language, 'version')}</Text>
                        <Text style={styles.settingValue}>1.0.0</Text>
                    </View>
                    <View style={styles.settingItem}>
                        <Text style={styles.settingLabel}>{getLocalizedString(language, 'developer')}</Text>
                        <Text style={styles.settingValue}>Muzzammil</Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.sm,
        backgroundColor: COLORS.surface,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        fontFamily: 'Outfit_700Bold',
    },
    content: {
        padding: SPACING.md,
    },
    section: {
        marginBottom: SPACING.xl,
        backgroundColor: COLORS.surface,
        borderRadius: 8,
        padding: SPACING.md,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: COLORS.accent,
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
        borderBottomColor: COLORS.background,
    },
    settingLabelContainer: {
        flex: 1,
        marginRight: SPACING.md,
    },
    settingLabel: {
        fontSize: 16,
        color: COLORS.textPrimary,
        fontWeight: '500',
    },
    fontSizeSettingItem: {
        paddingTop: SPACING.md,
        borderBottomColor: COLORS.background,
    },
    settingLabelContainer: {
        marginBottom: SPACING.md,
    },
    fontControlsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.background,
        borderRadius: 8,
        padding: SPACING.sm,
    },
    fontButton: {
        width: 44,
        height: 44,
        backgroundColor: COLORS.surface,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.border,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    fontButtonText: {
        fontSize: 18,
        color: COLORS.accent,
        fontWeight: 'bold',
    },
    fontSizeDisplay: {
        paddingHorizontal: 12,
    },
    fontSizeText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
    },
    previewSection: {
        marginTop: SPACING.lg,
        paddingTop: SPACING.md,
    },
    previewLabel: {
        fontSize: 12,
        color: COLORS.textSecondary,
        textTransform: 'uppercase',
        marginBottom: SPACING.sm,
        letterSpacing: 0.5,
    },
    previewBox: {
        padding: SPACING.md,
        backgroundColor: COLORS.background,
        borderRadius: 8,
    },
    previewArabic: {
        textAlign: 'right',
        color: COLORS.textPrimary,
        marginBottom: SPACING.sm,
        lineHeight: 50,
        fontFamily: 'Amiri_400Regular',
    },
    previewTransliteration: {
        color: '#424242',
        fontStyle: 'italic',
        marginBottom: SPACING.xs,
        lineHeight: 24,
        fontFamily: 'Outfit_400Regular',
    },
    previewTranslation: {
        color: COLORS.textSecondary,
        lineHeight: 24,
        letterSpacing: -0.3,
        fontFamily: 'Lora_400Regular',
    },
    verseNumber: {
        fontSize: 14,
        color: COLORS.textSecondary,
        fontFamily: 'Outfit_400Regular',
    },
    dropdownHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: SPACING.md,
        backgroundColor: COLORS.activeItemBackground,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.border,
        marginTop: SPACING.xs,
    },
    dropdownHeaderContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dropdownHeaderText: {
        fontSize: 16,
        color: COLORS.textPrimary,
        fontWeight: '600',
        fontFamily: 'Outfit_600SemiBold',
    },
    dropdownMenu: {
        marginTop: SPACING.xs,
        backgroundColor: COLORS.surface,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.border,
        maxHeight: 250,
        overflow: 'hidden',
        elevation: 4,
        shadowColor: '#000',
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
    activeDropdownItem: {
        backgroundColor: COLORS.activeItemBackground,
    },
    dropdownItemText: {
        fontSize: 15,
        color: COLORS.textSecondary,
    },
    activeDropdownItemText: {
        color: COLORS.accent,
        fontWeight: '600',
    },
    infoText: {
        fontSize: 14,
        color: COLORS.textSecondary,
        lineHeight: 20,
    },
});

export default SettingsScreen;
