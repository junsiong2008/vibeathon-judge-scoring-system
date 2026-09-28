import type { Criterion, Team } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export const criteria: Criterion[] = [
  { id: 'problem-understanding-definition', name: 'Problem Definition', description: 'Is the operational pain point clearly defined and supported by a real use case?', maxScore: 5, category: 'Problem Understanding & Relevance' },
  { id: 'problem-understanding-relevance', name: 'Operations Centre Relevance', description: 'Is the problem relevant to the monitoring activities and responsibilities of the Operations Centre?', maxScore: 5, category: 'Problem Understanding & Relevance' },
  { id: 'problem-understanding-workflow', name: 'User & Workflow Understanding', description: 'Does the team demonstrate a clear understanding of the users, existing workflow and current limitations?', maxScore: 5, category: 'Problem Understanding & Relevance' },
  { id: 'opt-impact-effectiveness', name: 'Operational Effectiveness', description: 'Does the solution improve monitoring effectiveness, visibility, or decision-making?', maxScore: 5, category: 'Operational Impact & Value' },
  { id: 'opt-impact-improvement', name: 'Efficiency Improvement', description: 'Can the solution reduce manual work, response time, repetitive tasks, or human dependency?', maxScore: 5, category: 'Operational Impact & Value' },
  { id: 'opt-impact-financial', name: 'Financial Impact & Cost Saving', description: 'Does the solution demonstrate measurable cost savings, cost avoidance or productivity gains supported by reasonable assumptions?', maxScore: 5, category: 'Operational Impact & Value' },
  { id: 'solution-design-logic', name: 'Solution Logic & User Flow', description: 'Is the end-to-end process clear, logical and easy to follow?', maxScore: 5, category: 'Solution Design & Usability' },
  { id: 'solution-design-features', name: 'Feature Relevance', description: 'Does the solution include the essential features required to address the problem?', maxScore: 5, category: 'Solution Design & Usability' },
  { id: 'solution-design-ux', name: 'User Experience', description: 'Is the dashboard, interface or output clear, intuitive, and practical for operational users?', maxScore: 5, category: 'Solution Design & Usability' },
  { id: 'ai-data-purposeful', name: 'Purposeful AI Implementation', description: 'Is AI meaningfully applied to solve the problem rather than being included only as an additional feature?', maxScore: 5, category: 'AI & Data Application' },
  { id: 'ai-data-quality', name: 'Data Quality & Analytical Logic', description: 'Are the data sources, analytical methods, assumptions, and outputs appropriate and reliable?', maxScore: 5, category: 'AI & Data Application' },
  { id: 'ai-data-governance', name: 'Responsible AI, Security & Governance', description: 'Does the solution consider data security, access control, privacy, explainability and potential AI errors?', maxScore: 5, category: 'AI & Data Application' },
  { id: 'prototype-functional', name: 'Functional Prototype', description: 'Does the prototype work as intended and demonstrate the proposed core functions?', maxScore: 5, category: 'Prototype Maturity & Technical Feasibility' },
  { id: 'prototype-reliability', name: 'Reliability & Integration Feasibility', description: 'Is the solution technically realistic, sufficiently reliable, and capable of integration with the existing environment?', maxScore: 5, category: 'Prototype Maturity & Technical Feasibility' },
  { id: 'innovation-approach', name: 'Innovation', description: 'Does the solution introduce a fresh, intelligent, or improved approach compared with the current process?', maxScore: 5, category: 'Innovation & Scalability' },
  { id: 'innovation-scalability', name: 'Scalability & Sustainability', description: 'Can the solution be expanded, maintained and adopted for other systems, teams or operational use cases?', maxScore: 5, category: 'Innovation & Scalability' },
  { id: 'presentation-storytelling', name: 'Storytelling & Delivery', description: 'Are the problem and solution narratives clear, concise, and convincing?', maxScore: 5, category: 'Presentation & Story' },
  { id: 'presentation-demo-quality', name: 'Demo Quality', description: 'Is the demonstration clear, smooth and able to prove the solution\'s key functions?', maxScore: 5, category: 'Presentation & Story' },
  { id: 'presentation-visual', name: 'Visual Communication', description: 'Are the slides, dashboard and supporting visuals clear, professional and easy to understand?', maxScore: 5, category: 'Presentation & Story' },
  { id: 'presentation-qa', name: 'Q&A and Solution Defence', description: 'Can the team answer questions confidently and justify its decisions, assumptions and solution limitations?', maxScore: 5, category: 'Presentation & Story' },
];

const teamImages = PlaceHolderImages;

export const teams: Team[] = [
  {
    id: '1',
    name: ' NeuralOPS',
    members: ['Nurfarehan Binti Mohd Safie', 'Nur Shakira bt. Che Ismail', 'Muhamad Hafizuddin Muhamad',
        'Hafizah Syafiqah Binti Harum','Muhammad Najmi bin Yahya', 'Muhammad Aizat Syamim Bin Ismail'],
    description: 'Application Monitoring Clinic',
    imageUrl: teamImages.find(img => img.id === '4')?.imageUrl || `https://picsum.photos/seed/104/600/400`,
    imageHint: teamImages.find(img => img.id === '4')?.imageHint || 'eco packaging',
  },
  {
    id: '2',
    name: ' HyperCore',
    members: ['Muhammad Sufiyan Bin Sapar', 'Muhammad Izzuddin b. Ali', 'Mohd Nazri bin Nohani',
        'Norazwan Hanib', 'Ismail', 'Muhammad Adam Bin Hadzrin Aznal'],
    description: 'AI for Data Center',
    imageUrl: teamImages.find(img => img.id === '3')?.imageUrl || `https://picsum.photos/seed/103/600/400`,
    imageHint: teamImages.find(img => img.id === '3')?.imageHint || 'vr interface',
  },
  {
    id: '3',
    name: 'PulseAI',
    members: ['Noor Fadzlynda Bt Abdullah Ali', 'Siti Noor Adibah Binti Ismail', 'Muhammad Sahrizan bin Sahari',
        'Muhammad Asraf b. Samsudin', 'Muhammad Zamani Bin Ismail', 'Mohammad Faiz bin Mohamed Salim' ],
    description: 'NOC360 InsightHub',
    imageUrl: teamImages.find(img => img.id === '5')?.imageUrl || `https://picsum.photos/seed/105/600/400`,
    imageHint: teamImages.find(img => img.id === '5')?.imageHint || 'language app',
  },
  {
    id: '4',
    name: 'IntervalEdge',
    members: ['Nur Azlin Farida binti Abdul Hamid', 'Alyaa Natasha Binti Ahmad', 'Wan Zafirah Binti M. Zain',
        'Ahmad Haziq bin Zamir Ambia', 'Muhammad Amir Hamzah bin Muhammad Fauzi', 'Nor Hanisah Binti Mohd Bahrin'],
    description: 'SmartOps AI for AMI',
    imageUrl: teamImages.find(img => img.id === '5')?.imageUrl || `https://picsum.photos/seed/105/600/400`,
    imageHint: teamImages.find(img => img.id === '5')?.imageHint || 'language app',
  },
  {
    id: '5',
    name: 'NetRonix',
    members: ['Najidiy Hazri bin Abd Razak', 'Nurul Hidayah bt. Azmi', 'Meor Muhamad Aiman b. Mohd Arifin', 'Haiman Bin Azam',
        'Mohd Hanis bin Mohd Sani', 'Mohd Asri bin Hasim'],
    description: 'NetRonix Nexus',
    imageUrl: teamImages.find(img => img.id === '5')?.imageUrl || `https://picsum.photos/seed/105/600/400`,
    imageHint: teamImages.find(img => img.id === '5')?.imageHint || 'language app',
  },

  {
    id: '6',
    name: 'ByteForce',
    members: ['Noor Fadhilah binti Mokhtar Din', 'Mohamed Faiz b. Amanullah', 'Nur Nabihah Binti Azman', 'Muhammad Haziq Faqih b. Abdul Hadi',
        'Muhammad Farhan b. Feshol', 'Muhammad Nazmi Haq bin Ahmad Badaruddin'],
    description: 'AI-Driven Daily Tracker & Root Cause Assistant',
    imageUrl: teamImages.find(img => img.id === '2')?.imageUrl || `https://picsum.photos/seed/102/600/400`,
    imageHint: teamImages.find(img => img.id === '2')?.imageHint || 'blockchain diagram',
  }
];
