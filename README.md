# Chat Application

This is a real-time chat application built using React, Firebase, and Redux. It allows users to sign up, log in, send and receive messages, and manage their chats.

## Table of Contents

1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Libraries Used](#libraries-used)
4. [Getting Started](#getting-started)
5. [Folder Structure](#folder-structure)
6. [Recent Updates](#recent-updates)

## Features

- User Authentication (Sign Up, Log In)
- Real-time Messaging
- Emoji Picker Integration
- File and Media Uploads
- Audio Message Recording and Playback
- User Profile Management
- Chat Search
- Contact List Management
- Online Status and Last Seen

## Tech Stack

- **Frontend**: React, Redux, Material Tailwind
- **Backend**: Firebase (Authentication, Firestore, Storage)
- **Deployment**: Vite

## Libraries Used

- `react`: For building the user interface
- `redux`: For state management
- `react-redux`: To connect React components with Redux
- `firebase`: For backend services
- `material-tailwind`: For UI components
- `react-icons`: For iconography
- `emoji-picker-react`: For emoji selection
- `wavesurfer.js`: For audio waveform visualization

## Getting Started

1. **Clone the repository:**
   ```sh
   git clone [https://github.com/your-username/chat-app.git](https://github.com/eric-muganga/SignalShift.git)
   cd SignalShit

2. **Install dependencies:**
   ```sh
   npm install

3. **Create a .env file in the root directory and add your Firebase configuration:**
   ```plaintext
   VITE_API_KEY=your-api-key
   VITE_AUTH_DOMAIN=your-auth-domain
   VITE_PROJECT_ID=your-project-id
   VITE_STORAGE_BUCKET=your-storage-bucket
   VITE_MESSAGING_SENDER_ID=your-messaging-sender-id
   VITE_APP_ID=your-app-id

4. **Run the application:**
   ```sh
   npm run dev
