'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Trophy, BookOpen, Clock, Lightbulb } from 'lucide-react';
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
  const [quizState, setQuizState] = useState<'intro' | 'in_progress' | 'completed'>('intro');
  const [currentQuestionId, setCurrentQuestionId] = useState<string | null>(quizData.startQuestionId);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [history, setHistory] = useState<ResponseHistory>({});
  const [answeredQuestions, setAnsweredQuestions] = useState<string[]>([]);

  const totalQuestions = quizData.quiz_metadata.total_questions;
  const progress = useMemo(() => (answeredQuestions.length / totalQuestions) * 100, [answeredQuestions, totalQuestions]);
  const estimatedTime = useMemo(() => Math.ceil(totalQuestions * 15 / 60), [totalQuestions]); // Approx 15 seconds per question

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
      setQuizState('completed');
      onComplete(newScores, newHistory);
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
          <CardTitle className="mt-4 text-3xl font-bold">{quizData.quiz_metadata.assessment_type} Assessment</CardTitle>
          <CardDescription className="text-lg">Discover your core interests to find matching career paths.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <div className="grid grid-cols-2 gap-4 text-left">
            <div className="rounded-lg border p-4">
                <p className="text-sm font-medium text-muted-foreground">Questions</p>
                <p className="text-2xl font-bold">{totalQuestions}</p>
            </div>
            <div className="rounded-lg border p-4">
                <p className="text-sm font-medium text-muted-foreground">Est. Time</p>
                <p className="text-2xl font-bold">~{estimatedTime} mins</p>
            </div>
          </div>
          <div className="text-left space-y-3 rounded-lg border bg-slate-50 p-4">
              <h3 className="font-semibold flex items-center gap-2"><Lightbulb className="h-5 w-5 text-yellow-500"/>Tips for Best Results</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 text-sm">
                <li>Answer honestly based on what you enjoy, not what you think you should.</li>
                <li>Don&apos;t overthink it—your first instinct is usually the best.</li>
                <li>There are no right or wrong answers. This is about you!</li>
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
    const scaleOptions = currentQuestion ? Array.from({ length: currentQuestion.scale_max }, (_, i) => i + 1) : [];
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
      </motion.div>
    );
  }

  const getResultCard = () => {
    const sortedScores = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    const topThree = sortedScores.slice(0, 3).map(item => item[0]);

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
            <CardTitle className="mt-4 text-3xl font-bold">Assessment Complete!</CardTitle>
            <CardDescription className="text-lg">Thank you for sharing your interests. Your responses have been saved.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 p-6">
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