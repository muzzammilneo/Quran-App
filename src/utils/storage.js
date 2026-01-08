import AsyncStorage from '@react-native-async-storage/async-storage';

const LAST_READ_KEY = '@quran_last_read';

export const saveLastRead = async (chapterId, verseId = 1) => {
    try {
        await AsyncStorage.setItem(LAST_READ_KEY, JSON.stringify({ chapterId, verseId }));
    } catch (e) {
        console.error('Error saving last read', e);
    }
};

export const getLastRead = async () => {
    try {
        const value = await AsyncStorage.getItem(LAST_READ_KEY);
        if (value == null) return null;
        const parsed = JSON.parse(value);
        // Handle old format where only chapterId was saved
        if (typeof parsed === 'number') {
            return { chapterId: parsed, verseId: 1 };
        }
        return parsed;
    } catch (e) {
        console.error('Error getting last read', e);
        return null;
    }
};

const FONT_SIZE_KEY = '@quran_font_size';

export const saveFontSize = async (size) => {
    try {
        await AsyncStorage.setItem(FONT_SIZE_KEY, JSON.stringify(size));
    } catch (e) {
        console.error('Error saving font size', e);
    }
};

export const getFontSize = async () => {
    try {
        const value = await AsyncStorage.getItem(FONT_SIZE_KEY);
        return value != null ? JSON.parse(value) : 18;
    } catch (e) {
        console.error('Error getting font size', e);
        return 18;
    }
};

const LANGUAGE_KEY = '@quran_language';

export const saveLanguage = async (lang) => {
    try {
        await AsyncStorage.setItem(LANGUAGE_KEY, lang);
    } catch (e) {
        console.error('Error saving language', e);
    }
};

export const getLanguage = async () => {
    try {
        const value = await AsyncStorage.getItem(LANGUAGE_KEY);
        return value !== null ? value : 'en';
    } catch (e) {
        console.error('Error getting language', e);
        return 'en';
    }
};

export const SHOW_TRANSLITERATION_KEY = 'show_transliteration';

export const saveShowTransliteration = async (show) => {
    try {
        await AsyncStorage.setItem(SHOW_TRANSLITERATION_KEY, JSON.stringify(show));
    } catch (e) {
        console.error('Error saving transliteration setting', e);
    }
};

export const getShowTransliteration = async () => {
    try {
        const value = await AsyncStorage.getItem(SHOW_TRANSLITERATION_KEY);
        return value !== null ? JSON.parse(value) : true;
    } catch (e) {
        console.error('Error getting transliteration setting', e);
        return true;
    }
};

const QURAN_STYLE_KEY = '@quran_style';

export const saveQuranStyle = async (style) => {
    try {
        await AsyncStorage.setItem(QURAN_STYLE_KEY, style);
    } catch (e) {
        console.error('Error saving quran style', e);
    }
};

export const getQuranStyle = async () => {
    try {
        const value = await AsyncStorage.getItem(QURAN_STYLE_KEY);
        return value !== null ? value : 'Uthmani';
    } catch (e) {
        console.error('Error getting quran style', e);
        return 'Uthmani';
    }
};
