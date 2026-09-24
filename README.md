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

## 🎯 Reusing This App for a New Hackathon

This app was originally built for a specific event. Teams, scoring criteria, and branding are **hardcoded in source files**, not stored in a database or admin panel. To reuse it for a different hackathon, edit the files below and redeploy. Nothing here requires touching Firestore data directly — `teams` and `criteria` are just TypeScript arrays baked into the app.

### 1. Point at your own Firebase project

- Follow the [Getting Started](#-getting-started) steps to create a Firebase project and enable **Anonymous** (and optionally **Email/Password**) sign-in.
- Update `src/firebase/config.ts` with your project's web app config.
- Update `studio.json`'s `firebaseProjectId` to match (used by Firebase Studio tooling).
- If using the Firebase CLI, run `firebase use --add` to create a `.firebaserc` pointing at your project, then deploy the rules:
  ```sh
  firebase deploy --only firestore:rules
  ```

### 2. Update the list of teams

Edit the `teams` array in [`src/lib/data.ts`](src/lib/data.ts). Each team needs:

```ts
{
  id: '1',                  // unique, stable ID — used as the Firestore doc key for scoring
  name: 'Team Name',
  members: ['Member One', 'Member Two'],
  description: '',
  imageUrl: '...',           // optional cover image, falls back to a placeholder
  imageHint: '...',
}
```

Keep `id` values unique and don't reuse an old team's `id` for a new team once judging has started — evaluations are keyed by `teamId`, so reusing an ID will mix scores from different events/teams together.

### 3. Update the scoring criteria

Edit the `criteria` array in the same file, [`src/lib/data.ts`](src/lib/data.ts):

```ts
{
  id: 'unique-criterion-id',
  name: 'Criterion Name',
  description: 'What the judge is scoring here.',
  maxScore: 5,
  category: 'Category Name',   // criteria are grouped into accordion sections by this field
}
```

- Criteria are grouped on the evaluation page by `category`, so criteria sharing a category name will appear together.
- `maxScore` drives the slider's range on the evaluation page and the max total shown per category.
- If you change criterion `id`s or remove criteria **after** judging has started, previously submitted scores for the old IDs won't map to anything new — plan criteria before judging begins, or be prepared for a fresh start.

### 4. Update team accent colors (optional)

`src/app/teams/[id]/page.tsx` has a `teamColors` map keyed by team name, used to color-code each team's evaluation page:

```ts
const teamColors: { [key: string]: string } = {
  "Error404": "#FF3131",
  ...
};
```

Update the keys to match your new team names (or delete entries — teams without a match just fall back to the default border color).

### 5. Update branding

- `src/components/VibeAThonLogo.tsx`: replace with your own event's logo/wordmark component, and swap its usage in `src/components/SiteHeader.tsx` if you rename the component.
- `src/assets/vibe-a-thon.png`: replace with your event's image asset, if referenced.
- `metadata.json` / page `<title>` in `src/app/layout.tsx`: update the app name shown in the browser tab and metadata.

### 6. Review Firestore security rules

`firestore.rules` enforces that judges can only read/write their own evaluations and judge profile. You generally won't need to change this for a new event, but double check it still matches your data model if you add new fields or collections.

### What you *don't* need to touch

- `evaluations` and `judges` Firestore collections are created automatically as judges sign in and submit scores — no manual seeding required.
- Rankings (`src/hooks/use-rankings.ts`) automatically recompute from whatever teams/criteria you define — no separate config for the leaderboard.
