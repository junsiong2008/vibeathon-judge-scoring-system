

'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from './use-toast';
import type { Evaluation, Criterion } from '@/lib/types';
import { teams, criteria } from '@/lib/data';
import { useFirebase } from '@/firebase';
import { collection, doc, serverTimestamp, writeBatch, query, where, onSnapshot, getDocs } from 'firebase/firestore';
import { CheckCircle2 } from 'lucide-react';

const LOCAL_STORAGE_KEY_PREFIX = 'judgeEaseEvaluations_';

type SavingStatus = 'idle' | 'saving' | 'saved';

export function useEvaluations() {
  const { firestore, user } = useFirebase();
  const LOCAL_STORAGE_KEY = user ? `${LOCAL_STORAGE_KEY_PREFIX}${user.uid}` : '';

  const [evaluations, setEvaluations] = useState<Record<string, Evaluation>>({});
  const [firestoreDocIds, setFirestoreDocIds] = useState<Record<string, string>>({});
  const [isInitialized, setIsInitialized] = useState(false);
  const [savingStatus, setSavingStatus] = useState<SavingStatus>('idle');
  const [isSubmittingSingle, setIsSubmittingSingle] = useState<Record<string, boolean>>({});
  const [isSubmittingAll, setIsSubmittingAll] = useState(false);
  const [refetchCounter, setRefetchCounter] = useState(0);
  const router = useRouter();
  const { toast } = useToast();
  const discardVersionRef = useRef(0);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const getInitialEvaluation = useCallback((teamId: string): Evaluation => {
    const initialScores: { [criterionId: string]: number } = {};
    const initialTouched: { [criterionId: string]: boolean } = {};
    criteria.forEach(c => {
      initialScores[c.id] = 0;
      initialTouched[c.id] = false;
    });
    return {
      teamId,
      scores: initialScores,
      comments: '',
      touched: initialTouched,
    };
  }, []);

  useEffect(() => {
    if (!user || !firestore || !LOCAL_STORAGE_KEY) {
      if (!isInitialized) {
        const localEvalsJSON = typeof window !== 'undefined' ? localStorage.getItem(LOCAL_STORAGE_KEY) : null;
        const localEvals = localEvalsJSON ? JSON.parse(localEvalsJSON) : {};
        const initialEvals = teams.reduce((acc, team) => {
          acc[team.id] = localEvals[team.id] || getInitialEvaluation(team.id);
          return acc;
        }, {} as Record<string, Evaluation>);
        setEvaluations(initialEvals);
        setIsInitialized(true);
      }
      return;
    };

    const evaluationsCollection = collection(firestore, 'evaluations');
    const q = query(evaluationsCollection, where('judgeId', '==', user.uid));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const firestoreEvals: Record<string, Evaluation> = {};
      const docIds: Record<string, string> = {};

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.teamId) {
          const resolvedData = {
            ...data,
            submissionTime: data.submissionTime?.toDate ? data.submissionTime.toDate().toISOString() : data.submissionTime,
          }
          firestoreEvals[data.teamId] = resolvedData as Evaluation;
          docIds[data.teamId] = doc.id;
        }
      });
      setFirestoreDocIds(docIds);

      // Load from local storage once to merge with firestore data
      const localEvalsJSON = typeof window !== 'undefined' ? localStorage.getItem(LOCAL_STORAGE_KEY) : null;
      const localEvals = localEvalsJSON ? JSON.parse(localEvalsJSON) : {};
      const discardVersion = discardVersionRef.current;

      setEvaluations(() => {
        const newEvals: Record<string, Evaluation> = {};
        teams.forEach(team => {
          const teamId = team.id;
          const firestoreEval = firestoreEvals[teamId];
          const localEval = localEvals[teamId];

          let finalEval = getInitialEvaluation(teamId);

          if (firestoreEval) {
            // Hydrate firestore state with defaults so baseline comparison is valid
            const hydratedFirestoreEval = { ...getInitialEvaluation(teamId), ...firestoreEval };
            finalEval = { ...finalEval, ...hydratedFirestoreEval, firestoreState: hydratedFirestoreEval };
          }

          if (localEval) {
            const hasLocalChangesAfterFirestoreUpdate =
              !areScoresEqual(localEval.scores, firestoreEval?.scores) ||
              localEval.comments !== (firestoreEval?.comments || '');

            if (hasLocalChangesAfterFirestoreUpdate || !firestoreEval) {
              finalEval = {
                ...finalEval,
                scores: { ...finalEval.scores, ...localEval.scores },
                comments: localEval.comments !== undefined ? localEval.comments : finalEval.comments,
                touched: { ...finalEval.touched, ...localEval.touched },
              };
            }
          }
          newEvals[teamId] = finalEval;
        });
        return newEvals;
      });

      setIsInitialized(true);

    }, (error) => {
      console.error("Failed to listen to Firestore data", error);
      const localEvalsJSON = localStorage.getItem(LOCAL_STORAGE_KEY);
      const localEvals = localEvalsJSON ? JSON.parse(localEvalsJSON) : {};
      const initialEvals = teams.reduce((acc, team) => {
        acc[team.id] = localEvals[team.id] || getInitialEvaluation(team.id);
        return acc;
      }, {} as Record<string, Evaluation>);
      setEvaluations(initialEvals);
      setIsInitialized(true);
    });

    return () => unsubscribe();
  }, [firestore, user, getInitialEvaluation, LOCAL_STORAGE_KEY, refetchCounter]);


  useEffect(() => {
    if (!isInitialized || Object.keys(evaluations).length === 0 || !LOCAL_STORAGE_KEY) return;

    const evalsToSave = Object.entries(evaluations).reduce((acc, [key, value]) => {
      const { firestoreState, ...rest } = value;
      acc[key] = rest;
      return acc;
    }, {} as Record<string, Omit<Evaluation, 'firestoreState'>>);


    setSavingStatus('saving');
    // Clear any existing timer to avoid multiple schedules
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(evalsToSave));
        setSavingStatus('saved');
        const resetTimer = setTimeout(() => setSavingStatus('idle'), 2000);
        return () => clearTimeout(resetTimer);
      } catch (error) {
        console.error("Failed to save evaluations to localStorage", error);
        setSavingStatus('idle');
      }
    }, 1000);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [evaluations, isInitialized, LOCAL_STORAGE_KEY]);

  const getEvaluation = useCallback((teamId: string): Evaluation => {
    return evaluations[teamId] || getInitialEvaluation(teamId);
  }, [evaluations, getInitialEvaluation]);

  const updateEvaluation = useCallback((teamId: string, updates: Partial<Evaluation>) => {
    setEvaluations(prev => {
      const existingEval = prev[teamId] || getInitialEvaluation(teamId);

      const newEvaluation = {
        ...existingEval,
        ...updates,
        scores: { ...existingEval.scores, ...updates.scores },
        touched: { ...existingEval.touched, ...updates.touched },
      };

      return {
        ...prev,
        [teamId]: newEvaluation,
      }
    });
  }, [getInitialEvaluation]);

  const isComplete = useCallback((teamId: string): boolean => {
    const evaluation = evaluations[teamId];
    return !!evaluation?.submissionTime;
  }, [evaluations]);

  const getPendingCriteria = useCallback((teamId: string): Criterion[] => {
    const evaluation = evaluations[teamId];
    if (!evaluation || !evaluation.touched) return criteria;

    const allCriteriaMet = criteria.every(criterion => evaluation.touched?.[criterion.id]);
    if (allCriteriaMet) return [];

    return criteria.filter(criterion => !evaluation.touched?.[criterion.id]);
  }, [evaluations]);

  const totalCompleted = useMemo(() => {
    return Object.values(evaluations).filter(evaluation => !!evaluation.submissionTime).length;
  }, [evaluations]);

  const areScoresEqual = (s1: Record<string, number> | undefined, s2: Record<string, number> | undefined) => {
    const o1 = s1 || {};
    const o2 = s2 || {};
    // Compare all known criteria. Treat undefined/null as 0.
    return criteria.every(c => (o1[c.id] || 0) === (o2[c.id] || 0));
  };

  const hasLocalChanges = useCallback((evaluation: Evaluation) => {
    if (!evaluation) return false;

    const isPristine =
      !Object.values(evaluation.scores || {}).some(s => s > 0) &&
      !evaluation.comments &&
      !Object.values(evaluation.touched || {}).some(t => t === true);

    if (!evaluation.firestoreState) {
      return !isPristine;
    }

    if (isPristine && !evaluation.submissionTime) {
      return false;
    }

    const scoresChanged = !areScoresEqual(evaluation.scores, evaluation.firestoreState.scores);
    const commentsChanged = (evaluation.comments || '') !== (evaluation.firestoreState.comments || '');

    if (scoresChanged || commentsChanged) {
      console.log(`[debug] hasLocalChanges true for ${evaluation.teamId}`, {
        scoresChanged,
        commentsChanged,
        currentScores: evaluation.scores,
        fsScores: evaluation.firestoreState.scores,
        currentComments: evaluation.comments,
        fsComments: evaluation.firestoreState.comments
      });
    }

    return scoresChanged || commentsChanged;

  }, []);

  const isNewEvaluation = useCallback((evaluation: Evaluation) => {
    if (!evaluation) return true;
    return !evaluation.firestoreState;
  }, []);

  const pendingChangesCount = useMemo(() => {
    if (!isInitialized) return 0;
    return Object.values(evaluations).filter(e => hasLocalChanges(e)).length;
  }, [evaluations, isInitialized, hasLocalChanges]);


  const submitSingle = async (teamId: string): Promise<void> => {
    if (!firestore || !user) {
      toast({ title: "Error", description: "You must be signed in.", variant: "destructive" });
      return Promise.reject(new Error("User not signed in"));
    }

    const evaluation = evaluations[teamId];
    if (!evaluation) {
      toast({ title: "Error", description: "Evaluation not found.", variant: "destructive" });
      return Promise.reject(new Error("Evaluation not found"));
    }

    setIsSubmittingSingle(prev => ({ ...prev, [teamId]: true }));

    try {
      const evaluationsCollection = collection(firestore, 'evaluations');
      const docId = firestoreDocIds[teamId];
      const { firestoreState, ...dataToSubmit } = evaluation;

      const submissionData = {
        ...dataToSubmit,
        judgeId: user.uid,
        submissionTime: serverTimestamp(),
      };

      const docRef = docId ? doc(evaluationsCollection, docId) : doc(evaluationsCollection);

      await writeBatch(firestore).set(docRef, submissionData, { merge: true }).commit();

      toast({
        title: (
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            <span>Evaluation submitted!</span>
          </div>
        ),
        description: `Your scores for ${teams.find(t => t.id === teamId)?.name} have been saved.`,
        variant: "default"
      });
      return Promise.resolve();

    } catch (error: any) {
      console.error("Failed to submit evaluation", error);
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: "Could not submit evaluation. " + error.message,
      });
      return Promise.reject(error);
    } finally {
      setIsSubmittingSingle(prev => ({ ...prev, [teamId]: false }));
    }
  };


  const submitAll = async () => {
    if (!firestore || !user) {
      toast({
        title: "Error",
        description: "You must be signed in to submit evaluations.",
        variant: "destructive",
      });
      return;
    }

    const evalsWithChanges = Object.values(evaluations).filter(e => hasLocalChanges(e));

    if (evalsWithChanges.length === 0) {
      toast({
        title: "No Changes",
        description: "There are no unsubmitted changes to save.",
      });
      return;
    }

    setIsSubmittingAll(true);

    try {
      const batch = writeBatch(firestore);
      const evaluationsCollection = collection(firestore, 'evaluations');

      for (const evaluation of evalsWithChanges) {
        const docId = firestoreDocIds[evaluation.teamId];
        const { firestoreState, ...dataToSubmit } = evaluation;

        const submissionData = {
          ...dataToSubmit,
          judgeId: user.uid,
          submissionTime: serverTimestamp(),
        };

        const docRef = docId ? doc(evaluationsCollection, docId) : doc(evaluationsCollection);
        batch.set(docRef, submissionData, { merge: true });
      }

      await batch.commit();

      toast({
        title: (
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            <span>Success!</span>
          </div>
        ),
        description: `${evalsWithChanges.length} evaluation(s) have been submitted.`,
        variant: "default"
      });

    } catch (error: any) {
      console.error("Failed to submit evaluations", error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Could not submit evaluations. " + error.message,
      });
    } finally {
      setIsSubmittingAll(false);
    }
  };

  const discardAllChanges = async () => {
    // 1. Cancel any pending auto-save immediately
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = null;
    }

    if (LOCAL_STORAGE_KEY) {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }

    // 2. Trigger a full reset of the hook's lifecycle
    // This will cause the UI to unmount (show loading spinner) and then remount when data arrives.
    setIsInitialized(false);
    setEvaluations({}); // Clear state immediately

    // Incrementing this triggers the main useEffect to re-run, establishing a fresh subscription
    // which will pull the latest server state (ignoring local storage since we cleared it).
    setRefetchCounter(prev => prev + 1);

    toast({
      title: 'Changes Discarded',
      description: 'Reloading latest data from server...',
    });
  };

  return {
    evaluations,
    isInitialized,
    savingStatus,
    getEvaluation,
    updateEvaluation,
    isComplete,
    totalCompleted,
    pendingChangesCount,
    getPendingCriteria,
    submitAll,
    isSubmittingAll,
    submitSingle,
    isSubmittingSingle,
    hasLocalChanges,
    isNewEvaluation,
    discardAllChanges,
  };
}
