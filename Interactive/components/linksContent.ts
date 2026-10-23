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
      heading: 'Math',
      items: [
        { text: 'Use this tutorial to learn how to factor:', linkLabel: 'YouTube', linkUrl: 'https://youtu.be/U8LwVi-DnRg?si=xw61P369ZqlIs9UD' },
        { text: 'Use the Ducktor Practice Hub to try new problems' },
      ],
    },
    {
      heading: 'English',
      items: [
        { text: 'Learn how to use correct punctuation through this graphic organizer:', linkLabel: 'Grammarly', linkUrl: 'https://www.grammarly.com/punctuation' },
        { text: 'Use the Ducktor Practice Hub to try new problems' },
      ],
    },
  ],

  Audio: [
    {
      heading: 'Math',
      items: [
        { text: 'Download this read aloud speech technology to use on word problems:', linkLabel: 'Speechify', linkUrl: 'https://speechify.com/onboarding/nc/general/listening-schedule/?directToOnboarding=true' },
        { text: 'Use the Ducktor Practice Hub to try new problems' },
      ],
    },
    {
      heading: 'English',
      items: [
        { text: 'Download this read aloud speech technology for on-screen texts:', linkLabel: 'Speechify', linkUrl: 'https://speechify.com/onboarding/nc/general/listening-schedule/?directToOnboarding=true' },
        { text: 'Use the Ducktor Practice Hub to try new problems' },
      ],
    },
  ],

  'Reading/Writing': [
    {
      heading: 'Math',
      items: [
        { text: 'Take notes on this video to learn how to factor trinomials', linkLabel: 'YouTube', linkUrl: 'https://www.youtube.com/watch?v=qeByhTF8WEw' },
        { text: 'Use the Ducktor Practice Hub to try new problems' },
        ],
    },
    {
      heading: 'English',
      items: [
        { text: 'Take notes on this lesson to learn punctuation', linkLabel: 'Khan Academy', linkUrl: 'https://www.khanacademy.org/test-prep/sat-reading-and-writing/x0d47bcec73eb6c4b:digital-sat-grammar-practice/x0d47bcec73eb6c4b:boundaries-punctuation/a/grammar-guide-punctuation' },
        { text: 'Use the Ducktor Practice Hub to try new problems' },
      ],
    },
  ],
};