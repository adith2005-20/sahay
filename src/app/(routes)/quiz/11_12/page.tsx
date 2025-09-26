"use client";

import { QuizEngine } from "@/components/QuizEngine";
import { domain1112QuizData } from "@/data/domain-1112-quiz-data";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

type ResponseHistory = Record<
  string,
  {
    questionText: string;
    selectedAnswerText: string;
  }
>;

export default function Domain1112QuizPage() {
  const supabase = createClient();
  const router = useRouter();

  const handleQuizComplete = async (
    results: Record<string, unknown>,
    history: ResponseHistory,
  ) => {
    const submissionPayload = {
      quizType: "11_12",
      responseData: {
        results,
        history,
      },
    };

    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) {
        console.error("User not found, redirecting to login.");
        router.push('/login');
        return;
    }

    const { error: insertError } = await supabase
      .from("user_quiz_responses")
      .insert({
        user_id: data.user.id,
        quiz_type: "11_12",
        response_data: submissionPayload,
      });

    if (insertError) {
        console.error("Failed to save quiz response:", insertError.message);
        // Optionally, show an error message to the user
        return;
    }

    // Redirect to the dashboard after a short delay to show the completion screen.
    setTimeout(() => {
      router.push("/dashboard");
    }, 3000);
  };

  return (
    <QuizEngine
      quizData={domain1112QuizData}
      quizType="domain-1112"
      onComplete={handleQuizComplete}
    />
  );
}

