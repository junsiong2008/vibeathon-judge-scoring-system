'use client';

import { useMemo } from 'react';
import { useRankings } from '@/hooks/use-rankings';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Trophy, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function TeamRankings() {
  const { rankings, isLoading, error } = useRankings();

  const maxPresentationScore = useMemo(() => {
    if (!rankings || rankings.length === 0) {
      return 0;
    }
    return Math.max(...rankings.map(r => r.presentationScore));
  }, [rankings]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Team Rankings
          </CardTitle>
          <CardDescription>Live leaderboard based on scores from all judges.</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-64">
           <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">Could not load team rankings. {error.message}</p>
        </CardContent>
      </Card>
    );
  }

  if (!rankings || rankings.length === 0) {
    return (
       <Card>
        <CardHeader>
          <CardTitle>Team Rankings</CardTitle>
          <CardDescription>Live leaderboard based on scores from all judges.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No evaluations have been submitted yet. Rankings will appear here as judges submit their scores.</p>
        </CardContent>
      </Card>
    )
  }

  const getTrophyColor = (rank: number) => {
    if (rank === 0) return 'text-yellow-500';
    if (rank === 1) return 'text-gray-400';
    if (rank === 2) return 'text-yellow-700';
    return 'text-muted-foreground';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            Team Rankings
            {isLoading && <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />}
        </CardTitle>
        <CardDescription>Live leaderboard based on scores from all judges.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">Rank</TableHead>
              <TableHead>Team</TableHead>
              <TableHead className="text-right">Avg. Score</TableHead>
              <TableHead className="text-right">Presentation Score</TableHead>
              <TableHead className="text-right">Total Score</TableHead>
              <TableHead className="text-right">Judges</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rankings.map((team, index) => (
              <TableRow key={team.teamId}>
                <TableCell className="font-bold text-lg text-center">
                  <div className="flex items-center justify-center gap-2">
                    {index < 3 ? <Trophy className={`w-6 h-6 ${getTrophyColor(index)}`} /> : <span>{index + 1}</span>}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-medium">{team.teamName}</div>
                  <div className="text-sm text-muted-foreground">{team.teamMembers.join(', ')}</div>
                </TableCell>
                <TableCell className="text-right">
                  <Badge variant="secondary" className="text-base">{team.averageScore.toFixed(2)}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Badge 
                    variant="outline"
                    className={cn(team.presentationScore === maxPresentationScore && team.presentationScore > 0 && "text-green-500 border-green-500")}
                  >
                    {team.presentationScore.toFixed(2)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-mono">{team.totalScore}</TableCell>
                <TableCell className="text-right font-mono">{team.judgeCount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
