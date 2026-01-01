

'use client';

import { useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ChevronLeft, ChevronRight, Save, ShieldAlert, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { SiteHeader } from '@/components/SiteHeader';
import { teams, criteria } from '@/lib/data';
import { useEvaluations } from '@/hooks/use-evaluations.tsx';
import type { Criterion } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CardContent } from '@/components/ui/card';

export default function EvaluationPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const team = teams.find((t) => t.id === id);
  const teamIndex = teams.findIndex((t) => t.id === id);
  const prevTeam = teamIndex > 0 ? teams[teamIndex - 1] : null;
  const nextTeam = teamIndex < teams.length - 1 ? teams[teamIndex + 1] : null;

  const { getEvaluation, updateEvaluation, savingStatus, isInitialized, submitSingle, isSubmittingSingle, hasLocalChanges, isNewEvaluation } = useEvaluations();
  
  const currentEvaluation = getEvaluation(id);

  const teamColors: { [key: string]: string } = {
    "Error404": "#FF3131",
    "The Diva's": "#FF00FF",
    "Debug Diaries": "#FF69B4",
    "HelloWorld": "#00FFFF",
    "MindForge": "#BF00FF",
    "BugSlayer": "#39FF14",
    "Big Three": "#FFA500"
  };
  
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
    // When the page for a team is visited, we ensure all criteria are initialized.
    // This marks the evaluation as "started" and ensures all criteria are tracked.
    if (isInitialized && id) {
      const existingEval = getEvaluation(id);
      
      const initialTouched = { ...existingEval.touched };
      let hasChanged = false;
      criteria.forEach(c => {
        if (initialTouched[c.id] === undefined) {
          initialTouched[c.id] = false;
          hasChanged = true;
        }
      });
      if(hasChanged) {
        updateEvaluation(id, { touched: initialTouched });
      }
    }
  }, [isInitialized, id, getEvaluation, updateEvaluation]);


  if (!team) {
    // This should be caught by Next.js notFound() in a real app if data fetching was used
    return <div>Team not found</div>
  }
  
  const handleSubmit = async () => {
    await submitSingle(team.id);
  }

  if (!isInitialized || !currentEvaluation) {
    return (
       <div className="flex flex-col min-h-screen">
        <SiteHeader />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-muted-foreground">Loading evaluation...</div>
        </div>
      </div>
    )
  }

  const handleScoreChange = (criterionId: string, value: number[]) => {
    const newScores = { ...currentEvaluation.scores, [criterionId]: value[0] };
    const newTouched = { ...currentEvaluation.touched, [criterionId]: true };
    updateEvaluation(team.id, { scores: newScores, touched: newTouched });
  };

  const handleCommentsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newComments = e.target.value;
    updateEvaluation(team.id, { comments: newComments });
  };
  
  const calculateCategoryScore = (scores: { [criterionId: string]: number }, categoryCriteria: Criterion[]) => {
    return categoryCriteria.reduce((total, crit) => total + (scores[crit.id] || 0), 0);
  };
  
  const calculateCategoryMaxScore = (categoryCriteria: Criterion[]) => {
    return categoryCriteria.reduce((total, crit) => total + crit.maxScore, 0);
  }

  const savingIndicator = {
    saving: { text: "Saving...", icon: <Save className="h-4 w-4 animate-spin" />, color: "text-muted-foreground" },
    saved: { text: "Saved", icon: <Save className="h-4 w-4" />, color: "text-primary" },
    idle: { text: "", icon: null, color: "" },
  }[savingStatus];

  const totalScore = Object.values(currentEvaluation.scores).reduce((sum, score) => sum + (score || 0), 0);
  const totalMaxScore = criteria.reduce((sum, crit) => sum + crit.maxScore, 0);

  const isBrandNew = isNewEvaluation(currentEvaluation);
  const showUnsubmittedWarning = hasLocalChanges(currentEvaluation) && !isBrandNew;
  const isSubmitting = isSubmittingSingle[team.id];
  const accentColor = teamColors[team.name.trim()] || 'hsl(var(--border))';


  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-1 container mx-auto p-4 md:p-8">
        <div className="relative">
          {showUnsubmittedWarning && !isSubmitting && (
            <div className="fixed top-[70px] z-50">
              <div className="max-w-4xl mx-auto">
                <Alert variant="default" className="bg-yellow-50 border-yellow-200 text-yellow-800 shadow-lg">
                    <ShieldAlert className="h-4 w-4 !text-yellow-600" />
                    <AlertTitle className="font-semibold">Unsubmitted Changes</AlertTitle>
                    <AlertDescription className="flex items-center justify-between">
                        Your latest changes are not yet saved to the database.
                        <Button
                            variant="outline"
                            size="sm"
                            className="ml-2 h-auto py-0.5 px-2 text-xs bg-yellow-100 hover:bg-yellow-200 text-yellow-900 border-yellow-300"
                            onClick={handleSubmit}
                            disabled={isSubmittingSingle[team.id]}
                        >
                            {isSubmittingSingle[team.id] ? <Loader2 className="h-3 w-3 animate-spin" /> : "Submit Now"}
                        </Button>
                    </AlertDescription>
                </Alert>
              </div>
            </div>
          )}
          <div className="max-w-4xl mx-auto space-y-8 relative z-0">
            <Card>
              <CardHeader 
                style={{ borderLeft: `5px solid ${accentColor}` }}
              >
                <CardTitle className="text-3xl">{team.name}</CardTitle>
                <CardDescription>{team.members.join(', ')}</CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex flex-wrap justify-between items-baseline gap-4">
                  <CardTitle>Evaluation</CardTitle>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-muted-foreground">Total Score:</span>
                    <Badge variant="secondary" className="text-lg font-bold">{totalScore} / {totalMaxScore}</Badge>
                  </div>
                </div>
                <CardDescription className="pt-2">Rate the team for each criterion.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {isSubmitting ? (
                  <div className="flex flex-col items-center justify-center gap-4 py-16">
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                      <p className="text-muted-foreground">Submitting evaluation...</p>
                  </div>
                ) : (
                  <>
                    <Accordion type="multiple" defaultValue={Object.keys(criteriaByCategory)} className="w-full space-y-4">
                      {Object.entries(criteriaByCategory).map(([category, crits]) => {
                        const categoryScore = calculateCategoryScore(currentEvaluation.scores, crits);
                        const categoryMaxScore = calculateCategoryMaxScore(crits);
                        return (
                        <AccordionItem value={category} key={category} className="border rounded-lg">
                          <AccordionTrigger className="px-4 py-3 text-lg font-semibold hover:no-underline">
                            <div className="flex flex-col md:flex-row justify-between w-full items-start md:items-center pr-2">
                              <span>{category}</span>
                              <Badge variant={categoryScore > 0 ? "default" : "secondary"} className="mt-2 md:mt-0">
                                {categoryScore} / {categoryMaxScore}
                              </Badge>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="px-4 border-t">
                            <div className="space-y-8 pt-6">
                              {crits.map((criterion) => {
                                const currentScore = currentEvaluation?.scores[criterion.id] ?? 0;
                                const savedScore = currentEvaluation?.firestoreState?.scores[criterion.id] ?? 0;
                                const hasChanged = currentEvaluation?.firestoreState && currentScore !== savedScore;

                                return (
                                <div key={criterion.id} className="space-y-3">
                                  <div className="flex justify-between items-baseline gap-4 flex-wrap">
                                    <Label htmlFor={criterion.id} className="text-base font-semibold shrink-0">{criterion.name}</Label>
                                    <span className={cn(
                                      "text-lg font-bold text-right whitespace-nowrap",
                                      hasChanged ? "text-yellow-600" : "text-primary"
                                    )}>
                                      {currentScore} / {criterion.maxScore}
                                    </span>
                                  </div>
                                  <p className="text-sm text-muted-foreground">{criterion.description}</p>
                                  <div className="grid gap-2 pt-2">
                                      <Slider
                                        id={criterion.id}
                                        min={0}
                                        max={criterion.maxScore}
                                        step={1}
                                        value={[currentScore]}
                                        onValueChange={(value) => handleScoreChange(criterion.id, value)}
                                        variant={hasChanged ? 'warning' : 'default'}
                                      />
                                      <div className="flex justify-between mt-2">
                                        {Array.from({ length: criterion.maxScore + 1 }).map((_, i) => (
                                          <div
                                            key={i}
                                            className={cn(
                                              "cursor-pointer text-xs text-muted-foreground w-6",
                                              i === 0 ? "text-left" : 
                                              i === criterion.maxScore ? "text-right" : "text-center"
                                            )}
                                            onClick={() => handleScoreChange(criterion.id, [i])}
                                          >
                                            {i}
                                          </div>
                                        ))}
                                      </div>
                                  </div>
                                </div>
                              )})}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      )})}
                    </Accordion>
                    <div className="space-y-2 pt-4">
                      <Label htmlFor="comments" className="text-xl font-semibold">Comments</Label>
                      <Textarea
                        id="comments"
                        placeholder="Provide any additional feedback here..."
                        value={currentEvaluation?.comments || ''}
                        onChange={handleCommentsChange}
                        rows={5}
                      />
                    </div>
                    <div className={cn("flex items-center gap-2 h-6 transition-opacity", savingIndicator.color, savingStatus === 'idle' ? 'opacity-0' : 'opacity-100')}>
                      {savingIndicator.icon}
                      <span className="text-sm font-medium">{savingIndicator.text}</span>
                    </div>

                    {isBrandNew && (
                      <div className="pt-6 border-t mt-6">
                        <Button
                          size="lg"
                          className="w-full bg-accent hover:bg-accent/90"
                          onClick={handleSubmit}
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}
                          Submit Evaluation
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
            
            <div className="flex justify-between items-center">
              <Button asChild variant="outline" disabled={!prevTeam}>
                <Link href={prevTeam ? `/teams/${prevTeam.id}` : '#'}>
                  <ChevronLeft className="mr-2 h-4 w-4" /> Previous Team
                </Link>
              </Button>
              <Button asChild variant="outline" disabled={!nextTeam}>
                <Link href={nextTeam ? `/teams/${nextTeam.id}` : '#'}>
                  Next Team <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
    

    



    

    

    
