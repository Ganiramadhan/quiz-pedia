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
  <div className="p-6 text-center">
    <Confetti />
    <h2 className="text-2xl font-bold">Quiz Results</h2>
    <p className="mt-4 text-lg">
      Your score: <span className="text-blue-600">{score} out of {quizData.length}</span>
    </p>
    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {quizData.map((question, index) => (
        <div key={index} className="p-4 border rounded-lg shadow-lg bg-white">
          <h3 className="text-lg font-semibold">Question {index + 1}: {question.question}</h3>
          <p className="mt-2">
            <strong>Your answer:</strong> {selectedAnswers[index] || 'No answer selected'}
          </p>
          <p className="mt-1">
            <strong>Correct answer:</strong> {question.correct_answer}
          </p>
        </div>
      ))}
    </div>
    <div className="flex justify-center mt-6">
      <button
        onClick={onRestartQuiz}
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
      >
        Restart Quiz
      </button>
    </div>
  </div>
);

export default Results;
