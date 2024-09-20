'use client';
import { useState, useEffect } from "react";
import { FaSpinner } from 'react-icons/fa';
import Swal from 'sweetalert2';
import Confetti from 'react-confetti';

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
        const res = await fetch('https://opentdb.com/api.php?amount=10&category=9&difficulty=medium&type=multiple');
        const data = await res.json();
        const processedData = shuffleAnswers(data.results);
        setQuizData(processedData);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch quiz data");
        setLoading(false);
      }
    };

    fetchQuizData();
  }, []);

  const shuffleAnswers = (data: QuizQuestion[]) => {
    return data.map((question) => ({
      ...question,
      answers: [...question.incorrect_answers, question.correct_answer].sort(() => Math.random() - 0.5)
    }));
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
    setQuizData(shuffleAnswers(quizData));
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-screen">
        <FaSpinner className="animate-spin text-blue-500 mx-auto" size={40} />
        {/* <p>Loading...</p> */}
      </div>
    );
  }

  if (error) {
    return <div className="p-6 text-center text-red-600">{error}</div>;
  }

  const currentQuestion = quizData[currentQuestionIndex];
  const answers = currentQuestion.answers;

  // Hitung progress berdasarkan soal yang sudah dijawab
  const answeredQuestionsCount = selectedAnswers.filter(answer => answer !== undefined).length;
  const progress = Math.round((answeredQuestionsCount / quizData.length) * 100);

  if (isSubmitted) {
    return (
      <div className="p-6 text-center">
        <Confetti />
        <h2 className="text-2xl font-bold">Quiz Results</h2>
        <p className="mt-4 text-lg">Your score: <span className="text-blue-600">{score} out of {quizData.length}</span></p>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quizData.map((question, index) => (
            <div key={index} className="p-4 border rounded-lg shadow-lg bg-white">
              <h3 className="text-lg font-semibold">
                Question {index + 1}: {question.question}
              </h3>
              <p className="mt-2">
                <strong>Your answer:</strong> {selectedAnswers[index]}
              </p>
              <p className="mt-1">
                <strong>Correct answer:</strong> {question.correct_answer}
              </p>
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-6">
          <button
            onClick={handleRestartQuiz}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
          >
            Restart Quiz
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 flex">
      <div className="w-1/4 pr-6">
        <h2 className="text-lg font-semibold mb-4">Questions</h2>
        <ul className="grid grid-cols-3 gap-2">
          {quizData.map((_, index) => (
            <li key={index}>
              <button
                onClick={() => handleQuestionClick(index)}
                className={`w-full p-2 border rounded-md ${selectedAnswers[index] ? 'bg-green-300' : 'bg-gray-100'} hover:bg-gray-200`}
              >
                {index + 1}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="w-3/4">
        <h1 className="text-xl font-bold text-center mb-6">English Quiz</h1>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
          <div
            className="bg-blue-500 h-4 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <div className="p-4 border rounded-lg shadow-lg bg-white">
          <h2 className="text-lg font-semibold">
            Question {currentQuestionIndex + 1}: {currentQuestion.question}
          </h2>
          <ul className="space-y-2 mt-2">
            {answers.map((answer) => (
              <li
                key={answer}
                onClick={() => handleAnswerSelect(answer)}
                className={`p-2 border rounded-md cursor-pointer ${selectedAnswers[currentQuestionIndex] === answer ? 'bg-blue-200' : 'bg-gray-100'}`}
              >
                {answer}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex justify-between mt-6">
          {currentQuestionIndex < quizData.length - 1 ? (
            <button
              onClick={handleNextQuestion}
              disabled={!selectedAnswers[currentQuestionIndex]}
              className={`px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition ${!selectedAnswers[currentQuestionIndex] ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Next
            </button>
          ) : (
            <div className="flex space-x-4">
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
              >
                Submit
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
