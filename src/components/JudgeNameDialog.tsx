'use client';

import { useState, useEffect } from 'react';
import { useFirebase } from '@/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export function JudgeNameDialog() {
  const { user, firestore } = useFirebase();
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    async function checkJudgeName() {
      if (user && firestore) {
        setIsChecking(true);
        try {
          const judgeRef = doc(firestore, 'judges', user.uid);
          // Small delay to ensure the doc is created by the login function
          setTimeout(async () => {
             const docSnap = await getDoc(judgeRef);
            if (docSnap.exists()) {
              const data = docSnap.data();
              if (!data.name || data.name === 'Anonymous Judge') {
                setIsOpen(true);
              }
            } else {
              // This can happen on first login if getDoc runs before setDoc
              setIsOpen(true);
            }
            setIsChecking(false);
          }, 1000);
        } catch (error) {
          console.error("Error checking judge's name:", error);
          setIsChecking(false);
        }
      } else {
        setIsChecking(false);
      }
    }
    checkJudgeName();
  }, [user, firestore]);

  const handleSave = async () => {
    if (!user || !firestore || !name.trim()) return;

    setIsSaving(true);
    try {
      const judgeRef = doc(firestore, 'judges', user.uid);
      await setDoc(judgeRef, { name: name.trim() }, { merge: true });
      setIsOpen(false);
    } catch (error) {
      console.error("Error saving judge's name:", error);
      // Optionally show a toast error
    } finally {
      setIsSaving(false);
    }
  };
  
  if (isChecking) {
    return null; // Don't render anything while checking
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
            onChange={(e) => setName(e.target.value)}
            placeholder="Your Name"
            className="col-span-3"
          />
        </div>
        <DialogFooter>
          <Button onClick={handleSave} disabled={isSaving || !name.trim()}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Name
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
