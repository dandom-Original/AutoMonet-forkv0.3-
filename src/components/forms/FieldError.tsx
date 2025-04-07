interface FieldErrorProps {
  message?: string;
}

const FieldError: React.FC<FieldErrorProps> = ({ message }) => {
  if (!message) return null;
  
  return (
    <p className="text-sm text-red-500 mt-1 flex items-center">
      <FiAlertCircle className="mr-1" /> {message}
    </p>
  );
};

export default FieldError;
