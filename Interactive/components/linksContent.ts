export type LinkItem = {
  text: string;
  linkLabel?: string;
  linkUrl?: string;
};

export type LinkSection = {
  heading: string;
  items: LinkItem[];
};

export const LINKS_CONTENT: Record<string, LinkSection[]> = {
  Visual: [
    {
      heading: 'Factoring',
      items: [
        { text: 'Use this tutorial to learn how to factor:', linkLabel: 'YouTube', linkUrl: 'https://youtu.be/U8LwVi-DnRg?si=xw61P369ZqlIs9UD' },
        { text: 'Use the Ducktor Practice Hub to try new problems' },
      ],
    },
    {
      heading: 'Punctuation',
      items: [
        { text: 'Learn how to use correct punctuation through this graphic organizer:', linkLabel: 'Grammarly', linkUrl: 'https://www.grammarly.com/punctuation' },
        { text: 'Use the Ducktor Practice Hub to try new problems' },
      ],
    },
  ],

  Audio: [
    {
      heading: 'Factoring',
      items: [
        { text: 'Download this read aloud speech technology:', linkLabel: 'Speechify', linkUrl: 'https://speechify.com/onboarding/nc/general/listening-schedule/?directToOnboarding=true' },
        { text: 'Use Speechify to learn how to factor trinomials:', linkLabel: 'Khan Academy', linkUrl: 'https://www.khanacademy.org/math/algebra/x2f8bb11595b61c86:quadratics-multiplying-factoring/x2f8bb11595b61c86:factor-quadratics-intro/a/factoring-quadratics-leading-coefficient-1' },
        { text: 'Use Speechify to learn how to factor quadratic and polynomial expressions:', linkLabel: 'Khan Academy', linkUrl: 'https://www.khanacademy.org/test-prep/v2-sat-math/x0fcc98a58ba3bea7:advanced-math-easier/x0fcc98a58ba3bea7:factoring-quadratic-and-polynomial-expressions-easier/a/v2-sat-lesson-factoring-quadratic-and-polynomial-expressions' },
        { text: 'Use the Ducktor Practice Hub to try new problems' },
      ],
    },
    {
      heading: 'Punctuation',
      items: [
        { text: 'Download this read aloud speech technology:', linkLabel: 'Speechify', linkUrl: 'https://speechify.com/onboarding/nc/general/listening-schedule/?directToOnboarding=true' },
        { text: 'Use Speechify to learn correct punctuation use:', linkLabel: 'Khan Academy', linkUrl: 'https://www.khanacademy.org/test-prep/sat-reading-and-writing/x0d47bcec73eb6c4b:digital-sat-grammar-practice/x0d47bcec73eb6c4b:boundaries-punctuation/a/grammar-guide-punctuation' },
        { text: 'Use the Ducktor Practice Hub to try new problems' },
      ],
    },
  ],

  'Reading/Writing': [
    {
      heading: 'Factoring',
      items: [
        { text: 'Take notes on this video to learn how to factor trinomials', linkLabel: 'YouTube', linkUrl: 'https://www.youtube.com/watch?v=qeByhTF8WEw' },
        { text: 'Use the Ducktor Practice Hub to try new problems' },
        ],
    },
    {
      heading: 'Punctuation',
      items: [
        { text: 'Take notes on this lesson to learn punctuation', linkLabel: 'Khan Academy', linkUrl: 'https://www.khanacademy.org/test-prep/sat-reading-and-writing/x0d47bcec73eb6c4b:digital-sat-grammar-practice/x0d47bcec73eb6c4b:boundaries-punctuation/a/grammar-guide-punctuation' },
        { text: 'Use the Ducktor Practice Hub to try new problems' },
      ],
    },
  ],
};