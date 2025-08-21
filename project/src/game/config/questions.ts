import { Question, Subject } from '../../types';

const MATH_QUESTIONS: Question[] = [
  {
    id: 'math_1',
    subject: 'Math',
    difficulty: 'easy',
    prompt: 'What is 15 + 27?',
    options: ['42', '41', '43', '40'],
    answerIndex: 0,
    solution: '15 + 27 = 42. Add the ones place (5+7=12) and tens place (1+2+1=4).',
    hintType: 'compass',
    nextClue: 'Look for the treasure that sparkles near water.'
  },
  {
    id: 'math_2',
    subject: 'Math',
    difficulty: 'easy',
    prompt: 'What is 8 × 7?',
    options: ['54', '56', '58', '52'],
    answerIndex: 1,
    solution: '8 × 7 = 56. Think of it as 8 groups of 7.',
    hintType: 'riddle',
    nextClue: 'Where shadows dance and leaves whisper secrets.'
  },
  {
    id: 'math_3',
    subject: 'Math',
    difficulty: 'medium',
    prompt: 'If a triangle has angles of 60° and 70°, what is the third angle?',
    options: ['50°', '40°', '60°', '45°'],
    answerIndex: 0,
    solution: 'All triangle angles sum to 180°. 180° - 60° - 70° = 50°.',
    hintType: 'glow',
    nextClue: 'The path lights up where ancient stones rest.'
  },
  {
    id: 'math_4',
    subject: 'Math',
    difficulty: 'medium',
    prompt: 'What is 144 ÷ 12?',
    options: ['11', '12', '13', '10'],
    answerIndex: 1,
    solution: '144 ÷ 12 = 12. Think: 12 × 12 = 144.',
    hintType: 'map',
    nextClue: 'Check the northern clearing on your map.'
  },
  {
    id: 'math_5',
    subject: 'Math',
    difficulty: 'hard',
    prompt: 'What is the square root of 169?',
    options: ['12', '13', '14', '11'],
    answerIndex: 1,
    solution: '√169 = 13, because 13 × 13 = 169.',
    hintType: 'compass',
    nextClue: 'Follow the arrow to where the sun sets.'
  }
];

const SCIENCE_QUESTIONS: Question[] = [
  {
    id: 'science_1',
    subject: 'Science',
    difficulty: 'easy',
    prompt: 'What gas do plants absorb from the atmosphere during photosynthesis?',
    options: ['Oxygen', 'Carbon Dioxide', 'Nitrogen', 'Hydrogen'],
    answerIndex: 1,
    solution: 'Plants absorb carbon dioxide (CO₂) and release oxygen during photosynthesis.',
    hintType: 'riddle',
    nextClue: 'Where green life flourishes and oxygen flows.'
  },
  {
    id: 'science_2',
    subject: 'Science',
    difficulty: 'easy',
    prompt: 'How many bones are in an adult human body?',
    options: ['196', '206', '216', '186'],
    answerIndex: 1,
    solution: 'Adult humans have 206 bones, while babies are born with about 270.',
    hintType: 'glow',
    nextClue: 'The treasure glows near the place of rest.'
  },
  {
    id: 'science_3',
    subject: 'Science',
    difficulty: 'medium',
    prompt: 'What is the chemical symbol for gold?',
    options: ['Go', 'Au', 'Gd', 'Ag'],
    answerIndex: 1,
    solution: 'Gold\'s symbol is Au, from the Latin word "aurum" meaning gold.',
    hintType: 'map',
    nextClue: 'The map reveals treasure in the eastern caves.'
  },
  {
    id: 'science_4',
    subject: 'Science',
    difficulty: 'medium',
    prompt: 'Which planet is closest to the Sun?',
    options: ['Venus', 'Earth', 'Mercury', 'Mars'],
    answerIndex: 2,
    solution: 'Mercury is the closest planet to the Sun, with temperatures reaching 800°F.',
    hintType: 'compass',
    nextClue: 'Head toward the brightest star in the sky.'
  },
  {
    id: 'science_5',
    subject: 'Science',
    difficulty: 'hard',
    prompt: 'What is the powerhouse of the cell?',
    options: ['Nucleus', 'Ribosome', 'Mitochondria', 'Endoplasmic Reticulum'],
    answerIndex: 2,
    solution: 'Mitochondria produce ATP (energy) for the cell, earning the nickname "powerhouse".',
    hintType: 'riddle',
    nextClue: 'Where energy flows and life powers on.'
  }
];

const GK_QUESTIONS: Question[] = [
  {
    id: 'gk_1',
    subject: 'GK',
    difficulty: 'easy',
    prompt: 'What is the capital of France?',
    options: ['London', 'Berlin', 'Paris', 'Rome'],
    answerIndex: 2,
    solution: 'Paris is the capital and largest city of France.',
    hintType: 'map',
    nextClue: 'Look for the treasure near the tallest structure.'
  },
  {
    id: 'gk_2',
    subject: 'GK',
    difficulty: 'easy',
    prompt: 'Which ocean is the largest?',
    options: ['Atlantic', 'Pacific', 'Indian', 'Arctic'],
    answerIndex: 1,
    solution: 'The Pacific Ocean covers about one-third of Earth\'s surface.',
    hintType: 'glow',
    nextClue: 'The path glows where water meets land.'
  },
  {
    id: 'gk_3',
    subject: 'GK',
    difficulty: 'medium',
    prompt: 'Who painted the Mona Lisa?',
    options: ['Picasso', 'Van Gogh', 'Leonardo da Vinci', 'Michelangelo'],
    answerIndex: 2,
    solution: 'Leonardo da Vinci painted the Mona Lisa between 1503-1519.',
    hintType: 'riddle',
    nextClue: 'Where art and beauty create eternal smiles.'
  },
  {
    id: 'gk_4',
    subject: 'GK',
    difficulty: 'medium',
    prompt: 'What is the longest river in the world?',
    options: ['Amazon', 'Nile', 'Mississippi', 'Yangtze'],
    answerIndex: 1,
    solution: 'The Nile River is about 4,135 miles long, flowing through northeastern Africa.',
    hintType: 'compass',
    nextClue: 'Follow the flowing water to ancient lands.'
  },
  {
    id: 'gk_5',
    subject: 'GK',
    difficulty: 'hard',
    prompt: 'In which year did World War II end?',
    options: ['1944', '1945', '1946', '1943'],
    answerIndex: 1,
    solution: 'World War II ended in 1945 with Japan\'s surrender in September.',
    hintType: 'map',
    nextClue: 'The map points to where history was made.'
  }
];

export const ALL_QUESTIONS: Question[] = [
  ...MATH_QUESTIONS,
  ...SCIENCE_QUESTIONS,
  ...GK_QUESTIONS
];

export function getQuestionsBySubject(subject: Subject): Question[] {
  return ALL_QUESTIONS.filter(q => q.subject === subject);
}

export function pickNextQuestion(subject: Subject, completedIds: string[]): Question | null {
  const available = getQuestionsBySubject(subject).filter(q => !completedIds.includes(q.id));
  if (available.length === 0) return null;
  return available[Math.floor(Math.random() * available.length)];
}

export function getQuestionById(id: string): Question | null {
  return ALL_QUESTIONS.find(q => q.id === id) || null;
}