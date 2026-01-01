

'use client';

import Link from 'next/link';
import { CheckCircle2, Circle, ListTodo, AlertTriangle, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { SiteHeader } from '@/components/SiteHeader';
import { useEvaluations } from '@/hooks/use-evaluations';
import { teams, criteria } from '@/lib/data';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TeamRankings } from '@/components/TeamRankings';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { cn } from '@/lib/utils';
import { GlobalSubmit } from '@/components/GlobalSubmit';


function EvaluationDashboard() {
  const {
    evaluations,
    isComplete,
    getPendingCriteria,
    totalCompleted,
    getEvaluation,
    submitSingle,
    isSubmittingSingle,
    hasLocalChanges,
    isInitialized,
    pendingChangesCount,
    submitAll,
    isSubmittingAll,
    discardAllChanges,
  } = useEvaluations();

  if (!isInitialized) {
     return (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      );
  }

  const progress = totalCompleted > 0 ? (totalCompleted / teams.length) * 100 : 0;
  const totalMaxScore = criteria.reduce((sum, crit) => sum + crit.maxScore, 0);

  return (
    <>
      <GlobalSubmit 
        pendingChangesCount={pendingChangesCount}
        submitAll={submitAll}
        isSubmittingAll={isSubmittingAll}
        isInitialized={isInitialized}
        discardAllChanges={discardAllChanges}
      />
      <div className="space-y-4 mb-8">
        <p className="text-muted-foreground">
          Evaluate each team based on the provided criteria. Your progress is saved automatically.
        </p>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-muted-foreground">Overall Progress</span>
            <span className="text-sm font-medium">
              {totalCompleted} / {teams.length} Teams Evaluated
            </span>
          </div>
          <Progress value={progress} />
        </div>
      </div>

      <TooltipProvider>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {teams.map((team) => {
              const evaluation = getEvaluation(team.id);
              const teamIsComplete = isComplete(team.id);
              const pendingCriteria = getPendingCriteria(team.id);
              const totalScore = Object.values(evaluation.scores).reduce((sum, score) => sum + (score || 0), 0);
              const showChangesWarning = hasLocalChanges(evaluation);
              const hasStarted = Object.values(evaluation.touched || {}).some(t => t);
              
              return (
                <Card key={team.id} className="h-full flex flex-col transition-all hover:shadow-lg">
                  <Link href={`/teams/${team.id}`} className="block flex-grow" passHref>
                    <div className="flex flex-col h-full">
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <span className="flex items-center gap-2">{team.name}</span>
                          {teamIsComplete ? (
                            <CheckCircle2 className="h-6 w-6 text-green-500" />
                          ) : (
                            <Circle className="h-6 w-6 text-muted-foreground" />
                          )}
                        </CardTitle>
                        <CardDescription>{team.members.join(', ')}</CardDescription>
                      </CardHeader>
                      <CardContent className="flex-grow space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-semibold">Your Score:</span>
                            <Badge 
                              variant={totalScore > 0 ? "default" : "secondary"}
                              className={cn(showChangesWarning  && 'bg-yellow-400 text-yellow-900')}
                            >
                              {totalScore} / {totalMaxScore}
                            </Badge>
                        </div>
                        {!teamIsComplete && hasStarted && pendingCriteria.length > 0 && (
                          <>
                            <Separator />
                            <div className="space-y-2 pt-4">
                              <h4 className="text-sm font-semibold flex items-center gap-2">
                                <ListTodo className="h-4 w-4 text-muted-foreground" />
                                Pending Items
                              </h4>
                              <ul className="text-xs text-muted-foreground list-disc pl-4 space-y-1">
                                {pendingCriteria.map(c => <li key={c.id}>{c.name}</li>)}
                              </ul>
                            </div>
                          </>
                        )}
                      </CardContent>
                    </div>
                  </Link>
                  
                  <div className="px-6 pb-2 pt-0 mt-auto">
                    {showChangesWarning  && (
                        <div className="pb-4">
                          <Alert variant="default" className="bg-yellow-50 border-yellow-200 text-yellow-800 p-3">
                            <AlertTriangle className="h-4 w-4 !text-yellow-600" />
                             <AlertDescription className="!pl-7 text-xs flex items-center justify-between">
                              You have unsubmitted changes.
                               <Button
                                variant="outline"
                                size="sm"
                                className="ml-2 h-auto py-0.5 px-2 text-xs bg-yellow-100 hover:bg-yellow-200 text-yellow-900 border-yellow-300"
                                onClick={() => submitSingle(team.id)}
                                disabled={isSubmittingSingle[team.id]}
                              >
                                {isSubmittingSingle[team.id] ? <Loader2 className="h-3 w-3 animate-spin"/> : "Submit Now"}
                              </Button>
                            </AlertDescription>
                          </Alert>
                        </div>
                      )}

                    <CardFooter className="p-0">
                       <Link href={`/teams/${team.id}`} className="w-full">
                          <Button variant={teamIsComplete ? 'secondary' : 'default'} className="w-full">
                            {teamIsComplete ? 'View/Edit Submitted' : 'Start Evaluation'}
                          </Button>
                       </Link>
                    </CardFooter>
                  </div>
                </Card>
              )})}
        </div>
      </TooltipProvider>
    </>
  );
}

// The main page component now owns the state from the hook.
export default function DashboardPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-1 container mx-auto p-4 md:p-8">
        <h1 className="text-3xl font-bold tracking-tight mb-8">JudgeEase Dashboard</h1>
        <Tabs defaultValue="evaluations">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="evaluations">My Evaluations</TabsTrigger>
            <TabsTrigger value="rankings">Team Rankings</TabsTrigger>
          </TabsList>
          <TabsContent value="evaluations">
            <EvaluationDashboard />
          </TabsContent>
          <TabsContent value="rankings">
            <TeamRankings />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
