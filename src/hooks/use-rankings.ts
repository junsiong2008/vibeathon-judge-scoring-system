'use client';

import { useMemo } from 'react';
import { collection } from 'firebase/firestore';
import { useCollection, useFirebase } from '@/firebase';
import { teams, criteria } from '@/lib/data';
import type { Evaluation, Team } from '@/lib/types';

export interface TeamRanking {
  teamId: string;
  teamName: string;
  teamMembers: string[];
  totalScore: number;
  judgeCount: number;
  averageScore: number;
  presentationScore: number;
}

export function useRankings() {
  const { firestore } = useFirebase();

  const evaluationsCollection = useMemoFirebase(
    () => (firestore ? collection(firestore, 'evaluations') : null),
    [firestore]
  );

  const { data: evaluations, isLoading, error } = useCollection<Evaluation & { judgeId: string; submissionTime: any }>(evaluationsCollection);

  const rankings = useMemo((): TeamRanking[] | null => {
    if (!evaluations) {
      return null;
    }

    const presentationCriteriaIds = criteria
      .filter(c => c.category === 'Presentation & Story')
      .map(c => c.id);

    const scoresByTeam = evaluations.reduce((acc, evaluation) => {
      const teamId = evaluation.teamId;
      if (!acc[teamId]) {
        acc[teamId] = {
          totalScore: 0,
          judgeCount: 0,
          totalPresentationScore: 0,
        };
      }

      const evaluationScore = Object.values(evaluation.scores).reduce(
        (sum, score) => sum + score,
        0
      );

      const presentationScore = presentationCriteriaIds.reduce((sum, critId) => {
        return sum + (evaluation.scores[critId] || 0);
      }, 0);
      
      acc[teamId].totalScore += evaluationScore;
      acc[teamId].judgeCount += 1;
      acc[teamId].totalPresentationScore += presentationScore;

      return acc;
    }, {} as Record<string, { totalScore: number; judgeCount: number; totalPresentationScore: number }>);
    
    const rankedTeams = Object.entries(scoresByTeam)
      .map(([teamId, data]) => {
        const teamInfo = teams.find((t) => t.id === teamId);
        return {
          teamId,
          teamName: teamInfo?.name || 'Unknown Team',
          teamMembers: teamInfo?.members || [],
          totalScore: data.totalScore,
          judgeCount: data.judgeCount,
          averageScore: data.totalScore / data.judgeCount,
          presentationScore: data.totalPresentationScore / data.judgeCount,
        };
      })
      .sort((a, b) => b.averageScore - a.averageScore);

    return rankedTeams;

  }, [evaluations]);

  return { rankings, isLoading, error };
}

// Helper hook for memoizing a Firestore query/reference.
// This is a simplified version, you might want a more robust one in a real app.
import { useMemo as useReactMemo } from 'react';

function useMemoFirebase<T>(factory: () => T, deps: any[]): T {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const memoized = useReactMemo(factory, deps);
    if(typeof memoized === 'object' && memoized !== null) {
      (memoized as any).__memo = true;
    }
    return memoized;
}
