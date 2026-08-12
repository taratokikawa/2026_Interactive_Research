export type DiagnosisContent = {
  explanation: string;
  sources: string;
};

export const DIAGNOSIS_CONTENT: Record<string, DiagnosisContent> = {
  'Reading/Writing': {
    explanation: `These types of learners learn best through reading and writing information.
    Southwestern College recommends reading and writing for learners to study by re-reading
    notes, textbooks, articles, or handouts (Bay Atlantic University). These types of learners also
    can better grasp information by rephrasing text and through reading out loud (Bay Atlantic
    University). Additionally Southwestern College also finds that another helpful studying tip for
    reading and writing learners can be to write down concepts multiple times to help retain new
    information (Southwest College). Overall students with this type of learning should consider
    effective note taking strategies and repetitive read and writing study techniques.`,
        sources: `Bay Atlantic University. "Read and Write Learners: Techniques & Tips." Bay Atlantic
    University, 25 Jan. 2022, https://bau.edu/blog/read-and-write-learners/. Accessed 8 Aug. 2026.

    "Southwestern College - Professional Studies » 4 Learning Styles: Knowing Yours and
    How to Maximize It." Ps.Sckans.Edu, 7 Jan. 2020, https://ps.sckans.edu/news/view/138/.
    Accessed 8 Aug. 2026.`,
    },

  Audio: {
    explanation: `Audio learning is most effective for students who learn best through listening,
    speaking, discussion, and oral repetition. Research from the University of Amsterdam found that
    AI-assisted audio-learning tools enhance student motivation and reading engagement, leading to
    improved academic achievement (Jafarian and Kramer). A related study on secondary education
    students found that emotional connection to audio curricula, combined with long-term use, was
    linked to improved academic outcomes (Stoica et al.), suggesting these benefits extend well to a
    high school setting. Beyond interactive AI tools, more accessible resources like audiobooks have
    also been shown to build literacy skills, expand vocabulary, and improve reading comprehension
    for auditory learners (Wolfson). Together, these findings suggest that both AI-driven audio tools
    and traditional audiobooks offer meaningful academic and engagement benefits for students who
    learn best by listening.`,
    sources: `Jafarian, Nanda R., and Anne-Wil Kramer. "AI-assisted audio-learning improves academic
    achievement through motivation and reading engagement." Computers and Education: Artificial
    Intelligence 8 (2025): 100357.

    Stoica, Dimitrie, et al. "Audio-based learning in secondary education: the impact of motivational
    and adaptive predictors on academic benefits." Interactive Learning Environments (2026): 1-19.

    Wolfson, Gene. "Using Audiobooks to Meet the Needs of Adolescent Readers." American
    Secondary Education, vol. 36, no. 2, 2008, pp. 105–14. JSTOR, http://www.jstor.org/stable/41406113.`,
    },

  Visual: {
    explanation: `By presenting knowledge using pictures, charts, diagrams, graphic organizers,
    and interactive simulations, visual learning techniques can enhance students' comprehension,
    retention, and higher-order thinking. According to research, visual representations support a
    variety of learning styles and help students process complex ideas more efficiently. This is
    especially true for those who benefit from good visual and spatial reasoning. Combining words
    with images can strengthen comprehension and memory, helping students connect new
    information with what they already know. Advances in educational technology, such as
    interactive multimedia, virtual reality, and AI-driven learning platforms, continue to expand
    opportunities for engaging, accessible, and effective visual learning environments. Despite
    researchers' observations that visual instruction should be carefully planned and balanced with
    other teaching methods, these advancements persist.`,
    sources: `1. Visual Learning: The Power of Visual Aids and Multimedia
    https://www.researchgate.net/profile/Moses-Alabi/publication/385662029_Visual_Learning_The_Power_of_Visual_Aids_and_Multimedia/links/672ec79a5852dd723cb18366/Visual-Learning-The-Power-of-Visual-Aids-and-Multimedia.pdf

    2. Visual Literacy in Teaching and Learning: A Literature Perspective
    https://xhspz.wordpress.com/2008/07/25/visual-literacy-in-teaching-and-learning/

    3. The Role of Visual Learning in Improving Students' High-Order Thinking Skills
    https://eric.ed.gov/?id=EJ1112894`,
    },
};