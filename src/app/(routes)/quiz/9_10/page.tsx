"use client";

import { QuizEngine } from "@/app/_components/GeneralQuiz";
import { domainQuizData } from "@/data/domain-quiz-data";
import { createClient } from "@/app/utils/supabase/client";
import { useRouter } from "next/navigation";
type ResponseHistory = Record<
  string,
  {
    questionText: string;
    selectedAnswerText: string;
  }
>;

export default function DomainQuizPage() {
  const supabase = createClient();
  const router = useRouter();

  const handleQuizComplete = async (
    results: Record<string, unknown>,
    history: ResponseHistory,
  ) => {
    const submissionPayload = {
      quizType: "9_10",
      responseData: {
        results,
        history,
      },
    };

    const { data, error } = await supabase.auth.getUser();
    const { error: insertError } = await supabase
      .from("user_quiz_responses")
      .insert({
        user_id: data.user?.id,
        quiz_type: "9_10",
        response_data: submissionPayload,
      });

    // Example of how you would call your tRPC mutation
    // const { mutate } = api.quiz.submitResponse.useMutation();
    // mutate(submissionPayload);
    //
    // Then, router.push('/dashboard');
    setTimeout(() => {
      router.push("/dashboard");
    }, 3000);
  };

  return (
    <QuizEngine
      quizData={domainQuizData}
      quizType="domain"
      onComplete={handleQuizComplete}
    />
  );
}
