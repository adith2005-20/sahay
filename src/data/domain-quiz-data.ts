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
    type: 'single-select';
    dimension: string;
    answers: Answer[];
  }
  
  export interface Answer {
    text: string;
    nextQuestionId: string | null;
    profile_impact: Record<string, unknown>;
  }
  
  
  export const domainQuizData: DomainQuizData = {
  quiz_metadata:{
    title: "Domain Assessment (IX & X)",
    total_questions: 7,
    assessment_type: "DOMAIN"
  },
  
  startQuestionID: "q1_strongest_subject",
  
  questions:{
  q1_strongest_subject:{
  text: "If you had to pick one, which subject area do you feel most confident in?",
  type: "single-select",
  dimension: "academic_aptitude",
  answers:[
    { "text": "Mathematics", "nextQuestionId": "q2_academic_math", "profile_impact": { "academic": { "strong_suit": "math" } } },
    { "text": "Science (Physics, Chemistry, Biology)", "nextQuestionId": "q2_academic_math", "profile_impact": { "academic": { "strong_suit": "science" } } },
    { "text": "Social Studies (History, Geography)", "nextQuestionId": "q4_academic_sst", "profile_impact": { "academic": { "strong_suit": "social_studies" } } },
    { "text": "Languages (English, Hindi, etc.)", "nextQuestionId": "q4_academic_sst", "profile_impact": { "academic": { "strong_suit": "languages" } } },
    { "text": "Economics or Business topics", "nextQuestionId": "q5_academic_commerce", "profile_impact": { "academic": { "strong_suit": "commerce" } } }
  ]
  },
  q2_academic_math:{
  text: "How would you rate your performance in Mathematics?",
  type: "single-select",
  dimension: "academic",
  answers:[
    { "text": "Excellent / I find it easy.", "nextQuestionId": "q3_academic_science", "profile_impact": { "academic": { "math_level": 3 } } },
    { "text": "Good / I do well with effort.", "nextQuestionId": "q3_academic_science", "profile_impact": { "academic": { "math_level": 2 } } },
    { "text": "Average / It's a struggle sometimes.", "nextQuestionId": "q3_academic_science", "profile_impact": { "academic": { "math_level": 1 } } },
    { "text": "Poor / It's a very weak subject for me.", "nextQuestionId": "q3_academic_science", "profile_impact": { "academic": { "math_level": 0 } } }
  ]
  },
  q3_academic_science:{
  text: "How would you rate your performance in Science (Physics, Chemistry, Biology)?",
  type: "single-select",
  dimension: "academic",
  answers:[
    { "text": "Excellent / Very strong.", "nextQuestionId": "q4_academic_sst", "profile_impact": { "academic": { "science_level": 3 } } },
    { "text": "Good / I understand the concepts.", "nextQuestionId": "q4_academic_sst", "profile_impact": { "academic": { "science_level": 2 } } },
    { "text": "Average / I get by.", "nextQuestionId": "q4_academic_sst", "profile_impact": { "academic": { "science_level": 1 } } },
    { "text": "Poor / I really struggle with it.", "nextQuestionId": "q4_academic_sst", "profile_impact": { "academic": { "science_level": 0 } } }
  ]
  },
  q4_academic_sst:{
  text: "How would you rate your performance in Social Studies (History, Geography, Civics)?",
  type: "single-select",
  dimension: "academic",
  answers:[
    { "text": "Excellent / I enjoy these subjects.", "nextQuestionId": "q5_academic_commerce", "profile_impact": { "academic": { "sst_level": 3 } } },
    { "text": "Good / I score well.", "nextQuestionId": "q5_academic_commerce", "profile_impact": { "academic": { "sst_level": 2 } } },
    { "text": "Average / Not my favorite.", "nextQuestionId": "q5_academic_commerce", "profile_impact": { "academic": { "sst_level": 1 } } },
    { "text": "Poor / I find it difficult to score well.", "nextQuestionId": "q5_academic_commerce", "profile_impact": { "academic": { "sst_level": 0 } } }
  ]
  },
  q5_academic_commerce:{
  text: "How would you rate your performance in topics related to Economics or Business?",
  type: "single-select",
  dimension: "academic",
  answers:[
    { "text": "Excellent / I find them very interesting.", "nextQuestionId": "q6_learning_style", "profile_impact": { "academic": { "commerce_level": 3 } } },
    { "text": "Good / I'm curious about them.", "nextQuestionId": "q6_learning_style", "profile_impact": { "academic": { "commerce_level": 2 } } },
    { "text": "Average / They are okay.", "nextQuestionId": "q6_learning_style", "profile_impact": { "academic": { "commerce_level": 1 } } },
    { "text": "Poor / I don't find them interesting at all.", "nextQuestionId": "q6_learning_style", "profile_impact": { "academic": { "commerce_level": 0 } } }
  ]
  },
  q6_learning_style: {
  text: "You're given a project on a complex topic. What's your preferred way to work?",
  type: "single-select",
  dimension: "learning_style",
  answers: [
    { "text": "Follow a structured guide with clear steps and expected outcomes.", "nextQuestionId": "q7_effort_tolerance", "profile_impact": { "learning_style": { "preference": "structured" } } },
    { "text": "Dive into the data and analyze facts and figures to form a conclusion.", "nextQuestionId": "q7_effort_tolerance", "profile_impact": { "learning_style": { "preference": "analytical" } } },
    { "text": "Explore different creative ideas and present my findings in a unique way.", "nextQuestionId": "q7_effort_tolerance", "profile_impact": { "learning_style": { "preference": "exploratory" } } }
  ]
  },
  q7_effort_tolerance: {
  text: "After school and homework, how much extra time are you willing to put in for self-study or preparing for competitive exams?",
  type: "single-select",
  dimension: "ambition",
  answers: [
    { "text": "A lot. I'm ready to dedicate 2-3 hours daily if needed.", "nextQuestionId": null, "profile_impact": { "ambition": { "effort_level": 3 } } },
    { "text": "A moderate amount. Maybe an hour a day or more on weekends.", "nextQuestionId": null, "profile_impact": { "ambition": { "effort_level": 2 } } },
    { "text": "Honestly, not much. I prefer to focus on schoolwork and have free time.", "nextQuestionId": null, "profile_impact": { "ambition": { "effort_level": 1 } } }
  ]
}
}
}