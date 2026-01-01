# JudgeEase: Hackathon Evaluation App

JudgeEase is a web application designed to streamline the judging process for hackathons. It provides a clean, intuitive interface for judges to evaluate team projects against a predefined set of criteria, track their progress, and view live team rankings.

The application is built with a modern tech stack, ensuring a responsive and real-time experience for judges.

## ✨ Features

- **Anonymous Authentication**: Judges can start evaluating immediately with a seamless, anonymous login.
- **Personalized Experience**: Judges can set their name, which is reflected in the UI.
- **Evaluation Dashboard**: A central hub to view all teams, their evaluation status, and overall progress.
- **Detailed Evaluation Page**: Each team has a dedicated page with sliders for each criterion, making scoring quick and intuitive. A clickable number scale is also provided for easy input.
- **Real-time Local Saves**: All scoring progress is automatically saved to the browser's local storage, preventing data loss.
- **Manual Submission**: Judges have full control over when to submit their final scores to the backend. The app clearly indicates which evaluations have unsubmitted changes.
- **Live Team Rankings**: A dedicated tab shows a live leaderboard of teams based on the average scores from all judges. The top presentation score is highlighted.
- **Responsive Design**: The UI is fully responsive and works seamlessly on desktops, tablets, and mobile devices.
- **Light & Dark Mode**: A theme toggler allows judges to switch between light and dark modes for their comfort.

## 🚀 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (with App Router)
- **UI Library**: [React](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
- **Backend & Database**: [Firebase](https://firebase.google.com/) (Authentication & Firestore)
- **AI Integration**: [Genkit](https://firebase.google.com/docs/genkit) (for potential future AI features)
- **State Management**: React Hooks & Context API

## ⚙️ Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js (v18 or later recommended)
- npm or yarn

### Installation

1.  **Clone the repository:**
    ```sh
    git clone <your-repository-url>
    cd <repository-folder>
    ```

2.  **Install NPM packages:**
    ```sh
    npm install
    ```

3.  **Set up Firebase:**
    - Create a new Firebase project at [console.firebase.google.com](https://console.firebase.google.com/).
    - In your project settings, add a new Web App.
    - Copy the `firebaseConfig` object.
    - Rename `.env.example` to `.env` and paste your Firebase configuration into it.
    - In the Firebase console, go to **Firestore Database** and create a new database in Test Mode to allow initial reads and writes.
    - Go to **Authentication** > **Sign-in method** and enable the **Anonymous** provider.

4.  **Run the development server:**
    ```sh
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📁 Project Structure

- `src/app/`: Contains the main pages of the application using Next.js App Router.
  - `(pages)`: Route groups for different sections of the app.
  - `layout.tsx`: The root layout for the application.
  - `page.tsx`: The main dashboard page.
- `src/components/`: Shared React components used across the application.
  - `ui/`: Core UI components from ShadCN.
- `src/hooks/`: Custom React hooks for managing application state and logic (e.g., `useEvaluations`, `useRankings`).
- `src/firebase/`: Firebase configuration, providers, and custom hooks for interacting with Firebase services.
- `src/lib/`: Contains static data (`data.ts`), type definitions (`types.ts`), and utility functions.
- `firestore.rules`: Security rules for the Firestore database, defining access control for the different data collections.
