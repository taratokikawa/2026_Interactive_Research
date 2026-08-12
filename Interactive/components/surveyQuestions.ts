export type Category = 'Audio' | 'Visual' | 'Reading/Writing';

export type SurveyQuestion = {
  id: string;
  category: Category;
  text: string;
};

export const SURVEY_QUESTIONS: SurveyQuestion[] = [
  { id: 'a1', category: 'Audio', text: 'I pick up information best when discussing it with others' },
  { id: 'a2', category: 'Audio', text: 'I comprehend best when having a book read to me' },
  { id: 'a3', category: 'Audio', text: 'I prefer class discussions over independent reading' },
  { id: 'a4', category: 'Audio', text: 'I comprehend information well when listening to audiobooks and podcasts' },
  { id: 'a5', category: 'Audio', text: 'I am easily distracted by background noises' },
  { id: 'a6', category: 'Audio', text: 'I often think out loud' },
  { id: 'a7', category: 'Audio', text: 'I follow verbal directions best' },

  { id: 'v1', category: 'Visual', text: 'I understand information better when it is presented visually rather than explained only with words' },
  { id: 'v2', category: 'Visual', text: 'I remember information better when I can associate it with an image, symbol, or visual representation' },
  { id: 'v3', category: 'Visual', text: 'I prefer lessons that include videos, animations, or other visual demonstrations' },
  { id: 'v4', category: 'Visual', text: 'I find color-coding information to be helpful' },
  { id: 'v5', category: 'Visual', text: 'I prefer using graphic organizers to organize information' },
  { id: 'v6', category: 'Visual', text: 'I understand math concepts better when they are shown using graphs, models, or visual examples' },
  { id: 'v7', category: 'Visual', text: 'I find it easier to follow instructions when they include pictures or visual examples' },

  { id: 'r1', category: 'Reading/Writing', text: 'I prefer to learn by taking notes' },
  { id: 'r2', category: 'Reading/Writing', text: 'I retain knowledge best through re-reading notes, textbooks, articles, or handouts' },
  { id: 'r3', category: 'Reading/Writing', text: 'I retain knowledge best through rephrasing text in my own words' },
  { id: 'r4', category: 'Reading/Writing', text: 'I prefer written essays over oral presentations' },
  { id: 'r5', category: 'Reading/Writing', text: 'I turn on closed captions often when watching videos to retain information better' },
  { id: 'r6', category: 'Reading/Writing', text: 'I highlight and annotate text to best retain information' },
  { id: 'r7', category: 'Reading/Writing', text: 'I write down information to organize my thoughts better' },
];

export const LIKERT_OPTIONS = [
  { label: 'Heavily Disagree', value: 0 },
  { label: 'Usually Disagree', value: 1 },
  { label: 'No Preference', value: 2 },
  { label: 'Usually Agree', value: 3 },
  { label: 'Heavily Agree', value: 4 },
];