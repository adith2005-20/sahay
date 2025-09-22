export type ScaleLabels = Record<string, string>;

export interface ProfileImpact {
  riasec: Record<string, 'response_value'>;
}

export interface Question {
  text: string;
  type: 'scale';
  scale_min: number;
  scale_max: number;
  scale_labels: ScaleLabels;
  nextQuestionId: string;
  profileImpact: ProfileImpact;
}

export interface QuizMetadata {
  title: string;
  total_questions: number;
  assessment_type: string;
}

export interface RiasecQuizData {
  quiz_metadata: QuizMetadata;
  startQuestionId: string;
  questions: Record<string, Question>;
}

// Export the quiz data with the defined type
export const riasecQuizData: RiasecQuizData = {
  "quiz_metadata": {
    "title": "RIASEC Interest Profiler",
    "total_questions": 30,
    "assessment_type": "RIASEC"
  },
  "startQuestionId": "r1_hands_on_preference",
  "questions": {
    "r1_hands_on_preference": {
      "text": "I enjoy working with my hands to build or fix things.",
      "type": "scale",
      "scale_min": 1,
      "scale_max": 5,
      "scale_labels": { "1": "Strongly disagree", "3": "Neutral", "5": "Strongly agree" },
      "nextQuestionId": "r2_practical_activities",
      "profileImpact": { "riasec": { "realistic": "response_value" } }
    },
    "r2_practical_activities": {
      "text": "I prefer practical activities over theoretical discussions.",
      "type": "scale",
      "scale_min": 1,
      "scale_max": 5,
      "scale_labels": { "1": "Strongly disagree", "3": "Neutral", "5": "Strongly agree" },
      "nextQuestionId": "r3_tools_machines",
      "profileImpact": { "riasec": { "realistic": "response_value" } }
    },
    "r3_tools_machines": {
      "text": "I like understanding how machines and tools work.",
      "type": "scale",
      "scale_min": 1,
      "scale_max": 5,
      "scale_labels": { "1": "Not at all interested", "3": "Somewhat interested", "5": "Very interested" },
      "nextQuestionId": "r4_outdoor_physical",
      "profileImpact": { "riasec": { "realistic": "response_value" } }
    },
    "r4_outdoor_physical": {
        "text": "I enjoy outdoor activities and physical challenges.",
        "type": "scale",
        "scale_min": 1,
        "scale_max": 5,
        "scale_labels": { "1": "Strongly disagree", "3": "Neutral", "5": "Strongly agree" },
        "nextQuestionId": "r5_tangible_results",
        "profileImpact": { "riasec": { "realistic": "response_value" } }
    },
    "r5_tangible_results": {
        "text": "I feel most satisfied when I can see tangible results from my work.",
        "type": "scale",
        "scale_min": 1,
        "scale_max": 5,
        "scale_labels": { "1": "Strongly disagree", "3": "Neutral", "5": "Strongly agree" },
        "nextQuestionId": "i1_complex_problems",
        "profileImpact": { "riasec": { "realistic": "response_value" } }
    },
    "i1_complex_problems": {
      "text": "I enjoy solving complex problems and puzzles that require deep analysis.",
      "type": "scale",
      "scale_min": 1,
      "scale_max": 5,
      "scale_labels": { "1": "Strongly disagree", "3": "Neutral", "5": "Strongly agree" },
      "nextQuestionId": "i2_experiments_research",
      "profileImpact": { "riasec": { "investigative": "response_value" } }
    },
    "i2_experiments_research": {
        "text": "I like conducting experiments and research to find answers.",
        "type": "scale",
        "scale_min": 1,
        "scale_max": 5,
        "scale_labels": { "1": "Not at all interested", "3": "Somewhat interested", "5": "Very interested" },
        "nextQuestionId": "i3_why_questions",
        "profileImpact": { "riasec": { "investigative": "response_value" } }
    },
    "i3_why_questions": {
        "text": "I prefer understanding the 'why' behind everything rather than just accepting facts.",
        "type": "scale",
        "scale_min": 1,
        "scale_max": 5,
        "scale_labels": { "1": "Strongly disagree", "3": "Neutral", "5": "Strongly agree" },
        "nextQuestionId": "i4_data_patterns",
        "profileImpact": { "riasec": { "investigative": "response_value" } }
    },
    "i4_data_patterns": {
        "text": "I enjoy analyzing data and finding patterns or trends.",
        "type": "scale",
        "scale_min": 1,
        "scale_max": 5,
        "scale_labels": { "1": "Not at all enjoyable", "3": "Somewhat enjoyable", "5": "Very enjoyable" },
        "nextQuestionId": "i5_independent_research",
        "profileImpact": { "riasec": { "investigative": "response_value" } }
    },
    "i5_independent_research": {
        "text": "I prefer working independently on research projects rather than following set procedures.",
        "type": "scale",
        "scale_min": 1,
        "scale_max": 5,
        "scale_labels": { "1": "Strongly disagree", "3": "Neutral", "5": "Strongly agree" },
        "nextQuestionId": "a1_creative_expression",
        "profileImpact": { "riasec": { "investigative": "response_value" } }
    },
    "a1_creative_expression": {
        "text": "I enjoy creating original art, music, writing, or other creative works.",
        "type": "scale",
        "scale_min": 1,
        "scale_max": 5,
        "scale_labels": { "1": "Not at all interested", "3": "Somewhat interested", "5": "Very interested" },
        "nextQuestionId": "a2_unstructured_environment",
        "profileImpact": { "riasec": { "artistic": "response_value" } }
    },
    "a2_unstructured_environment": {
        "text": "I prefer unstructured, flexible environments where I can be creative.",
        "type": "scale",
        "scale_min": 1,
        "scale_max": 5,
        "scale_labels": { "1": "Strongly disagree", "3": "Neutral", "5": "Strongly agree" },
        "nextQuestionId": "a3_innovative_ideas",
        "profileImpact": { "riasec": { "artistic": "response_value" } }
    },
    "a3_innovative_ideas": {
        "text": "I like expressing ideas through creative and innovative methods.",
        "type": "scale",
        "scale_min": 1,
        "scale_max": 5,
        "scale_labels": { "1": "Strongly disagree", "3": "Neutral", "5": "Strongly agree" },
        "nextQuestionId": "a4_aesthetic_design",
        "profileImpact": { "riasec": { "artistic": "response_value" } }
    },
    "a4_aesthetic_design": {
        "text": "I enjoy activities involving design, aesthetics, and visual appeal.",
        "type": "scale",
        "scale_min": 1,
        "scale_max": 5,
        "scale_labels": { "1": "Not at all enjoyable", "3": "Somewhat enjoyable", "5": "Very enjoyable" },
        "nextQuestionId": "a5_original_solutions",
        "profileImpact": { "riasec": { "artistic": "response_value" } }
    },
    "a5_original_solutions": {
        "text": "I prefer finding original, creative solutions rather than following established methods.",
        "type": "scale",
        "scale_min": 1,
        "scale_max": 5,
        "scale_labels": { "1": "Strongly disagree", "3": "Neutral", "5": "Strongly agree" },
        "nextQuestionId": "s1_helping_others",
        "profileImpact": { "riasec": { "artistic": "response_value" } }
    },
    "s1_helping_others": {
        "text": "I feel most fulfilled when I'm helping others solve their problems.",
        "type": "scale",
        "scale_min": 1,
        "scale_max": 5,
        "scale_labels": { "1": "Strongly disagree", "3": "Neutral", "5": "Strongly agree" },
        "nextQuestionId": "s2_teaching_explaining",
        "profileImpact": { "riasec": { "social": "response_value" } }
    },
    "s2_teaching_explaining": {
        "text": "I like teaching or explaining concepts to others.",
        "type": "scale",
        "scale_min": 1,
        "scale_max": 5,
        "scale_labels": { "1": "Not at all interested", "3": "Somewhat interested", "5": "Very interested" },
        "nextQuestionId": "s3_team_collaboration",
        "profileImpact": { "riasec": { "social": "response_value" } }
    },
    "s3_team_collaboration": {
        "text": "I prefer working in teams rather than working alone.",
        "type": "scale",
        "scale_min": 1,
        "scale_max": 5,
        "scale_labels": { "1": "Strongly disagree", "3": "Neutral", "5": "Strongly agree" },
        "nextQuestionId": "s4_people_interaction",
        "profileImpact": { "riasec": { "social": "response_value" } }
    },
    "s4_people_interaction": {
        "text": "I feel energized when interacting and working with people.",
        "type": "scale",
        "scale_min": 1,
        "scale_max": 5,
        "scale_labels": { "1": "Strongly disagree", "3": "Neutral", "5": "Strongly agree" },
        "nextQuestionId": "s5_community_service",
        "profileImpact": { "riasec": { "social": "response_value" } }
    },
    "s5_community_service": {
        "text": "I am drawn to activities that benefit the community or society.",
        "type": "scale",
        "scale_min": 1,
        "scale_max": 5,
        "scale_labels": { "1": "Not at all drawn", "3": "Somewhat drawn", "5": "Very drawn" },
        "nextQuestionId": "e1_leadership_roles",
        "profileImpact": { "riasec": { "social": "response_value" } }
    },
    "e1_leadership_roles": {
        "text": "I enjoy taking leadership roles and being in charge of projects.",
        "type": "scale",
        "scale_min": 1,
        "scale_max": 5,
        "scale_labels": { "1": "Strongly disagree", "3": "Neutral", "5": "Strongly agree" },
        "nextQuestionId": "e2_persuading_others",
        "profileImpact": { "riasec": { "enterprising": "response_value" } }
    },
    "e2_persuading_others": {
        "text": "I like convincing others to adopt my ideas or viewpoints.",
        "type": "scale",
        "scale_min": 1,
        "scale_max": 5,
        "scale_labels": { "1": "Not at all interested", "3": "Somewhat interested", "5": "Very interested" },
        "nextQuestionId": "e3_calculated_risks",
        "profileImpact": { "riasec": { "enterprising": "response_value" } }
    },
    "e3_calculated_risks": {
        "text": "I am comfortable taking calculated risks for potential rewards.",
        "type": "scale",
        "scale_min": 1,
        "scale_max": 5,
        "scale_labels": { "1": "Very uncomfortable", "3": "Neutral", "5": "Very comfortable" },
        "nextQuestionId": "e4_competitive_environment",
        "profileImpact": { "riasec": { "enterprising": "response_value" } }
    },
    "e4_competitive_environment": {
        "text": "I enjoy competitive environments and challenges.",
        "type": "scale",
        "scale_min": 1,
        "scale_max": 5,
        "scale_labels": { "1": "Strongly disagree", "3": "Neutral", "5": "Strongly agree" },
        "nextQuestionId": "e5_business_opportunities",
        "profileImpact": { "riasec": { "enterprising": "response_value" } }
    },
    "e5_business_opportunities": {
        "text": "I am interested in starting my own business or identifying new opportunities.",
        "type": "scale",
        "scale_min": 1,
        "scale_max": 5,
        "scale_labels": { "1": "Not at all interested", "3": "Somewhat interested", "5": "Very interested" },
        "nextQuestionId": "c1_structured_procedures",
        "profileImpact": { "riasec": { "enterprising": "response_value" } }
    },
    "c1_structured_procedures": {
        "text": "I prefer working with clear rules and structured procedures.",
        "type": "scale",
        "scale_min": 1,
        "scale_max": 5,
        "scale_labels": { "1": "Strongly disagree", "3": "Neutral", "5": "Strongly agree" },
        "nextQuestionId": "c2_organizing_records",
        "profileImpact": { "riasec": { "conventional": "response_value" } }
    },
    "c2_organizing_records": {
        "text": "I enjoy organizing and maintaining detailed records or databases.",
        "type": "scale",
        "scale_min": 1,
        "scale_max": 5,
        "scale_labels": { "1": "Not at all enjoyable", "3": "Somewhat enjoyable", "5": "Very enjoyable" },
        "nextQuestionId": "c3_numbers_data",
        "profileImpact": { "riasec": { "conventional": "response_value" } }
    },
    "c3_numbers_data": {
        "text": "I like working with numbers and data in a systematic way.",
        "type": "scale",
        "scale_min": 1,
        "scale_max": 5,
        "scale_labels": { "1": "Strongly disagree", "3": "Neutral", "5": "Strongly agree" },
        "nextQuestionId": "c4_predictable_tasks",
        "profileImpact": { "riasec": { "conventional": "response_value" } }
    },
    "c4_predictable_tasks": {
        "text": "I prefer predictable, well-defined tasks over ambiguous assignments.",
        "type": "scale",
        "scale_min": 1,
        "scale_max": 5,
        "scale_labels": { "1": "Strongly disagree", "3": "Neutral", "5": "Strongly agree" },
        "nextQuestionId": "c5_following_guidelines",
        "profileImpact": { "riasec": { "conventional": "response_value" } }
    },
    "c5_following_guidelines": {
        "text": "I work best when following established guidelines and protocols.",
        "type": "scale",
        "scale_min": 1,
        "scale_max": 5,
        "scale_labels": { "1": "Strongly disagree", "3": "Neutral", "5": "Strongly agree" },
        "nextQuestionId": "",
        "profileImpact": { "riasec": { "conventional": "response_value" } }
    }
  }
};
