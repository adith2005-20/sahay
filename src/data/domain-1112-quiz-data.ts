export interface Domain1112QuizData {
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

export const domain1112QuizData: Domain1112QuizData = {
  quiz_metadata: {
    title: "Domain Assessment (XI & XII)",
    total_questions: 6,
    assessment_type: "DOMAIN",
  },
  startQuestionID: "q1_economic_factors",
  questions: {
    q1_economic_factors: {
      text: "Thinking about education after the 12th, which approach best describes your family's financial plan?",
      type: "single-select",
      dimension: "constraints",
      answers: [
        {
          text: "long_term_investment",
          nextQuestionId: "q2_current_stream",
          profile_impact: {
            constraints: {
              investment_level: "high",
            },
          },
        },
        {
          text: "standard_degree",
          nextQuestionId: "q2_current_stream",
          profile_impact: {
            constraints: {
              investment_level: "medium",
            },
          },
        },
        {
          text: "skill_based_courses",
          nextQuestionId: "q2_current_stream",
          profile_impact: {
            constraints: {
              investment_level: "low",
            },
          },
        },
      ],
    },
    q2_current_stream: {
      text: "First things first, what is your current stream?",
      type: "single-select",
      dimension: "foundation",
      answers: [
        {
          text: "science_pcm",
          nextQuestionId: "q3_science_pcm_focus",
          profile_impact: {
            stream: "science_pcm",
          },
        },
        {
          text: "science_pcb",
          nextQuestionId: "q3_science_pcb_focus",
          profile_impact: {
            stream: "science_pcb",
          },
        },
        {
          text: "commerce_math",
          nextQuestionId: "q3_commerce_focus",
          profile_impact: {
            stream: "commerce_with_math",
          },
        },
        {
          text: "commerce_no_math",
          nextQuestionId: "q3_commerce_focus",
          profile_impact: {
            stream: "commerce_no_math",
          },
        },
        {
          text: "arts_humanities",
          nextQuestionId: "q3_arts_focus",
          profile_impact: {
            stream: "arts_humanities",
          },
        },
      ],
    },
    q3_science_pcm_focus: {
      text: "In the PCM group, where do your true interests and best marks lie?",
      type: "single-select",
      dimension: "academic_specialization",
      answers: [
        {
          text: "physics_math",
          nextQuestionId: "q4_work_preference",
          profile_impact: {
            aptitude: {
              strong_suit: "physics_math",
            },
          },
        },
        {
          text: "chemistry",
          nextQuestionId: "q4_work_preference",
          profile_impact: {
            aptitude: {
              strong_suit: "chemistry",
            },
          },
        },
        {
          text: "computer_programming",
          nextQuestionId: "q4_work_preference",
          profile_impact: {
            aptitude: {
              strong_suit: "computer_science",
            },
          },
        },
      ],
    },
    q3_science_pcb_focus: {
      text: "Within the PCB group, which area fascinates you the most?",
      type: "single-select",
      dimension: "academic_specialization",
      answers: [
        {
          text: "human_biology_medicine",
          nextQuestionId: "q4_work_preference",
          profile_impact: {
            aptitude: {
              strong_suit: "medical_healthcare",
            },
          },
        },
        {
          text: "zoology_botany",
          nextQuestionId: "q4_work_preference",
          profile_impact: {
            aptitude: {
              strong_suit: "life_sciences_core",
            },
          },
        },
        {
          text: "biotechnology",
          nextQuestionId: "q4_work_preference",
          profile_impact: {
            aptitude: {
              strong_suit: "biotechnology",
            },
          },
        },
      ],
    },
    q3_commerce_focus: {
      text: "In Commerce, which area are you strongest in?",
      type: "single-select",
      dimension: "academic_specialization",
      answers: [
        {
          text: "accountancy",
          nextQuestionId: "q4_work_preference",
          profile_impact: {
            aptitude: {
              strong_suit: "accounts",
            },
          },
        },
        {
          text: "business_management",
          nextQuestionId: "q4_work_preference",
          profile_impact: {
            aptitude: {
              strong_suit: "management",
            },
          },
        },
        {
          text: "economics",
          nextQuestionId: "q4_work_preference",
          profile_impact: {
            aptitude: {
              strong_suit: "economics",
            },
          },
        },
      ],
    },
    q3_arts_focus: {
      text: "In Arts/Humanities, which field captivates you the most?",
      type: "single-select",
      dimension: "academic_specialization",
      answers: [
        {
          text: "literature_languages",
          nextQuestionId: "q4_work_preference",
          profile_impact: {
            aptitude: {
              strong_suit: "literature",
            },
          },
        },
        {
          text: "history_political",
          nextQuestionId: "q4_work_preference",
          profile_impact: {
            aptitude: {
              strong_suit: "social_sciences",
            },
          },
        },
        {
          text: "psychology_sociology",
          nextQuestionId: "q4_work_preference",
          profile_impact: {
            aptitude: {
              strong_suit: "psychology",
            },
          },
        },
      ],
    },
    q4_work_preference: {
      text: "Which of these sounds more satisfying as a day's work?",
      type: "single-select",
      dimension: "work_preference",
      answers: [
        {
          text: "work_ideas_data",
          nextQuestionId: "q5_career_timeline",
          profile_impact: {
            inclination: "abstract_analytical",
          },
        },
        {
          text: "work_hands_tools",
          nextQuestionId: "q5_career_timeline",
          profile_impact: {
            inclination: "hands_on_vocational",
          },
        },
      ],
    },
    q5_career_timeline: {
      text: "What's your main priority right after you finish your education?",
      type: "single-select",
      dimension: "ambition",
      answers: [
        {
          text: "start_earning",
          nextQuestionId: "q6_work_environment",
          profile_impact: {
            ambition: {
              priority: "quick_employment",
            },
          },
        },
        {
          text: "best_job",
          nextQuestionId: "q6_work_environment",
          profile_impact: {
            ambition: {
              priority: "long_term_growth",
            },
          },
        },
      ],
    },
    q6_work_environment: {
      text: "Finally, picture your ideal workplace. Where are you?",
      type: "single-select",
      dimension: "environment_preference",
      answers: [
        {
          text: "office_corporate",
          nextQuestionId: null,
          profile_impact: {
            work_environment: "office",
          },
        },
        {
          text: "lab_research",
          nextQuestionId: null,
          profile_impact: {
            work_environment: "lab_or_clinic",
          },
        },
        {
          text: "workshop_studio",
          nextQuestionId: null,
          profile_impact: {
            work_environment: "workshop_or_field",
          },
        },
        {
          text: "independent_home",
          nextQuestionId: null,
          profile_impact: {
            work_environment: "remote_or_travel",
          },
        },
      ],
    },
  },
};
