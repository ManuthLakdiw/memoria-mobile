# 📝 Memoria - Digital Journal & Mindfulness App

**Memoria** is a professional, secure, and intuitive digital journaling application designed to help users capture their daily reflections, moods, and multimedia memories. Built with a focus on mental well-being and data privacy, it combines traditional journaling with audio-visual support and biometric security.

---

## 👤 Developer Profile

- **Name**: Manuth Lakdiw
- **Identity**: Software Engineering Undergraduate at the Institute of Software Engineering (IJSE)
- **Professional Goal**: To gain industrial experience and master full-stack development
- **Contact**: [manuthlakdiv2006@gmail.com](mailto:manuthlakdiv2006@gmail.com)

---

## 📱 Screenshots

<p align="center">
  <img width="200" alt="Image" src="https://github.com/user-attachments/assets/04ca2330-9afe-42aa-a57f-ae45a349ccb7" />
  <img width="200" alt="Image" src="https://github.com/user-attachments/assets/f96122d9-96eb-4b0c-8615-27ebe8f3548f" />
  <img width="200" alt="Image" src="https://github.com/user-attachments/assets/bc1e8d7a-7ddb-4571-88ca-4378daf99425" />
  <img width="200" alt="Image" src="https://github.com/user-attachments/assets/f0e028b4-c6fa-46ff-b725-75268b298bc5" />
  <img width="200" alt="Image" src="https://github.com/user-attachments/assets/5bd92850-e7ce-43dd-af20-0239c7a14bef" />
  <img width="200" alt="Image" src="https://github.com/user-attachments/assets/e922087f-35ff-46de-95fe-2301194adbc0" />
  <img width="200" alt="Image" src="https://github.com/user-attachments/assets/ff5a119c-d1df-4067-8625-ec8a5e1814d8" />
  <img width="200" alt="Image" src="https://github.com/user-attachments/assets/058d78fb-66c5-469c-ae22-330a1bcccdd0" />
  <img width="200" alt="Image" src="https://github.com/user-attachments/assets/25e64b84-109b-4b1b-bbd0-0c8e903a9c64" />
  <img width="200" alt="Image" src="https://github.com/user-attachments/assets/cc3eb0cc-9491-4a0d-84b2-5fecf34f24c7" />
  <img width="200" alt="Image" src="https://github.com/user-attachments/assets/d64a6604-2261-4938-9c07-fe063b2fa20c" />
  <img width="200" alt="Image" src="https://github.com/user-attachments/assets/10e40534-82ee-4465-8b23-403b124fac46" />
  <img width="200" alt="Image" src="https://github.com/user-attachments/assets/e78c2c74-1875-46dc-9078-658b42247289" />
  <img width="200" alt="Image" src="https://github.com/user-attachments/assets/49dcb408-0a76-4949-948b-2226ddbf9da4" />
  <img width="200" alt="Image" src="https://github.com/user-attachments/assets/2dc38e5e-0a20-4bc0-9ee9-56cf4c31789b" />
  <img width="200" alt="Image" src="https://github.com/user-attachments/assets/665a8a9f-323b-4a64-9065-8141c9a51cbc" />
  <img width="200" alt="Image" src="https://github.com/user-attachments/assets/5fd8060a-e6b3-48d4-9f8c-77b3475b1fad" />
  <img width="200" alt="Image" src="https://github.com/user-attachments/assets/71ef61bf-4999-4861-bda8-267152d0d67e" />
  <img width="200" alt="Image" src="https://github.com/user-attachments/assets/f903be62-a05c-414b-9627-22e28c52fd59" />
  <img width="200" alt="Image" src="https://github.com/user-attachments/assets/aae16b80-2d53-4748-b51d-8f22ffd5485d" />
  <img width="200" alt="Image" src="https://github.com/user-attachments/assets/d15f5ad7-af2e-4324-9b3f-76fcfc34eecd" />
  <img width="200" alt="Image" src="https://github.com/user-attachments/assets/5e127d85-b7c9-49df-b782-1e6ee2311a9c" />
  <img width="200" alt="Image" src="https://github.com/user-attachments/assets/e54e5e17-a660-4ae7-8762-4c83101afbfc" />
  <img width="200" alt="Image" src="https://github.com/user-attachments/assets/538687a0-17cc-464a-8f25-6cdec0fde376" />
  <img width="200" alt="Image" src="https://github.com/user-attachments/assets/62b80c4d-6f7d-417a-ad06-a8aa91f21810" />
</p>

---

## 🎥 Demo Video

[![Watch Demo](https://img.youtube.com/vi/QEeKqaQeDL8/0.jpg)](https://youtu.be/QEeKqaQeDL8?si=Avu-8oPHo0Bh5y7I)

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
