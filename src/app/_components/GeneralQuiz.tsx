"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, BookOpen, Lightbulb } from "lucide-react";
import {
  type DomainQuizData,
  type Answer,
  type Question,
} from "@/data/domain-quiz-data";
import { merge } from "lodash";
import { useTranslation } from "@/contexts/LanguageContext";
import { getQuizTranslation } from "@/lib/quiz-translations";

// Define the types for our component's props and state
interface QuizEngineProps {
  quizData: DomainQuizData;
  onComplete: (
    results: Record<string, unknown>,
    history: ResponseHistory,
  ) => void;
}

// Type for storing the history of answers
type ResponseHistory = Record<
  string,
  {
    questionText: string;
    selectedAnswerText: string;
  }
>;

export function QuizEngine({ quizData, onComplete }: QuizEngineProps) {
  const { t, locale } = useTranslation();
  const [quizState, setQuizState] = useState<
    "intro" | "in_progress" | "completed"
  >("intro");
  const [currentQuestionId, setCurrentQuestionId] = useState<string | null>(
    quizData.startQuestionID,
  );
  const [results, setResults] = useState<Record<string, unknown>>({});
  const [history, setHistory] = useState<ResponseHistory>({});
  const [answeredQuestions, setAnsweredQuestions] = useState<string[]>([]);

  const totalQuestions = quizData.quiz_metadata.total_questions;
  const progress = useMemo(
    () => (answeredQuestions.length / totalQuestions) * 100,
    [answeredQuestions, totalQuestions],
  );
  const estimatedTime = useMemo(
    () => Math.ceil((totalQuestions * 20) / 60),
    [totalQuestions],
  );

  const handleAnswerSelect = (
    question: Question,
    answer: Answer,
    answerIndex: number,
  ) => {
    if (!currentQuestionId) return;

    // Update results based on profileImpact
    const newResults = { ...results };
    const impact = answer.profile_impact;

    // Merge the profile impact into results using lodash merge
    merge(newResults, impact);
    setResults(newResults);

    // Get translated question and answer text
    const currentQuestionText =
      getQuizTranslation("domain", locale, `questions.${currentQuestionId}`) ||
      question.text;
    const selectedAnswerText =
      getQuizTranslation(
        "domain",
        locale,
        `answers.${currentQuestionId}.${answerIndex}`,
      ) || answer.text;

    // Record the detailed response in history
    const newHistory: ResponseHistory = {
      ...history,
      [currentQuestionId]: {
        questionText: currentQuestionText,
        selectedAnswerText: selectedAnswerText,
      },
    };
    setHistory(newHistory);

    // Mark question as answered
    setAnsweredQuestions([...answeredQuestions, currentQuestionId]);

    // Move to next question or complete quiz
    if (answer.nextQuestionId) {
      setCurrentQuestionId(answer.nextQuestionId);
    } else {
      setQuizState("completed");
      onComplete(newResults, newHistory);
    }
  };

  const currentQuestion = currentQuestionId
    ? quizData.questions[currentQuestionId]
    : null;

  const getIntroCard = () => (
    <motion.div
      key="intro"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-2xl"
    >
      <Card className="text-center shadow-lg">
        <CardHeader className="p-6">
          <div className="bg-primary/10 mx-auto flex h-20 w-20 items-center justify-center rounded-full">
            <BookOpen className="text-primary h-12 w-12" />
          </div>
          <CardTitle className="mt-4 text-3xl font-bold">
            {t("quiz.domain.title")}
          </CardTitle>
          <CardDescription className="text-lg">
            {t("quiz.domain.description")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <div className="grid grid-cols-2 gap-4 text-left">
            <div className="rounded-lg border p-4">
              <p className="text-muted-foreground text-sm font-medium">
                {t("quiz.domain.questions")}
              </p>
              <p className="text-2xl font-bold">{totalQuestions}</p>
            </div>
            <div className="rounded-lg border p-4">
              <p className="text-muted-foreground text-sm font-medium">
                {t("quiz.domain.estimatedTime")}
              </p>
              <p className="text-2xl font-bold">
                ~{estimatedTime} {t("quiz.domain.timeUnit")}
              </p>
            </div>
          </div>
          <div className="space-y-3 rounded-lg border bg-slate-50 p-4 text-left">
            <h3 className="flex items-center gap-2 font-semibold">
              <Lightbulb className="h-5 w-5 text-yellow-500" />
              {t("quiz.domain.tips.title")}
            </h3>
            <ul className="text-muted-foreground list-inside list-disc space-y-1 text-sm">
              <li>{t("quiz.domain.tips.honest")}</li>
              <li>{t("quiz.domain.tips.instinct")}</li>
              <li>{t("quiz.domain.tips.noWrong")}</li>
            </ul>
          </div>
          <Button
            size="lg"
            className="w-full text-lg"
            onClick={() => setQuizState("in_progress")}
          >
            {t("quiz.domain.startButton")}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );

  const getQuestionCard = () =>
    currentQuestion && (
      <motion.div
        key="question"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-4xl"
      >
        <Card className="w-full overflow-hidden shadow-lg">
          <CardHeader className="p-6">
            <Progress value={progress} className="mb-4" />
            <CardTitle className="text-center text-2xl font-bold text-slate-800 md:text-3xl">
              {getQuizTranslation(
                "domain",
                locale,
                `questions.${currentQuestionId}`,
              ) || currentQuestion.text}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestionId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="space-y-3"
              >
                {currentQuestion.answers.map((answer, answerIndex) => (
                  <motion.div
                    key={answerIndex}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      variant="outline"
                      className="hover:bg-primary/5 focus:bg-primary/10 focus:ring-primary h-auto w-full justify-start p-4 text-left text-lg transition-colors duration-200 focus:ring-2"
                      onClick={() =>
                        handleAnswerSelect(currentQuestion, answer, answerIndex)
                      }
                    >
                      <div className="flex items-center space-x-3">
                        <div className="border-muted-foreground/30 bg-background flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-semibold">
                          {String.fromCharCode(65 + answerIndex)}
                        </div>
                        <span className="flex-1">
                          {getQuizTranslation(
                            "domain",
                            locale,
                            `answers.${currentQuestionId}.${answerIndex}`,
                          ) || answer.text}
                        </span>
                      </div>
                    </Button>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
    );

  const getCompletedCard = () => (
    <motion.div
      key="completed"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-2xl"
    >
      <Card className="text-center shadow-lg">
        <CardHeader className="p-6">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-orange-100">
            <CheckCircle className="h-12 w-12 text-orange-600" />
          </div>
          <CardTitle className="mt-4 text-3xl font-bold text-orange-800">
            {t("quiz.completed.title")}
          </CardTitle>
          <CardDescription className="text-lg">
            {t("quiz.completed.description")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 p-6">
          <div className="rounded-lg border bg-orange-50 p-4">
            <p className="text-muted-foreground text-sm">
              {t("quiz.completed.questionsAnswered")}
            </p>
            <p className="text-2xl font-bold text-orange-800">
              {answeredQuestions.length}
            </p>
          </div>
          <p className="text-muted-foreground">
            {t("quiz.completed.resultsMessage")}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <AnimatePresence mode="wait">
        {quizState === "intro" && getIntroCard()}
        {quizState === "in_progress" && getQuestionCard()}
        {quizState === "completed" && getCompletedCard()}
      </AnimatePresence>
    </div>
  );
}
