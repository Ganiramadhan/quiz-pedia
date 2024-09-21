interface QuizQuestion {
    question: string;
    correct_answer: string;
    answers: string[]; 
  }
  
  interface QuestionListProps {
    quizData: QuizQuestion[];
    selectedAnswers: string[];
    onQuestionClick: (index: number) => void;
  }
  
  const QuestionList: React.FC<QuestionListProps> = ({ quizData, selectedAnswers, onQuestionClick }) => (
    <ul className="grid grid-cols-3 gap-2">
      {quizData.map((_, index) => (
        <li key={index}>
          <button
            onClick={() => onQuestionClick(index)}
            className={`w-full p-2 border rounded-md ${
              selectedAnswers[index] ? 'bg-green-300' : 'bg-gray-100'
            } hover:bg-gray-200`}
          >
            {index + 1}
          </button>
        </li>
      ))}
    </ul>
  );
  
  export default QuestionList;
  