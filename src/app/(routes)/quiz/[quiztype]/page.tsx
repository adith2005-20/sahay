'use client';

import { RiasecQuiz } from '@/app/_components/QuizComponent';
import { riasecQuizData } from '@/data/riasec-quiz-data';
import { createClient } from '@/app/utils/supabase/client';
import { useRouter } from 'next/navigation';

type ResponseHistory = Record<string, {
  questionText: string;
  responseValue: number;
}>;

export default function RiasecQuizPage() {
    const supabase = createClient();
    const router = useRouter();
  
  const handleQuizComplete = async (scores: Record<string, number>, history: ResponseHistory) => {
    console.log("RIASEC Assessment finished!");
    
    console.log("Final RIASEC Scores:", scores);

    const {data, error} = await supabase.auth.getUser();
    const {error: insertError} = await supabase
    .from('user_quiz_responses')
    .insert({user_id:data.user?.id, quiz_type:'RIASEC',response_data:history});

    const {error: scoreInsertError} = await supabase
    .from('user_riasec_record')
    .insert({user_id: data.user?.id,...scores});
    // This is the detailed history object you can also store
    // console.log("Full Response History:", history);
    // Construct the final object for your tRPC mutation
    // Example of how you would call your tRPC mutation
    // const { mutate } = api.quiz.submitResponse.useMutation();
    // mutate(submissionPayload);
    //
    // Then, router.push('/dashboard');
    setTimeout(()=>{router.push('/dashboard')},3000)
  };

  return (
    <RiasecQuiz
      quizData={riasecQuizData} // Pass the typed object directly
      onComplete={handleQuizComplete}
    />
  );
}
