
'use client';

import { useEffect, useState } from 'react';
import { useFirebase } from '@/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from './ui/skeleton';
import { User, Copy } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';

export function UserProfile() {
  const { user, firestore, isUserLoading } = useFirebase();
  const [judgeName, setJudgeName] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (user && firestore) {
      const judgeRef = doc(firestore, 'judges', user.uid);
      const unsubscribe = onSnapshot(judgeRef, (doc) => {
        if (doc.exists()) {
          setJudgeName(doc.data().name || 'Anonymous Judge');
        } else {
          setJudgeName('Anonymous Judge');
        }
      }, () => {
        // Handle error case if needed
        setJudgeName('Anonymous Judge');
      });

      return () => unsubscribe();
    } else {
      setJudgeName(null);
    }
  }, [user, firestore]);

  const handleCopy = () => {
    if (user?.uid) {
      navigator.clipboard.writeText(user.uid);
      toast({
        title: "Copied!",
        description: "Your Judge ID has been copied to the clipboard.",
      });
    }
  }

  if (isUserLoading || (user && judgeName === null)) {
    return (
      <div className="flex items-center space-x-4">
        <div className="space-y-2 text-right">
          <Skeleton className="h-4 w-[100px]" />
        </div>
        <Skeleton className="h-10 w-10 rounded-full" />
      </div>
    );
  }

  if (!user) {
    return null; // Don't show anything if not logged in
  }

  const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length > 1) {
      return names[0][0] + names[names.length - 1][0];
    }
    return name.substring(0, 2);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="flex items-center gap-4 rounded-full p-1 transition-colors hover:bg-muted">
          <div className="text-right hidden sm:block">
            <p className="font-semibold text-sm">{judgeName || 'Judge'}</p>
          </div>
          <Avatar>
            <AvatarFallback>
              {judgeName ? getInitials(judgeName) : <User className="h-5 w-5" />}
            </AvatarFallback>
          </Avatar>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto">
        <div className="space-y-2">
            <h4 className="font-medium leading-none">Judge ID</h4>
            <p className="text-sm text-muted-foreground">
              This is your unique identifier.
            </p>
        </div>
        <div className="flex items-center space-x-2 pt-4">
            <p className="text-xs font-mono text-muted-foreground bg-secondary px-2 py-1 rounded-md">
              {user.uid}
            </p>
            <Button variant="outline" size="icon" className="h-7 w-7" onClick={handleCopy}>
              <Copy className="h-4 w-4" />
              <span className="sr-only">Copy UID</span>
            </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
