import Confetti from 'react-confetti';

interface QuizQuestion {
  question: string;
  correct_answer: string;
  answers: string[];
}

interface ResultsProps {
  quizData: QuizQuestion[];
  selectedAnswers: string[];
  score: number;
  onRestartQuiz: () => void;
}

const Results = ({ quizData, selectedAnswers, score, onRestartQuiz }: ResultsProps) => (
  <div className="p-6 text-center bg-gray-50 min-h-screen">
    <Confetti />
    <h2 className="text-3xl font-bold mb-4 text-blue-600">Quiz Results</h2>
    <p className="mt-4 text-xl">
      Your score: <span className="text-blue-800 font-semibold">{score} out of {quizData.length}</span>
    </p>
    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {quizData.map((question, index) => (
        <div key={index} className="p-4 border border-gray-300 rounded-lg shadow-md bg-white transition-transform transform hover:scale-105">
          <h3 className="text-lg font-semibold mb-2">Question {index + 1}</h3>
          <p className="text-gray-700">{question.question}</p>
          <p className="mt-2">
            <strong>Your answer:</strong> <span className={selectedAnswers[index] === question.correct_answer ? 'text-green-500' : 'text-red-500'}>{selectedAnswers[index] || 'No answer selected'}</span>
          </p>
          <p className="mt-1">
            <strong>Correct answer:</strong> <span className="text-blue-500">{question.correct_answer}</span>
          </p>
        </div>
      ))}
    </div>
    <div className="flex justify-center mt-6">
      <button
        onClick={onRestartQuiz}
        className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300 shadow-md"
      >
        Restart Quiz
      </button>
    </div>
  </div>
);

export default Results;
