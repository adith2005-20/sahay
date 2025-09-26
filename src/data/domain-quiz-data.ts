export interface DomainQuizData {
  quiz_metadata: {
    title: string;
    total_questions: number;
    assessment_type: string;
  };
  startQuestionID: string;
  questions: Record<string, Question>;
}

export interface Question {
  text: string;
  type: "single-select";
  dimension: string;
  answers: Answer[];
}

export interface Answer {
  text: string;
  nextQuestionId: string | null;
  profile_impact: Record<string, unknown>;
}

export const domainQuizData: DomainQuizData = {
  quiz_metadata: {
    title: "Domain Assessment (IX & X)",
    total_questions: 9,
    assessment_type: "DOMAIN",
  },

  startQuestionID: "q1_strongest_subject",

  questions: {
    q1_strongest_subject: {
      text: "If you had to pick one, which subject area do you feel most confident in?",
      type: "single-select",
      dimension: "academic_aptitude",
      answers: [
        {
          text: "mathematics",
          nextQuestionId: "q2_academic_math",
          profile_impact: { academic: { strong_suit: "math" } },
        },
        {
          text: "science",
          nextQuestionId: "q2_academic_math",
          profile_impact: { academic: { strong_suit: "science" } },
        },
        {
          text: "social_studies",
          nextQuestionId: "q4_academic_sst",
          profile_impact: { academic: { strong_suit: "social_studies" } },
        },
        {
          text: "languages",
          nextQuestionId: "q4_academic_sst",
          profile_impact: { academic: { strong_suit: "languages" } },
        },
        {
          text: "economics_business",
          nextQuestionId: "q5_academic_commerce",
          profile_impact: { academic: { strong_suit: "commerce" } },
        },
      ],
    },
    q2_academic_math: {
      text: "How would you rate your performance in Mathematics?",
      type: "single-select",
      dimension: "academic",
      answers: [
        {
          text: "excellent",
          nextQuestionId: "q3_academic_science",
          profile_impact: { academic: { math_level: 3 } },
        },
        {
          text: "good",
          nextQuestionId: "q3_academic_science",
          profile_impact: { academic: { math_level: 2 } },
        },
        {
          text: "average",
          nextQuestionId: "q3_academic_science",
          profile_impact: { academic: { math_level: 1 } },
        },
        {
          text: "challenging",
          nextQuestionId: "q3_academic_science",
          profile_impact: { academic: { math_level: 0 } },
        },
      ],
    },
    q3_academic_science: {
      text: "How would you rate your performance in Science (Physics, Chemistry, Biology)?",
      type: "single-select",
      dimension: "academic",
      answers: [
        {
          text: "excellent",
          nextQuestionId: "q4_academic_sst",
          profile_impact: { academic: { science_level: 3 } },
        },
        {
          text: "good",
          nextQuestionId: "q4_academic_sst",
          profile_impact: { academic: { science_level: 2 } },
        },
        {
          text: "average",
          nextQuestionId: "q4_academic_sst",
          profile_impact: { academic: { science_level: 1 } },
        },
        {
          text: "challenging",
          nextQuestionId: "q4_academic_sst",
          profile_impact: { academic: { science_level: 0 } },
        },
      ],
    },
    q4_academic_sst: {
      text: "How would you rate your performance in Social Studies (History, Geography, Civics)?",
      type: "single-select",
      dimension: "academic",
      answers: [
        {
          text: "very_comfortable",
          nextQuestionId: "q6_interests",
          profile_impact: { academic: { sst_level: 3 } },
        },
        {
          text: "comfortable",
          nextQuestionId: "q6_interests",
          profile_impact: { academic: { sst_level: 2 } },
        },
        {
          text: "somewhat_comfortable",
          nextQuestionId: "q6_interests",
          profile_impact: { academic: { sst_level: 1 } },
        },
        {
          text: "not_comfortable",
          nextQuestionId: "q6_interests",
          profile_impact: { academic: { sst_level: 0 } },
        },
      ],
    },
    q5_academic_commerce: {
      text: "How would you rate your performance in topics related to Economics or Business?",
      type: "single-select",
      dimension: "academic",
      answers: [
        {
          text: "easy_interesting",
          nextQuestionId: "q6_interests",
          profile_impact: { academic: { commerce_level: 3 } },
        },
        {
          text: "manageable",
          nextQuestionId: "q6_interests",
          profile_impact: { academic: { commerce_level: 2 } },
        },
        {
          text: "average",
          nextQuestionId: "q6_interests",
          profile_impact: { academic: { commerce_level: 1 } },
        },
        {
          text: "difficult_concepts",
          nextQuestionId: "q6_interests",
          profile_impact: { academic: { commerce_level: 0 } },
        },
      ],
    },
    q6_interests: {
      text: "What type of activities do you enjoy most in your free time?",
      type: "single-select",
      dimension: "interests",
      answers: [
        {
          text: "creative_artistic",
          nextQuestionId: "q6_learning_style",
          profile_impact: { interests: { preference: "creative" } },
        },
        {
          text: "sports_physical",
          nextQuestionId: "q6_learning_style",
          profile_impact: { interests: { preference: "physical" } },
        },
        {
          text: "reading_learning",
          nextQuestionId: "q6_learning_style",
          profile_impact: { interests: { preference: "intellectual" } },
        },
        {
          text: "social_friends",
          nextQuestionId: "q6_learning_style",
          profile_impact: { interests: { preference: "social" } },
        },
        {
          text: "technology_games",
          nextQuestionId: "q6_learning_style",
          profile_impact: { interests: { preference: "technical" } },
        },
      ],
    },
    q6_learning_style: {
      text: "You're given a project on a complex topic. What's your preferred way to work?",
      type: "single-select",
      dimension: "learning_style",
      answers: [
        {
          text: "structured_guide",
          nextQuestionId: "q7_learning_style",
          profile_impact: { learning_style: { preference: "structured" } },
        },
        {
          text: "analyze_data",
          nextQuestionId: "q7_learning_style",
          profile_impact: { learning_style: { preference: "analytical" } },
        },
        {
          text: "creative_exploration",
          nextQuestionId: "q7_learning_style",
          profile_impact: { learning_style: { preference: "exploratory" } },
        },
      ],
    },
    q7_learning_style: {
      text: "How do you prefer to learn new things?",
      type: "single-select",
      dimension: "learning_method",
      answers: [
        {
          text: "hands_on",
          nextQuestionId: "q7_effort_tolerance",
          profile_impact: { learning_method: { preference: "hands_on" } },
        },
        {
          text: "visual_aids",
          nextQuestionId: "q7_effort_tolerance",
          profile_impact: { learning_method: { preference: "visual" } },
        },
        {
          text: "reading_text",
          nextQuestionId: "q7_effort_tolerance",
          profile_impact: { learning_method: { preference: "reading" } },
        },
        {
          text: "discussion_group",
          nextQuestionId: "q7_effort_tolerance",
          profile_impact: { learning_method: { preference: "discussion" } },
        },
        {
          text: "practice_repetition",
          nextQuestionId: "q7_effort_tolerance",
          profile_impact: { learning_method: { preference: "practice" } },
        },
      ],
    },
    q7_effort_tolerance: {
      text: "After school and homework, how much extra time are you willing to put in for self-study or preparing for competitive exams?",
      type: "single-select",
      dimension: "ambition",
      answers: [
        {
          text: "high_effort",
          nextQuestionId: null,
          profile_impact: { ambition: { effort_level: 3 } },
        },
        {
          text: "moderate_effort",
          nextQuestionId: null,
          profile_impact: { ambition: { effort_level: 2 } },
        },
        {
          text: "low_effort",
          nextQuestionId: null,
          profile_impact: { ambition: { effort_level: 1 } },
        },
      ],
    },
  },
};
