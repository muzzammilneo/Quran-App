# Quran Reader App

A minimalist, eye-friendly Quran reading application built with React Native and Expo. Designed for a focused and comfortable reading experience with modern features and a premium aesthetic.

## ✨ Features

- **📖 Chapter Navigation**: Easy-to-use drawer navigation to browse all 114 chapters of the Quran.
- **🔄 Smart Resume**: Automatically remembers your last read chapter and the exact verse where you left off.
- **🔍 Transliteration & Translation**: Includes Arabic text, English transliteration, and English translation for every verse.
- **📏 Adjustable Font Size**: Customize the text size for both Arabic and English to suit your reading preference.
- **🎨 Premium Design**: A clean, minimalist UI using a sophisticated grey-scale palette to reduce eye strain.
- **⚡ High Performance**: Built with React Native Reanimated 4 and the New Architecture (Fabric) for buttery-smooth scrolling.

## 🛠️ Tech Stack

- **Framework**: [Expo](https://expo.dev/) (SDK 54)
- **Core**: React Native
- **Navigation**: [@react-navigation/drawer](https://reactnavigation.org/docs/drawer-based-navigation/)
- **Animations**: [React Native Reanimated 4](https://docs.swmansion.com/react-native-reanimated/)
- **Storage**: [@react-native-async-storage/async-storage](https://react-native-async-storage.github.io/async-storage/)
- **Fonts**: [Expo Google Fonts](https://github.com/expo/google-fonts) (Inter & Amiri)

## 🚀 Getting Started

### Prerequisites

- Node.js (LTS version)
- npm or yarn
- Expo Go app on your mobile device (for testing)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/muzzammilneo/Quran-App.git
   cd quran-app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npx expo start
   ```

4. **Run on your device**:
   Scan the QR code displayed in the terminal using the Expo Go app (Android) or the Camera app (iOS).

## 📂 Project Structure

```text
quran-app/
├── assets/
│   └── data/           # Quranic data (Chapters, Verses, Index)
├── src/
│   ├── components/     # Reusable UI components (DrawerContent, etc.)
│   ├── constants/      # Theme and color definitions
│   ├── screens/        # Main application screens (ChapterScreen)
│   └── utils/          # Helper functions and storage logic
├── App.js              # Main entry point and navigation setup
└── app.json            # Expo configuration (New Architecture enabled)
```

## 📝 License

This project is open-source and available under the [MIT License](LICENSE).

---

Built with ❤️ by [Muzzammil](https://github.com/muzzammilneo)
