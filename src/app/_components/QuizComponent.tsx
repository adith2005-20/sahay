'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Trophy } from 'lucide-react';
import { type RiasecQuizData, type Question } from '@/data/riasec-quiz-data';

// Define the types for our component's props and state
interface RiasecQuizProps {
  quizData: RiasecQuizData;
  onComplete: (responses: Record<string, number>, history: ResponseHistory) => void;
}

// Type for storing the history of answers
type ResponseHistory = Record<string, {
  questionText: string;
  responseValue: number;
}>;

export function RiasecQuiz({ quizData, onComplete }: RiasecQuizProps) {
  const [currentQuestionId, setCurrentQuestionId] = useState<string | null>(quizData.startQuestionId);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [history, setHistory] = useState<ResponseHistory>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState<string[]>([]);

  const totalQuestions = quizData.quiz_metadata.total_questions;
  const progress = useMemo(() => (answeredQuestions.length / totalQuestions) * 100, [answeredQuestions, totalQuestions]);

  const handleScaleSelect = (question: Question, value: number) => {
    if (!currentQuestionId) return;

    // 1. Update scores based on profileImpact
    const newScores = { ...scores };
    const impact = question.profileImpact.riasec;
    for (const key in impact) {
      if (impact[key] === 'response_value') {
        newScores[key] = (newScores[key] ?? 0) + value;
      }
    }
    setScores(newScores);

    // 2. Record the detailed response in history
    const newHistory = { ...history };
    newHistory[currentQuestionId] = {
      questionText: question.text,
      responseValue: value,
    };
    setHistory(newHistory);

    // 3. Mark question as answered
    setAnsweredQuestions([...answeredQuestions, currentQuestionId]);
    
    // 4. Move to the next question or complete the quiz
    if (question.nextQuestionId) {
      setCurrentQuestionId(question.nextQuestionId);
    } else {
      setIsCompleted(true);
      onComplete(newScores, newHistory);
    }
  };

  const currentQuestion = currentQuestionId ? quizData.questions[currentQuestionId] : null;

  const getResultCard = () => {
    const sortedScores = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    const topThree = sortedScores.slice(0, 3).map(item => item[0]);

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <Card className="text-center">
          <CardHeader>
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <CardTitle className="mt-4 text-3xl font-bold">Assessment Complete!</CardTitle>
            <CardDescription>Thank you for sharing your interests. Your responses have been saved.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center gap-2 rounded-lg border p-4">
              <span className="text-sm text-muted-foreground">Your Top 3 Interest Areas (RIASEC Code)</span>
              <div className="flex items-center gap-3">
                <Trophy className="h-10 w-10 text-yellow-500" />
                <p className="text-2xl font-bold tracking-widest text-primary">
                  {topThree.map(code => code.charAt(0).toUpperCase()).join(' - ')}
                </p>
              </div>
              <p className="mt-2 text-sm text-muted-foreground capitalize">{topThree.join(', ')}</p>
            </div>
            <p className="text-sm text-muted-foreground px-4">
              We will now use these results to personalize your career and education recommendations on your dashboard.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  const scaleOptions = currentQuestion ? Array.from({ length: currentQuestion.scale_max }, (_, i) => i + 1) : [];

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-slate-50 p-4 font-sans">
      {!isCompleted && currentQuestion ? (
        <Card className="w-full max-w-3xl overflow-hidden shadow-lg">
          <CardHeader className="p-6">
            <Progress value={progress} className="mb-4" />
            <CardTitle className="text-center text-2xl md:text-3xl font-bold text-slate-800">{currentQuestion.text}</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestionId}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.4, type: 'spring', stiffness: 100, damping: 15 }}
                className="flex flex-col items-center"
              >
                <div className="flex w-full max-w-xl flex-wrap justify-between gap-2">
                  {scaleOptions.map((value) => (
                    <motion.div key={value} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1 min-w-[80px]">
                      <Button
                        variant="outline"
                        className="h-20 w-full flex-col p-2 text-center text-lg font-semibold transition-colors duration-200 focus:bg-primary/20 focus:ring-2 focus:ring-primary"
                        onClick={() => handleScaleSelect(currentQuestion, value)}
                      >
                        {value}
                      </Button>
                    </motion.div>
                  ))}
                </div>
                <div className="mt-4 flex w-full max-w-xl justify-between px-2 text-sm text-muted-foreground">
                  <span>{currentQuestion.scale_labels[currentQuestion.scale_min]}</span>
                  <span>{currentQuestion.scale_labels[currentQuestion.scale_max]}</span>
                </div>
              </motion.div>
            </AnimatePresence>
          </CardContent>
        </Card>
      ) : (
        getResultCard()
      )}
    </div>
  );
}