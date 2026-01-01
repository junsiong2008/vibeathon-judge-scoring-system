export interface Criterion {
  id: string;
  name: string;
  description: string;
  maxScore: number;
  category: string;
}

export interface Team {
  id: string;
  name: string;
  members: string[];
  description: string;
  imageUrl: string;
  imageHint: string;
}

export interface Evaluation {
  teamId: string;
  scores: { [criterionId: string]: number };
  comments: string;
  touched?: { [criterionId: string]: boolean };
  submissionTime?: any; // Can be a server timestamp
  firestoreState?: Evaluation; // The state of the evaluation as it is in firestore
  judgeId?: string; // Add judgeId to the type
}
