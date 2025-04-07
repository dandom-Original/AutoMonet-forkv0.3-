interface ArrayInputProps {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  className?: string;
}

const ArrayInput: React.FC<ArrayInputProps> = ({
  label,
  values,
  onChange,
  className = ''
}) => {
  const handleChange = (index: number, value: string) => {
    const newValues = [...values];
    newValues[index] = value;
    onChange(newValues);
  };
  
  const handleAdd = () => {
    onChange([...values, '']);
  };
  
  const handleRemove = (index: number) => {
    const newValues = [...values];
    newValues.splice(index, 1);
    onChange(newValues);
  };
  
  return (
    <div className={`mb-4 ${className}`}>
      <label className="block text-sm font-medium text-gray-400 mb-1">
        {label}
      </label>
      <div className="space-y-2">
        {values.map((value, index) => (
          <div key={index} className="flex gap-2">
            <input
              type="text"
              value={value}
              onChange={(e) => handleChange(index, e.target.value)}
              className="input-field flex-1"
            />
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="btn-secondary"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAdd}
          className="btn-secondary w-full"
        >
          Add Item
        </button>
      </div>
    </div>
  );
};

export default ArrayInput;
