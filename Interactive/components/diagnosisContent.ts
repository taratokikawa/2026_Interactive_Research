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
    explanation: `Audio learners are students who learn best through active listening. According to Western Governors University, key characteristics of these types of learners are those who “prefer listening to a lecture over reading a book, or hearing instructions for a project instead of figuring it out hands-on” (Western Governors University). Western Governors recommends students utilize podcasts, record lectures, being active in class discussions, and reading allowed (Western Governors University). Bay Atlantic University also identifies other additional strategies for auditory learners such as verbally repeating information, playing background music to help get rid of distracting noises or silence, and through collaborative work with classmates. Overall students with this learning type should consider being active in class settings as well as strategies to maximize listening technologies.`,
    sources: `“Auditory Learning Style Explained.” Western Governors University, 10 Aug. 2020, https://www.wgu.edu/blog/2020/08/auditory-learning-style.html. Accessed 15 Aug. 2026.

Bay Atlantic University. “Auditory Learner: Characteristics & Benefits.” Bay Atlantic University, 24 Jan. 2022, https://bau.edu/blog/auditory-learner/. Accessed 15 Aug. 2026.`,
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
    sources: `Visual Learning: The Power of Visual Aids and Multimedia 
    https://www.researchgate.net/profile/Moses-Alabi/publication/385662029_Visual_Learning_The_Power_of_Visual_Aids_and_Multimedia/links/672ec79a5852dd723cb18366/Visual-Learning-The-Power-of-Visual-Aids-and-Multimedia.pdf

    Visual Literacy in Teaching and Learning: A Literature Perspective
    https://xhspz.wordpress.com/2008/07/25/visual-literacy-in-teaching-and-learning/

    The Role of Visual Learning in Improving Students' High-Order Thinking Skills
    https://eric.ed.gov/?id=EJ1112894`,
    },
};