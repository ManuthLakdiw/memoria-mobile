# 📝 Memoria - Digital Journal & Mindfulness App

**Memoria** is a professional, secure, and intuitive digital journaling application designed to help users capture their daily reflections, moods, and multimedia memories. Built with a focus on mental well-being and data privacy, it combines traditional journaling with audio-visual support and biometric security.

---

## 👤 Developer Profile

- **Name**: Manuth Lakdiw
- **Identity**: Software Engineering Undergraduate at the Institute of Software Engineering (IJSE)
- **Professional Goal**: To gain industrial experience and master full-stack development
- **Contact**: [manuthlakdiv2006@gmail.com](mailto:manuthlakdiv2006@gmail.com)

---

## ✨ Key Features

- **🎙️ Audio Journaling**: Record and save voice notes along with your memories using a dedicated **Audio Service**.
- **📸 Multimedia Attachments**: Seamlessly attach and view images from your gallery to preserve vivid memories.
- **🎨 Premium UI/UX**: A high-quality interface built with **NativeWind** (Tailwind CSS) and smooth animations using **Moti**.
- **☁️ Real-time Firebase Sync**: Instant data persistence and cross-device availability powered by **Firebase Firestore**.
- **🛠️ Help Center**: Comprehensive support section featuring dynamic FAQ navigation and direct email support via **Expo Linking**.

---

## 🛠️ Technical Stack

### Frontend & Mobile
- **Framework**: React Native (Expo SDK 50+)
- **Styling**: NativeWind (Tailwind CSS)
- **Navigation**: Expo Router (Dynamic & File-based routing)
- **Icons**: Lucide React Native
- **Animations**: Moti (Reanimated 3)

### Backend & Services
- **Database**: Firebase Cloud Firestore (NoSQL)
- **Authentication**: Firebase Auth & Expo Local Authentication
- **Media Handling**: Expo Audio & Expo Image Picker
- **Deployment**: Expo Development Share (Development Builds)

---

## 📂 Project Structure

```text
memoria-app/
├── app/                  # Main Application Logic (Expo Router)
│   ├── (auth)/           # Authentication: login.tsx, register.tsx
│   ├── (dashboard)/      # Tabs: home.tsx, calendar.tsx, insights.tsx, profile.tsx
│   ├── help/             # Help Center: index.tsx, contact.tsx, [id].tsx
│   ├── memory/           # CRUD: create-entry.tsx, update-entry.tsx, [id].tsx
│   └── index.tsx         # App Entry Point
├── assets/               # Local fonts, images, and static files
├── components/           # Reusable UI: memory-card.tsx, swipeable-card.tsx
├── config/               # Configuration: firebase.ts, cloudinary.ts
├── contexts/             # Global State Management (React Context API)
├── hooks/                # Custom Hooks: use-auth.tsx, user-loader.tsx
└── services/             # Core Services: audio-service, auth-service, image-service, memory-service
```

---

## 🚀 Getting Started

**Clone the Repository:**
```bash
git clone https://github.com/manuthlakdiv/memoria-app.git
```

**Navigate to Project Directory:**
```bash
cd memoria-app
```

**Install Dependencies:**
```bash
npm install
```

**Environment Configuration:**  
Ensure your Firebase credentials are correctly set up in `config/firebase.ts`.

**Launch the Application:**
```bash
npx expo start
```

---

## 📄 License

This project is for educational purposes as part of the Software Engineering program at IJSE.
