'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, BookOpen, Lightbulb } from 'lucide-react';
import { type DomainQuizData, type Answer, type Question } from '@/data/domain-quiz-data';
import { merge } from 'lodash'; // A utility for deep merging objects

// Define the types for our component's props and state
interface QuizEngineProps {
  quizData: DomainQuizData;
  onComplete: (results: Record<string, unknown>, history: ResponseHistory) => void;
}

// Type for storing the history of answers
type ResponseHistory = Record<string, {
  questionText: string;
  selectedAnswerText: string;
}>;

export function QuizEngine({ quizData, onComplete }: QuizEngineProps) {
  const [quizState, setQuizState] = useState<'intro' | 'in_progress' | 'completed'>('intro');
  const [currentQuestionId, setCurrentQuestionId] = useState<string | null>(quizData.startQuestionID);
  const [results, setResults] = useState<Record<string, unknown>>({});
  const [history, setHistory] = useState<ResponseHistory>({});
  const [answeredQuestions, setAnsweredQuestions] = useState<string[]>([]);

  const totalQuestions = quizData.quiz_metadata.total_questions;
  const progress = useMemo(() => (answeredQuestions.length / totalQuestions) * 100, [answeredQuestions, totalQuestions]);
  const estimatedTime = useMemo(() => Math.ceil(totalQuestions * 10 / 60), [totalQuestions]); // Approx 10 seconds per question

  const handleAnswerSelect = (answer: Answer) => {
    if (!currentQuestionId) return;

    // 1. Deep merge the profile_impact from the answer into the results
    const newResults = merge({}, results, answer.profile_impact);
    setResults(newResults);

    // 2. Record the detailed response in history
    const currentQuestionText = quizData.questions[currentQuestionId]?.text ?? '';
    const newHistory = {
      ...history,
      [currentQuestionId]: {
        questionText: currentQuestionText,
        selectedAnswerText: answer.text,
      },
    };
    setHistory(newHistory);

    // 3. Mark question as answered
    setAnsweredQuestions([...answeredQuestions, currentQuestionId]);
    
    // 4. Move to the next question or complete the quiz
    if (answer.nextQuestionId) {
      setCurrentQuestionId(answer.nextQuestionId);
    } else {
      setQuizState('completed');
      onComplete(newResults, newHistory);
    }
  };

  const currentQuestion = currentQuestionId ? quizData.questions[currentQuestionId] : null;

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
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                <BookOpen className="h-12 w-12 text-primary" />
            </div>
          <CardTitle className="mt-4 text-3xl font-bold">{quizData.quiz_metadata.title}</CardTitle>
          <CardDescription className="text-lg">Answer a few questions to help us understand your strengths and preferences.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <div className="text-left space-y-3 rounded-lg border bg-slate-50 p-4">
              <h3 className="font-semibold flex items-center gap-2"><Lightbulb className="h-5 w-5 text-yellow-500"/>Tips for Best Results</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 text-sm">
                <li>Be honest with your answers.</li>
                <li>This will help us personalize your experience.</li>
              </ul>
          </div>
          <Button size="lg" className="w-full text-lg" onClick={() => setQuizState('in_progress')}>
            Start Assessment
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );

  const getQuestionCard = () => {
    return (
      currentQuestion &&
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
            <CardTitle className="text-center text-2xl md:text-3xl font-bold text-slate-800">{currentQuestion.text}</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestionId}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center gap-3"
              >
                {currentQuestion.answers.map((answer, index) => (
                  <motion.div key={index} className="w-full max-w-md" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      variant="outline"
                      className="h-auto w-full p-4 text-base whitespace-normal justify-start"
                      onClick={() => handleAnswerSelect(answer)}
                    >
                      {answer.text}
                    </Button>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  const getResultCard = () => (
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
            <CardTitle className="mt-4 text-3xl font-bold">Assessment Complete!</CardTitle>
            <CardDescription className="text-lg">Thank you for your responses. We are now personalizing your dashboard.</CardDescription>
          </CardHeader>
        </Card>
      </motion.div>
  );

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-slate-50 p-4 font-sans">
        <AnimatePresence mode="wait">
            {quizState === 'intro' && getIntroCard()}
            {quizState === 'in_progress' && getQuestionCard()}
            {quizState === 'completed' && getResultCard()}
        </AnimatePresence>
    </div>
  );
}
