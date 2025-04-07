interface FormInputProps {
  label: string;
  type: string;
  value: any;
  onChange: (value: any) => void;
  error?: string;
  className?: string;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  type,
  value,
  onChange,
  error,
  className = ''
}) => {
  const inputClasses = `input-field ${error ? 'border-red-500' : ''} ${className}`;
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = type === 'number' || type === 'range' 
      ? parseFloat(e.target.value) 
      : e.target.value;
      
    onChange(val);
  };
  
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-400 mb-1">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={handleChange}
        className={inputClasses}
      />
      <FieldError message={error} />
    </div>
  );
};

export default FormInput;
