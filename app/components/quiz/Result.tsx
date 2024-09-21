import { useEffect, useState } from 'react';
import Confetti from 'react-confetti';
import { FaSpinner } from 'react-icons/fa';

interface QuizQuestion {
  question: string;
  correct_answer: string;
  answers: string[];
}

interface ResultsProps {
  quizData: QuizQuestion[];
  selectedAnswers: string[];
  score: number;
  userName: string;
  onRestartQuiz: () => void;
}

const Results = ({ quizData, selectedAnswers, score, userName, onRestartQuiz }: ResultsProps) => {
  const [visibleQuestions, setVisibleQuestions] = useState(3);
  const [loading, setLoading] = useState(false);

  const handleScroll = () => {
    const bottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 50;
    if (bottom && visibleQuestions < quizData.length && !loading) {
      setLoading(true);
      setTimeout(() => {
        setVisibleQuestions(prev => prev + 3);
        setLoading(false);
      }, 1000);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [visibleQuestions, loading, quizData.length]);

  return (
    <div className="p-6 text-center bg-gray-50 min-h-screen">
      <Confetti />
      <h2 className="text-3xl font-bold mb-4 text-blue-600">Quiz Results</h2>
      <p className="text-2xl text-gray-800 font-semibold mb-6">
        Congratulations, <span className="text-blue-500">{userName}</span>! 🎉
      </p>
      <p className="mt-4 text-xl">
        Your score: <span className="text-blue-800 font-semibold">{score} out of {quizData.length}</span>
      </p>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizData.slice(0, visibleQuestions).map((question, index) => (
          <div
            key={index}
            className="p-4 border border-gray-300 rounded-lg shadow-md bg-white transition-transform transform hover:scale-105 hover:shadow-lg"
          >
            <h3 className="text-lg font-semibold mb-2 text-gray-700">Question {index + 1}</h3>
            <p className="text-gray-700">{question.question}</p>
            <p className="mt-2">
              <strong>Your answer:</strong>{' '}
              <span className={selectedAnswers[index] === question.correct_answer ? 'text-green-500 font-semibold' : 'text-red-500 font-semibold'}>
                {selectedAnswers[index] || 'No answer selected'}
              </span>
            </p>
            <p className="mt-1">
              <strong>Correct answer:</strong>{' '}
              <span className="text-blue-500 font-semibold">{question.correct_answer}</span>
            </p>
          </div>
        ))}
      </div>
      {loading && (
        <div className="flex justify-center mt-6">
          <FaSpinner className="animate-spin text-blue-500 text-3xl" />
        </div>
      )}
      <div className="flex justify-center mt-8">
        <button
          onClick={onRestartQuiz}
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-md hover:from-blue-600 hover:to-blue-700 transition duration-300 transform hover:scale-105 shadow-lg"
        >
          Restart Quiz
        </button>
      </div>
    </div>
  );
};

export default Results;
