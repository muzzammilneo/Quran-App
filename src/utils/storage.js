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
