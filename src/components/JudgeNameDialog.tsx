'use client';

import { useState, useEffect } from 'react';
import { useFirebase } from '@/firebase';
import { doc, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

const MIN_NAME_LENGTH = 2;

function isValidName(name: string | undefined | null): boolean {
  return !!name && name.trim().length >= MIN_NAME_LENGTH && name.trim() !== 'Anonymous Judge';
}

export function JudgeNameDialog() {
  const { user, firestore } = useFirebase();
  const [name, setName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [saveError, setSaveError] = useState<string | null>(null);
  // needsName is the single source of truth for whether the judge must be
  // prompted. It stays true (gating the app) until Firestore confirms a
  // valid, persisted name — never based on a timer or a one-shot read.
  const [needsName, setNeedsName] = useState(false);

  useEffect(() => {
    if (!user || !firestore) {
      setIsChecking(false);
      setNeedsName(false);
      return;
    }

    setIsChecking(true);
    const judgeRef = doc(firestore, 'judges', user.uid);

    // Reactive listener: reacts the moment the doc is created/updated,
    // regardless of how long anonymous sign-in's background write takes.
    const unsubscribe = onSnapshot(
      judgeRef,
      (docSnap) => {
        const data = docSnap.data();
        setNeedsName(!isValidName(data?.name));
        setIsChecking(false);
      },
      (error) => {
        console.error("Error checking judge's name:", error);
        setIsChecking(false);
      }
    );

    return () => unsubscribe();
  }, [user, firestore]);

  const handleSave = async () => {
    const trimmed = name.trim();
    if (!user || !firestore || !isValidName(trimmed)) {
      setSaveError(`Please enter a name (at least ${MIN_NAME_LENGTH} characters).`);
      return;
    }

    setSaveError(null);
    setIsSaving(true);
    try {
      const judgeRef = doc(firestore, 'judges', user.uid);
      // Always include id/email/createdAt so a valid, complete judge doc
      // exists even if the anonymous sign-in flow's own write hasn't
      // finished yet (merge:true preserves them if they already exist).
      await setDoc(
        judgeRef,
        {
          id: user.uid,
          name: trimmed,
          email: user.email ?? `${user.uid}@anonymous.judge`,
          createdAt: serverTimestamp(),
        },
        { merge: true }
      );
      // Do NOT close locally here — the onSnapshot listener above will flip
      // needsName to false only once Firestore confirms the write, which is
      // what actually lets the user proceed.
    } catch (error) {
      console.error("Error saving judge's name:", error);
      setSaveError("Couldn't save your name. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isChecking) {
    return null; // Don't render anything while checking
  }

  return (
    <Dialog open={needsName} onOpenChange={() => { /* no-op: dialog can only be dismissed by a successful save */ }}>
      <DialogContent className="sm:max-w-[425px]" onInteractOutside={(e) => e.preventDefault()} onEscapeKeyDown={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Welcome, Judge!</DialogTitle>
          <DialogDescription>
            Please enter your name to personalize your judging experience.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Input
            id="name"
            value={name}
            onChange={(e) => { setName(e.target.value); setSaveError(null); }}
            onKeyDown={(e) => { if (e.key === 'Enter' && !isSaving) handleSave(); }}
            placeholder="Your Name"
            className="col-span-3"
            autoFocus
          />
          {saveError && <p className="text-sm text-destructive">{saveError}</p>}
        </div>
        <DialogFooter>
          <Button onClick={handleSave} disabled={isSaving || !isValidName(name)}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Name
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
