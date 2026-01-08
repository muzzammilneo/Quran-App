# My Qu'ran

A premium, eye-friendly Quran reading application built with **React Native** and **Expo**. Designed for a focused and comfortable reading experience with modern typography, multi-language support, and a minimalist aesthetic.

## ✨ Features

- **📖 Chapter Navigation**: Intuitive drawer navigation ([DrawerContent.js](file:///Users/neopath/Desktop/project/My-Quran/src/components/DrawerContent.js)) to browse all 114 chapters with localized names.
- **🔄 Smart Resume**: Automatically remembers your last read chapter and scrolls to the exact verse where you left off.
- **🌍 Multi-Language Support**: Complete translations and transliterations for English, Bengali, Spanish, French, Indonesian, Russian, Swedish, Turkish, Urdu, and Chinese.
- **✒️ Customizable Font Styles**: Choose between **Uthmani** (classical Madinah script) and **IndoPak** (South Asian script) to suit your preference.
- **📈 Reading Progress**: A visual progress bar at the top of the screen indicates your reading position within the chapter.
- **📏 Adjustable Typography**: 
    - Customize font sizes (12pt to 40pt) for both Arabic and translation text.
    - Toggle phonetic transliteration on or off to suit your preference.
- **📉 Live Verse Counter**: Real-time progress tracking in the header (e.g., "Verse 5 / 286") that updates as you scroll.
- **🎯 Quick Navigation**: Tap the verse counter in the header to open a modal and instantly jump to any verse in the chapter.
- **🌙 Dark Mode Support**: Toggle between light and dark themes with system-aware defaults and persistent settings.
- **🎨 Premium Aesthetic**: A clean, modern UI with a curated color system (light/dark) and vibrant orange accents to minimize eye strain.
- **⚡ High Performance**: Optimized with React Native Reanimated, `React.memo` for verse items, and the New Architecture (Fabric) for buttery-smooth scrolling.

## 🛠️ Tech Stack

- **Framework**: [Expo](https://expo.dev/) (SDK 54)
- **Navigation**: [@react-navigation/drawer](https://reactnavigation.org/docs/drawer-based-navigation/)
- **Animations**: [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)
- **Storage**: [@react-native-async-storage/async-storage](https://react-native-async-storage.github.io/async-storage/)
- **Typography**: Specialized Google Fonts:
    - **Amiri**: For elegant Arabic script.
    - **Lora**: For readable serif translation text.
    - **Outfit**: For a modern UI feel.

## 📂 Project Structure

```text
My-Quran/
├── assets/
│   └── data/           # Quranic data (Chapters, Verses, Index) in JSON format
├── src/
│   ├── components/     # UI components (DrawerContent, HeaderTitle, etc.)
│   ├── constants/      # Theme, colors, and global spacing definitions
│   ├── screens/        # Main screens (ChapterScreen, SettingsScreen)
│   └── utils/          # Storage logic and localized language mappings
├── App.js              # Application entry point & navigation setup
└── app.json            # Expo configuration (New Architecture enabled)
```

## 🚀 Getting Started

### Prerequisites

- Node.js (LTS version)
- npm or yarn
- Expo Go app on your mobile device (for testing)

### Installation & Run

1. **Clone the repository**:
   ```bash
   git clone https://github.com/muzzammilneo/Quran-App.git
   cd My-Quran
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

---

Built with ❤️ by [Muzzammil](https://github.com/muzzammilneo)
