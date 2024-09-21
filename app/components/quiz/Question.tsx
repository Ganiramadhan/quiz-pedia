interface QuestionProps {
    question: string;
    answers: string[];
    selectedAnswer: string | undefined;
    onAnswerSelect: (answer: string) => void;
  }
  
  const Question = ({ question, answers, selectedAnswer, onAnswerSelect }: QuestionProps) => (
    <div className="p-4 border rounded-lg shadow-lg bg-white">
      <h2 className="text-lg font-semibold">{question}</h2>
      <ul className="space-y-2 mt-2">
        {answers.map((answer) => (
          <li
            key={answer}
            onClick={() => onAnswerSelect(answer)}
            className={`p-2 border rounded-md cursor-pointer ${
              selectedAnswer === answer ? 'bg-blue-200' : 'bg-gray-100'
            }`}
          >
            {answer}
          </li>
        ))}
      </ul>
    </div>
  );
  
  export default Question;
  