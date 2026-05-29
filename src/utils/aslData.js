/**
 * utils/aslData.js
 * Complete dataset for ASL alphabet (A-Z), numbers (0-9), and common signs.
 * Used by DictionaryPage and LearningPage.
 */

export const ASL_ALPHABET = [
  { id: 'A', label: 'A', category: 'alphabet', description: 'Fist with thumb resting on side. All fingers folded inward.', difficulty: 'easy', emoji: '✊' },
  { id: 'B', label: 'B', category: 'alphabet', description: 'Four fingers held up straight together, thumb folded across palm.', difficulty: 'easy', emoji: '🤚' },
  { id: 'C', label: 'C', category: 'alphabet', description: 'Hand curved like the letter C, fingers and thumb apart.', difficulty: 'easy', emoji: '🤙' },
  { id: 'D', label: 'D', category: 'alphabet', description: 'Index finger pointing up, other fingers and thumb touch tips.', difficulty: 'medium', emoji: '☝️' },
  { id: 'E', label: 'E', category: 'alphabet', description: 'Fingers curled down toward palm, thumb tucked underneath.', difficulty: 'medium', emoji: '🤞' },
  { id: 'F', label: 'F', category: 'alphabet', description: 'Index finger and thumb touch to form circle; other three fingers extend up.', difficulty: 'medium', emoji: '👌' },
  { id: 'G', label: 'G', category: 'alphabet', description: 'Index finger points sideways, thumb parallel to it.', difficulty: 'medium', emoji: '👉' },
  { id: 'H', label: 'H', category: 'alphabet', description: 'Index and middle finger extended and held together, pointing sideways.', difficulty: 'easy', emoji: '✌️' },
  { id: 'I', label: 'I', category: 'alphabet', description: 'Pinky finger extended upward, other fingers in fist.', difficulty: 'easy', emoji: '🤙' },
  { id: 'J', label: 'J', category: 'alphabet', description: 'Pinky up, draw the letter J in the air (moving sign).', difficulty: 'hard', emoji: '🤙' },
  { id: 'K', label: 'K', category: 'alphabet', description: 'Index and middle finger extend up in V, thumb between them.', difficulty: 'hard', emoji: '✌️' },
  { id: 'L', label: 'L', category: 'alphabet', description: 'Index finger up, thumb out to the side forming an L shape.', difficulty: 'easy', emoji: '👆' },
  { id: 'M', label: 'M', category: 'alphabet', description: 'Three fingers folded over the thumb with pinky tucked in.', difficulty: 'hard', emoji: '🤟' },
  { id: 'N', label: 'N', category: 'alphabet', description: 'Two fingers folded over the thumb with pinky and ring tucked in.', difficulty: 'hard', emoji: '🤟' },
  { id: 'O', label: 'O', category: 'alphabet', description: 'All fingers and thumb curve around to form an O shape.', difficulty: 'easy', emoji: '👌' },
  { id: 'P', label: 'P', category: 'alphabet', description: 'Like K but hand points downward.', difficulty: 'hard', emoji: '✌️' },
  { id: 'Q', label: 'Q', category: 'alphabet', description: 'Like G but hand points downward.', difficulty: 'hard', emoji: '👉' },
  { id: 'R', label: 'R', category: 'alphabet', description: 'Index and middle fingers crossed, extending upward.', difficulty: 'medium', emoji: '🤞' },
  { id: 'S', label: 'S', category: 'alphabet', description: 'Fist with thumb folded over fingers.', difficulty: 'easy', emoji: '✊' },
  { id: 'T', label: 'T', category: 'alphabet', description: 'Index finger bent over thumb, other fingers closed in fist.', difficulty: 'medium', emoji: '🤞' },
  { id: 'U', label: 'U', category: 'alphabet', description: 'Index and middle finger extended and held together pointing up.', difficulty: 'easy', emoji: '✌️' },
  { id: 'V', label: 'V', category: 'alphabet', description: 'Index and middle finger extended and spread apart in a V.', difficulty: 'easy', emoji: '✌️' },
  { id: 'W', label: 'W', category: 'alphabet', description: 'Three fingers (index, middle, ring) extended and spread apart.', difficulty: 'medium', emoji: '🖖' },
  { id: 'X', label: 'X', category: 'alphabet', description: 'Index finger bent into a hook shape.', difficulty: 'medium', emoji: '☝️' },
  { id: 'Y', label: 'Y', category: 'alphabet', description: 'Thumb and pinky extended outward, other fingers folded.', difficulty: 'easy', emoji: '🤙' },
  { id: 'Z', label: 'Z', category: 'alphabet', description: 'Index finger draws the letter Z in the air (moving sign).', difficulty: 'hard', emoji: '☝️' },
];

export const ASL_NUMBERS = [
  { id: '0', label: '0', category: 'numbers', description: 'All fingers and thumb curve around forming a circle, like the letter O.', difficulty: 'easy', emoji: '👌' },
  { id: '1', label: '1', category: 'numbers', description: 'Index finger points straight up, all other fingers closed.', difficulty: 'easy', emoji: '☝️' },
  { id: '2', label: '2', category: 'numbers', description: 'Index and middle fingers extended up, slightly apart.', difficulty: 'easy', emoji: '✌️' },
  { id: '3', label: '3', category: 'numbers', description: 'Thumb, index, and middle fingers extended.', difficulty: 'easy', emoji: '🤟' },
  { id: '4', label: '4', category: 'numbers', description: 'Four fingers extended upward, thumb tucked across palm.', difficulty: 'easy', emoji: '🖐' },
  { id: '5', label: '5', category: 'numbers', description: 'All five fingers spread wide open.', difficulty: 'easy', emoji: '🖐' },
  { id: '6', label: '6', category: 'numbers', description: 'Pinky and thumb touch tip-to-tip, other fingers extended.', difficulty: 'medium', emoji: '🤙' },
  { id: '7', label: '7', category: 'numbers', description: 'Ring finger and thumb touch tip-to-tip, other fingers extended.', difficulty: 'medium', emoji: '🖖' },
  { id: '8', label: '8', category: 'numbers', description: 'Middle finger and thumb touch tip-to-tip, other fingers extended.', difficulty: 'medium', emoji: '👆' },
  { id: '9', label: '9', category: 'numbers', description: 'Index finger and thumb touch tip-to-tip, other fingers extended.', difficulty: 'medium', emoji: '👌' },
];

export const ASL_COMMON = [
  { id: 'hello', label: 'HELLO', category: 'common', description: 'Open hand at temple, then move out in a salute gesture.', difficulty: 'easy', emoji: '👋' },
  { id: 'thank-you', label: 'THANK YOU', category: 'common', description: 'Flat hand at chin, moves outward toward the person.', difficulty: 'easy', emoji: '🙏' },
  { id: 'please', label: 'PLEASE', category: 'common', description: 'Flat hand on chest, move in a circular motion.', difficulty: 'easy', emoji: '🤲' },
  { id: 'yes', label: 'YES', category: 'common', description: 'Fist nods up and down, mimicking a head nod.', difficulty: 'easy', emoji: '✊' },
  { id: 'no', label: 'NO', category: 'common', description: 'Index and middle fingers snap down onto thumb.', difficulty: 'easy', emoji: '🤞' },
  { id: 'sorry', label: 'SORRY', category: 'common', description: 'Fist moves in circular motion over chest (heart area).', difficulty: 'easy', emoji: '✊' },
  { id: 'help', label: 'HELP', category: 'common', description: 'Flat hand (A handshape) placed on open palm, both lifted upward.', difficulty: 'medium', emoji: '🤝' },
  { id: 'love', label: 'LOVE', category: 'common', description: 'Cross arms over chest with closed fists.', difficulty: 'easy', emoji: '🤗' },
];

// Combine all for dictionary search
export const ALL_SIGNS = [...ASL_ALPHABET, ...ASL_NUMBERS, ...ASL_COMMON];

// Difficulty color mapping
export const DIFFICULTY_COLORS = {
  easy:   { text: '#4ade80', bg: 'rgba(74,222,128,0.1)', border: 'rgba(74,222,128,0.2)' },
  medium: { text: '#e7c365', bg: 'rgba(231,195,101,0.1)', border: 'rgba(231,195,101,0.2)' },
  hard:   { text: '#f87171', bg: 'rgba(248,113,113,0.1)', border: 'rgba(248,113,113,0.2)' },
};

// Learning curriculum structure
export const LESSONS = [
  {
    id: 'beginner',
    title: 'Beginner Basics',
    subtitle: 'Get started with ASL fundamentals',
    icon: '🌱',
    accent: '#4ade80',
    signs: ['A', 'B', 'C', 'hello', 'thank-you', 'please', 'yes', 'no'],
    xp: 100,
  },
  {
    id: 'alphabet-1',
    title: 'Alphabet Part 1',
    subtitle: 'Letters A through M',
    icon: '🔤',
    accent: '#00D2FF',
    signs: ['A','B','C','D','E','F','G','H','I','J','K','L','M'],
    xp: 200,
  },
  {
    id: 'alphabet-2',
    title: 'Alphabet Part 2',
    subtitle: 'Letters N through Z',
    icon: '🔡',
    accent: '#9D4EDD',
    signs: ['N','O','P','Q','R','S','T','U','V','W','X','Y','Z'],
    xp: 200,
  },
  {
    id: 'numbers',
    title: 'Numbers 0–9',
    subtitle: 'Count in ASL',
    icon: '🔢',
    accent: '#e7c365',
    signs: ['0','1','2','3','4','5','6','7','8','9'],
    xp: 150,
  },
  {
    id: 'common',
    title: 'Common Phrases',
    subtitle: 'Everyday expressions',
    icon: '💬',
    accent: '#f472b6',
    signs: ['hello','thank-you','please','yes','no','sorry','help','love'],
    xp: 250,
  },
];
