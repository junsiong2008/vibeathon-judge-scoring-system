

'use client';

import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { useFirebase, useAuth } from '@/firebase';
import { initiateAnonymousSignIn } from '@/firebase/non-blocking-login';
import { useEffect } from 'react';
import { JudgeNameDialog } from '@/components/JudgeNameDialog';
import { ThemeProvider } from '@/components/theme-provider';

function AppContent({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useFirebase();
  const auth = useAuth();

  useEffect(() => {
    if (!user && !isUserLoading && auth) {
      initiateAnonymousSignIn(auth);
    }
  }, [user, isUserLoading, auth]);

  return (
    <>
      {isUserLoading ? (
         <div className="flex h-screen items-center justify-center">
          <div className="text-muted-foreground">Authenticating...</div>
        </div>
      ) : (
        <>
          {user && <JudgeNameDialog />}
          {children}
        </>
      )}
      <Toaster />
    </>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet" />
        <title>JudgeEase</title>
        <meta name="description" content="Streamlined evaluation for hackathon judges." />
      </head>
      <body className="font-body antialiased min-h-screen">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <FirebaseClientProvider>
            <AppContent>{children}</AppContent>
          </FirebaseClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
