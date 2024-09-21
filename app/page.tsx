'use client';
import { useState, useEffect } from "react";
import { FaSpinner } from 'react-icons/fa';
import Swal from 'sweetalert2';
import ProgressBar from '@/components/quiz/ProgressBar';
import Question from '@/components/quiz/Question';
import QuestionList from '@/components/quiz/QuestionList';
import Results from '@/components/quiz/Result';

const API_KEY = process.env.NEXT_PUBLIC_QUIZ_API_KEY;

interface QuizQuestion {
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
  answers: string[];
}

export default function Home() {
  const [quizData, setQuizData] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const res = await fetch(`https://quizapi.io/api/v1/questions?apiKey=${API_KEY}&category=linux&limit=10`);
        const data = await res.json();

        const processedData: QuizQuestion[] = data.map((question: any) => {
          const correctAnswerKey = Object.keys(question.correct_answers).find(
            (key) => question.correct_answers[key as keyof typeof question.correct_answers] === 'true'
          );
        
          const correctAnswer = correctAnswerKey
            ? question.answers[correctAnswerKey.replace('_correct', '') as keyof typeof question.answers]
            : null;
        
          const answersArray = Object.values(question.answers).filter((answer) => answer !== null) as string[];
        
          return {
            question: question.question,
            correct_answer: correctAnswer ?? "",
            incorrect_answers: answersArray.filter(
              (answer) => answer !== correctAnswer
            ),
            answers: shuffleAnswers(answersArray),
          };
        });

        setQuizData(processedData);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch quiz data");
        setLoading(false);
      }
    };

    fetchQuizData();
  }, []);

  const shuffleAnswers = (answers: string[]) => {
    return answers.sort(() => Math.random() - 0.5);
  };

  const handleAnswerSelect = (answer: string) => {
    const updatedAnswers = [...selectedAnswers];
    updatedAnswers[currentQuestionIndex] = answer;
    setSelectedAnswers(updatedAnswers);
  };

  const handleQuestionClick = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizData.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleSubmit = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You are about to submit your answers.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, submit it!'
    }).then((result) => {
      if (result.isConfirmed) {
        let calculatedScore = 0;
        selectedAnswers.forEach((answer, index) => {
          if (answer === quizData[index].correct_answer) {
            calculatedScore++;
          }
        });
        setScore(calculatedScore);
        setIsSubmitted(true);
      }
    });
  };

  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setIsSubmitted(false);
    setSelectedAnswers([]);
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-screen">
        <FaSpinner className="animate-spin text-blue-500 mx-auto" size={40} />
      </div>
    );
  }

  if (error) {
    return <div className="p-6 text-center text-red-600">{error}</div>;
  }

  const currentQuestion = quizData[currentQuestionIndex];
  const answers = currentQuestion.answers;
  const answeredQuestionsCount = selectedAnswers.filter(answer => answer !== undefined).length;
  const progress = Math.round((answeredQuestionsCount / quizData.length) * 100);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-4">Linux Quiz</h1>
      {!isSubmitted ? (
        <>
          <ProgressBar progress={progress} />
          <div className="flex flex-col lg:flex-row lg:space-x-4">
            <div className="flex-1">
              <Question
                question={currentQuestion.question}
                answers={answers}
                selectedAnswer={selectedAnswers[currentQuestionIndex]}
                onAnswerSelect={handleAnswerSelect}
              />
              <div className="flex justify-between mt-4">
                {currentQuestionIndex < quizData.length - 1 && (
                  <button
                    onClick={handleNextQuestion}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                  >
                    Next
                  </button>
                )}
                {currentQuestionIndex === quizData.length - 1 && (
                  <button
                    onClick={handleSubmit}
                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
                  >
                    Submit
                  </button>
                )}
              </div>
            </div>
            <div className="w-full lg:w-1/4">
              <QuestionList
                quizData={quizData}
                selectedAnswers={selectedAnswers}
                onQuestionClick={handleQuestionClick}
              />
            </div>
          </div>
        </>
      ) : (
        <Results
          quizData={quizData}
          selectedAnswers={selectedAnswers}
          score={score}
          onRestartQuiz={handleRestartQuiz}
        />
      )}
    </div>
  );
}
