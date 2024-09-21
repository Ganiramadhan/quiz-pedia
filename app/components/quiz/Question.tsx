interface QuestionProps {
    question: string;
    answers: string[];
    selectedAnswer: string | undefined;
    onAnswerSelect: (answer: string) => void;
  }
  
  const Question = ({ question, answers, selectedAnswer, onAnswerSelect }: QuestionProps) => {
    return (
      <div className="p-4 border rounded-lg shadow-lg bg-white" style={{ userSelect: 'none' }}>
        <h2 className="text-lg font-semibold mb-4">{question}</h2>
        <ul className="space-y-2">
          {answers.map((answer, index) => {
            const label = String.fromCharCode(65 + index); 
            
            return (
              <li
                key={answer}
                onClick={() => onAnswerSelect(answer)}
                className={`p-3 border rounded-md cursor-pointer ${
                  selectedAnswer === answer ? 'bg-blue-400 border-blue-500' : 'bg-gray-100 border-gray-300'
                }`}
              >
                <span className="font-semibold">{label}:</span> {answer}
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
  
  export default Question;
  