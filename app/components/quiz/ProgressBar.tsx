interface ProgressBarProps {
    progress: number;
  }
  
  const ProgressBar = ({ progress }: ProgressBarProps) => (
    <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
      <div
        className="bg-blue-500 h-4 rounded-full"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
  
  export default ProgressBar;
  