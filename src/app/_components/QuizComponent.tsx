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
import { CheckCircle, Trophy, BookOpen, Clock, Lightbulb } from "lucide-react";
import { type RiasecQuizData, type Question } from "@/data/riasec-quiz-data";
import { useTranslation } from "@/contexts/LanguageContext";
import { getQuizTranslation, getScaleLabel } from "@/lib/quiz-translations";

// Define the types for our component's props and state
interface RiasecQuizProps {
  quizData: RiasecQuizData;
  onComplete: (
    responses: Record<string, number>,
    history: ResponseHistory,
  ) => void;
}

// Type for storing the history of answers
type ResponseHistory = Record<
  string,
  {
    questionText: string;
    responseValue: number;
  }
>;

export function RiasecQuiz({ quizData, onComplete }: RiasecQuizProps) {
  const { t, locale } = useTranslation();
  const [quizState, setQuizState] = useState<
    "intro" | "in_progress" | "completed"
  >("intro");
  const [currentQuestionId, setCurrentQuestionId] = useState<string | null>(
    quizData.startQuestionId,
  );
  const [scores, setScores] = useState<Record<string, number>>({});
  const [history, setHistory] = useState<ResponseHistory>({});
  const [answeredQuestions, setAnsweredQuestions] = useState<string[]>([]);

  const totalQuestions = quizData.quiz_metadata.total_questions;
  const progress = useMemo(
    () => (answeredQuestions.length / totalQuestions) * 100,
    [answeredQuestions, totalQuestions],
  );
  const estimatedTime = useMemo(
    () => Math.ceil((totalQuestions * 15) / 60),
    [totalQuestions],
  ); // Approx 15 seconds per question

  const handleScaleSelect = (question: Question, value: number) => {
    if (!currentQuestionId) return;

    // 1. Update scores based on profileImpact
    const newScores = { ...scores };
    const impact = question.profileImpact.riasec;
    for (const key in impact) {
      if (impact[key] === "response_value") {
        newScores[key] = (newScores[key] ?? 0) + value;
      }
    }
    setScores(newScores);

    // 2. Record the detailed response in history
    const newHistory = { ...history };
    const translatedQuestion =
      getQuizTranslation(
        "riasec",
        locale,
        `questions.${currentQuestionId}.text`,
      ) || question.text;
    newHistory[currentQuestionId] = {
      questionText: translatedQuestion,
      responseValue: value,
    };
    setHistory(newHistory);

    // 3. Mark question as answered
    setAnsweredQuestions([...answeredQuestions, currentQuestionId]);

    // 4. Move to the next question or complete the quiz
    if (question.nextQuestionId) {
      setCurrentQuestionId(question.nextQuestionId);
    } else {
      setQuizState("completed");
      onComplete(newScores, newHistory);
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
            {t("quiz.riasec.title")}
          </CardTitle>
          <CardDescription className="text-lg">
            {t("quiz.riasec.description")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <div className="grid grid-cols-2 gap-4 text-left">
            <div className="rounded-lg border p-4">
              <p className="text-muted-foreground text-sm font-medium">
                {t("quiz.riasec.questions")}
              </p>
              <p className="text-2xl font-bold">{totalQuestions}</p>
            </div>
            <div className="rounded-lg border p-4">
              <p className="text-muted-foreground text-sm font-medium">
                {t("quiz.riasec.estimatedTime")}
              </p>
              <p className="text-2xl font-bold">
                ~{estimatedTime} {t("quiz.riasec.timeUnit")}
              </p>
            </div>
          </div>
          <div className="space-y-3 rounded-lg border bg-slate-50 p-4 text-left">
            <h3 className="flex items-center gap-2 font-semibold">
              <Lightbulb className="h-5 w-5 text-yellow-500" />
              {t("quiz.riasec.tips.title")}
            </h3>
            <ul className="text-muted-foreground list-inside list-disc space-y-1 text-sm">
              <li>{t("quiz.riasec.tips.honest")}</li>
              <li>{t("quiz.riasec.tips.instinct")}</li>
              <li>{t("quiz.riasec.tips.noWrong")}</li>
            </ul>
          </div>
          <Button
            size="lg"
            className="w-full text-lg"
            onClick={() => setQuizState("in_progress")}
          >
            {t("quiz.riasec.startButton")}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );

  const getQuestionCard = () => {
    const scaleOptions = currentQuestion
      ? Array.from({ length: currentQuestion.scale_max }, (_, i) => i + 1)
      : [];
    return (
      currentQuestion && (
        <motion.div
          key="question"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-3xl"
        >
          <Card className="w-full overflow-hidden shadow-lg">
            <CardHeader className="p-6">
              <Progress value={progress} className="mb-4" />
              <CardTitle className="text-center text-2xl font-bold text-slate-800 md:text-3xl">
                {getQuizTranslation(
                  "riasec",
                  locale,
                  `questions.${currentQuestionId}.text`,
                ) || currentQuestion.text}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentQuestionId}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{
                    duration: 0.4,
                    type: "spring",
                    stiffness: 100,
                    damping: 15,
                  }}
                  className="flex flex-col items-center"
                >
                  <div className="flex w-full max-w-xl flex-wrap justify-between gap-2">
                    {scaleOptions.map((value) => (
                      <motion.div
                        key={value}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="min-w-[80px] flex-1"
                      >
                        <Button
                          variant="outline"
                          className="focus:bg-primary/20 focus:ring-primary h-20 w-full flex-col p-2 text-center text-lg font-semibold transition-colors duration-200 focus:ring-2"
                          onClick={() =>
                            handleScaleSelect(currentQuestion, value)
                          }
                        >
                          {value}
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                  <div className="text-muted-foreground mt-4 flex w-full max-w-xl justify-between px-2 text-sm">
                    <span>
                      {getScaleLabel(
                        locale,
                        currentQuestion.scale_labels[
                          currentQuestion.scale_min
                        ] || "",
                      )}
                    </span>
                    <span>
                      {getScaleLabel(
                        locale,
                        currentQuestion.scale_labels[
                          currentQuestion.scale_max
                        ] || "",
                      )}
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      )
    );
  };

  const getResultCard = () => {
    const sortedScores = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    const topThree = sortedScores.slice(0, 3).map((item) => item[0]);

    return (
      <motion.div
        key="result"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <Card className="text-center shadow-lg">
          <CardHeader className="p-6">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <CardTitle className="mt-4 text-3xl font-bold">
              {t("quiz.riasec.completed.title")}
            </CardTitle>
            <CardDescription className="text-lg">
              {t("quiz.riasec.completed.description")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 p-6">
            <div className="flex flex-col items-center gap-2 rounded-lg border p-4">
              <span className="text-muted-foreground text-sm">
                {t("quiz.riasec.completed.topInterests")}
              </span>
              <div className="flex items-center gap-3">
                <Trophy className="h-10 w-10 text-yellow-500" />
                <p className="text-primary text-2xl font-bold tracking-widest">
                  {topThree
                    .map((code) => code.charAt(0).toUpperCase())
                    .join(" - ")}
                </p>
              </div>
              <p className="text-muted-foreground mt-2 text-sm capitalize">
                {topThree.join(", ")}
              </p>
            </div>
            <p className="text-muted-foreground px-4 text-sm">
              {t("quiz.riasec.completed.personalization")}
            </p>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-slate-50 p-4 font-sans">
      <AnimatePresence mode="wait">
        {quizState === "intro" && getIntroCard()}
        {quizState === "in_progress" && getQuestionCard()}
        {quizState === "completed" && getResultCard()}
      </AnimatePresence>
    </div>
  );
}
