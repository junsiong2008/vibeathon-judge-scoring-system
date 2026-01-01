
'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Loader2, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface GlobalSubmitProps {
  pendingChangesCount: number;
  submitAll: () => Promise<void>;
  isSubmittingAll: boolean;
  isInitialized: boolean;
  discardAllChanges: () => Promise<void>;
}

export function GlobalSubmit({ 
  pendingChangesCount, 
  submitAll, 
  isSubmittingAll, 
  isInitialized, 
  discardAllChanges 
}: GlobalSubmitProps) {
  if (!isInitialized || pendingChangesCount === 0) {
    return null;
  }

  return (
    <div className="mb-6">
      <Alert className="bg-yellow-50 border-yellow-200 text-yellow-900">
        <AlertTriangle className="h-5 w-5 !text-yellow-500" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ml-8">
          <div>
            <AlertTitle className="font-bold">You have unsubmitted changes!</AlertTitle>
            <AlertDescription>
              {pendingChangesCount} team evaluation(s) have changes that are not saved.
            </AlertDescription>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 self-end md:self-center w-full sm:w-auto">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" className="bg-transparent hover:bg-yellow-100 border-yellow-300">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Discard All
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will discard all of your local, unsubmitted changes for {pendingChangesCount} team(s). This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={discardAllChanges} className="bg-destructive hover:bg-destructive/90">
                    Yes, Discard Changes
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <Button
              onClick={submitAll}
              disabled={isSubmittingAll}
              variant="outline"
              className="bg-yellow-100 hover:bg-yellow-200 border-yellow-300"
            >
              {isSubmittingAll ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Submit All Pending
            </Button>
          </div>
        </div>
      </Alert>
    </div>
  );
}
