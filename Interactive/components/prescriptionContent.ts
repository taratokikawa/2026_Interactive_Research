export type PrescriptionTip = {
  title: string;
  explanation: string;
};

export const PRESCRIPTION_CONTENT: Record<string, PrescriptionTip[]> = {
  Audio: [
  {
    title: 'Audible',
    explanation: 'Provides narrated audiobooks, helpful for consuming written material through listening instead of reading.',
  },
  {
    title: 'Learning Ally',
    explanation: 'Offers audiobook versions of textbooks and educational material, useful for reinforcing content through listening.',
  },
  {
    title: 'Natural Reader',
    explanation: 'Converts written notes, PDFs, and text into spoken audio, making written material more accessible through listening.',
  },
],

  Visual: [
  {
    title: 'Nearpod',
    explanation: 'An interactive instructional platform that helps teachers make collaborative activities that engage visual learners (videos, virtual "field trips," quizzes, etc).',
  },
  {
    title: 'Desmos',
    explanation: 'Uses interactive graphs and visual models to help students explore concepts and patterns.',
  },
  {
    title: 'Canva',
    explanation: 'Allows students to create mind maps, infographics, graphic organizers, etc, helping them organize and visualize information.',
  },
],

  'Reading/Writing': [
  {
    title: 'Delta Math',
    explanation: 'Offers structured practice problems with written feedback, helping reinforce concepts through repetition and review.',
  },
  {
    title: 'Cornell Notes',
    explanation: 'A structured note-taking method that organizes notes, cues, and summaries to support effective review and retention.',
  },
  {
    title: 'Written Flashcards',
    explanation: 'Helps reinforce key terms and concepts through repeated writing and review.',
  },
],
};