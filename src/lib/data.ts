import type { Criterion, Team } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export const criteria: Criterion[] = [
  { id: 'user-journey-pain-point', name: 'Follow the User Journey', description: 'Does it solve a real pain point for the user?', maxScore: 5, category: 'Following User Journey' },
  { id: 'user-journey-creativity', name: 'User Journey Creativity', description: 'Is the solution a fresh, clever take on the problem?', maxScore: 5, category: 'Following User Journey' },
  { id: 'design-flow-logic', name: 'User Flow & Logic', description: 'Is the navigation seamless and intuitive?', maxScore: 5, category: 'Solution Design & Features' },
  { id: 'design-feature-completeness', name: 'Feature Completeness', description: 'Did they build the core "must-have" features?', maxScore: 5, category: 'Solution Design & Features' },
  { id: 'design-wow-factor', name: 'The "Wow-factor”', description: 'Does it look/feel amazing? (UI/UX polish/Innovation).', maxScore: 10, category: 'Solution Design & Features' },
  { id: 'design-scalability', name: 'Scalability', description: 'Is the design/logic robust enough for the future?', maxScore: 5, category: 'Solution Design & Features' },
  { id: 'maturity-functional-build', name: 'Functional Build', description: 'Does the product works as intended? (Not a mockup).', maxScore: 15, category: 'Solution Maturity' },
  { id: 'ai-design-dev', name: 'AI in Design/Dev', description: 'Was AI used to accelerate UI creation or coding?', maxScore: 5, category: 'AI Element' },
  { id: 'ai-implementation', name: 'AI Implementation', description: 'Does the final app have a working AI feature?', maxScore: 10, category: 'AI Element' },
  { id: 'presentation-problem-framing', name: 'Problem Framing', description: 'Is the "Why" clear and the problem well-defined?', maxScore: 5, category: 'Presentation & Story' },
  { id: 'presentation-narrative', name: 'Narrative & Story', description: 'Was the pitch engaging and easy to follow?', maxScore: 5, category: 'Presentation & Story' },
  { id: 'presentation-demo-quality', name: 'Demo Quality', description: 'Did the live demo run smoothly without crashing?', maxScore: 5, category: 'Presentation & Story' },
  { id: 'value-creation-potential', name: 'Potential Value Creation', description: 'Does the solution create value in either of the following ways: increase growth or revenue / improve customer experience / reduce cost?', maxScore: 5, category: 'Value Creation' },
  { id: 'value-creation-risk-avoidance', name: 'Risk Avoidance / Reduction', description: 'Is the solution risk-averse, with features to identify, prevent, and mitigate potential risks (including security and safety considerations)?', maxScore: 5, category: 'Value Creation' },
];

const teamImages = PlaceHolderImages;

export const teams: Team[] = [
  {
    id: '1',
    name: 'Error404',
    members: ['Noor Alina binti Mohd.Noh', 'Julia Nurfadhilah Mohamad Fauzi', 'Zulfathi Imran bin Hanafi'],
    description: '',
    imageUrl: teamImages.find(img => img.id === '4')?.imageUrl || `https://picsum.photos/seed/104/600/400`,
    imageHint: teamImages.find(img => img.id === '4')?.imageHint || 'eco packaging',
  },
  {
    id: '2',
    name: ' The Diva\'s',
    members: ['Nadzirah binti Ahmadi', 'Fasehah Binti Haris', 'Nurelahajaraha binti Mahamed Ramly'],
    description: '',
    imageUrl: teamImages.find(img => img.id === '3')?.imageUrl || `https://picsum.photos/seed/103/600/400`,
    imageHint: teamImages.find(img => img.id === '3')?.imageHint || 'vr interface',
  },
  {
    id: '3',
    name: 'Debug Diaries',
    members: ['Nazatul Amalia binti Abu Safian', 'Nur Aqilah Husna binti Ahmad', 'Nur Hani Sofi Iman binti Hanafi'],
    description: '',
    imageUrl: teamImages.find(img => img.id === '5')?.imageUrl || `https://picsum.photos/seed/105/600/400`,
    imageHint: teamImages.find(img => img.id === '5')?.imageHint || 'language app',
  },
  {
    id: '4',
    name: 'HelloWorld',
    members: ['Mohd Nor Syaaban bin Othman', 'Nur Nabilah binti Mohamad Zaki', 'Nadia Zaheera binti Zahrol'],
    description: '',
    imageUrl: teamImages.find(img => img.id === '5')?.imageUrl || `https://picsum.photos/seed/105/600/400`,
    imageHint: teamImages.find(img => img.id === '5')?.imageHint || 'language app',
  },
  {
    id: '5',
    name: 'MindForge',
    members: ['Muhammad Afnan Nadzran bin Mohd Fazlee', 'Nur Khairunnisa binti Ariffin', 'Muhammad Hafiz bin Khairol Nassuha'],
    description: '',
    imageUrl: teamImages.find(img => img.id === '5')?.imageUrl || `https://picsum.photos/seed/105/600/400`,
    imageHint: teamImages.find(img => img.id === '5')?.imageHint || 'language app',
  },

  {
    id: '6',
    name: 'BugSlayer',
    members: ['Mohammad Azrulnizam bin Kamaludin', 'Sushalt John William', 'Amirul Haziq bin Mohd Zaruwi'],
    description: '.',
    imageUrl: teamImages.find(img => img.id === '2')?.imageUrl || `https://picsum.photos/seed/102/600/400`,
    imageHint: teamImages.find(img => img.id === '2')?.imageHint || 'blockchain diagram',
  },
  {
    id: '7',
    name: 'Big Three',
    members: ['Danish Al-Muhaimin bin Mustaffa', 'Mohammad Ikhwan bin Mohd Kamarudin', 'Luqman Harriz bin Saifullizan'],
    description: '',
    imageUrl: teamImages.find(img => img.id === '1')?.imageUrl || `https://picsum.photos/seed/101/600/400`,
    imageHint: teamImages.find(img => img.id === '1')?.imageHint || 'plant technology',
  }
];
