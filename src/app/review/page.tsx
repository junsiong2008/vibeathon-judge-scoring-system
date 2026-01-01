'use client';

import { useMemo, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useEvaluations } from '@/hooks/use-evaluations.tsx';
import { teams, criteria } from '@/lib/data';
import { SiteHeader } from '@/components/SiteHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import type { Criterion } from '@/lib/types';

export default function ReviewPage() {
  const { evaluations, totalCompleted, submitAll, isInitialized } = useEvaluations();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // An evaluation is ready for review if it's complete, even if not submitted
  const reviewableTeams = useMemo(() => {
    return teams.filter(team => {
      const evaluation = evaluations[team.id];
      if (!evaluation) return false;
      return criteria.every(criterion => evaluation.touched?.[criterion.id]);
    });
  }, [evaluations]);
  
  const allCompleted = reviewableTeams.length === teams.length;

  const criteriaByCategory = useMemo(() => {
    return criteria.reduce((acc, criterion) => {
      if (!acc[criterion.category]) {
        acc[criterion.category] = [];
      }
      acc[criterion.category].push(criterion);
      return acc;
    }, {} as Record<string, Criterion[]>);
  }, []);

  useEffect(() => {
    if (isInitialized && reviewableTeams.length === 0) {
      router.push('/');
    }
  }, [isInitialized, reviewableTeams, router]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await submitAll();
    // No need to set isSubmitting to false, as the hook will trigger a reload
  }
  
  if (!isInitialized || reviewableTeams.length === 0) {
     return (
       <div className="flex flex-col min-h-screen">
        <SiteHeader />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-muted-foreground">Loading reviews...</div>
        </div>
      </div>
    )
  }
  
  const calculateCategoryScore = (scores: { [criterionId: string]: number }, categoryCriteria: Criterion[]) => {
    return categoryCriteria.reduce((total, crit) => total + (scores[crit.id] || 0), 0);
  };
  
  const calculateCategoryMaxScore = (categoryCriteria: Criterion[]) => {
    return categoryCriteria.reduce((total, crit) => total + crit.maxScore, 0);
  }

  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-1 container mx-auto p-4 md:p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Review & Submit</h1>
            <p className="text-muted-foreground">
              Please review your evaluations for all teams before submitting. This action is final.
            </p>
          </div>

          {!allCompleted && (
             <Alert variant="destructive">
              <Terminal className="h-4 w-4" />
              <AlertTitle>Incomplete Evaluations</AlertTitle>
              <AlertDescription>
                You must evaluate all teams before you can submit.
              </AlertDescription>
            </Alert>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Evaluation Summary</CardTitle>
              <CardDescription>{reviewableTeams.length} of {teams.length} teams ready for submission.</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {reviewableTeams.map((team) => {
                  const evaluation = evaluations[team.id];
                  if (!evaluation) return null;

                  const totalScore = Object.values(evaluation.scores).reduce((sum, score) => sum + score, 0);
                  const totalMaxScore = criteria.reduce((sum, crit) => sum + crit.maxScore, 0);

                  return (
                    <AccordionItem value={team.id} key={team.id}>
                      <AccordionTrigger>
                        <div className="flex justify-between w-full pr-4">
                          <span className="font-semibold text-lg">{team.name}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground text-sm">Total Score:</span>
                            <Badge variant="secondary" className="text-base">{totalScore} / {totalMaxScore}</Badge>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-6 pt-4">
                         {Object.entries(criteriaByCategory).map(([category, crits]) => (
                          <div key={category}>
                            <div className="flex justify-between items-center mb-2">
                               <h4 className="font-semibold">{category}</h4>
                               <Badge variant="outline">
                                {calculateCategoryScore(evaluation.scores, crits)} / {calculateCategoryMaxScore(crits)}
                               </Badge>
                            </div>
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Criterion</TableHead>
                                  <TableHead className="text-right">Score</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {crits.map((criterion) => (
                                  <TableRow key={criterion.id}>
                                    <TableCell className="font-medium">{criterion.name}</TableCell>
                                    <TableCell className="text-right">
                                      <span className="font-bold text-primary">{evaluation.scores[criterion.id] || 0}</span>
                                      <span className="text-muted-foreground"> / {criterion.maxScore}</span>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                         ))}
                        {evaluation.comments && (
                           <div className="pt-4">
                            <h4 className="font-semibold mb-2">Comments</h4>
                            <p className="text-sm text-muted-foreground bg-secondary p-3 rounded-md border">{evaluation.comments}</p>
                           </div>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </CardContent>
          </Card>
          
          <div className="flex justify-end">
            <Button size="lg" onClick={handleSubmit} disabled={isSubmitting || !allCompleted} className="bg-accent hover:bg-accent/90 text-accent-foreground">
              {isSubmitting ? 'Submitting...' : 'Submit Final Evaluations'}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
