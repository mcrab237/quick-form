export function FormInput({
  label,
  name,
  type = "text",
  value,
  onChange,
  error,
  required = false,
  placeholder = "",
  maxLength,
  minLength,
  pattern,
  helpText,
  disabled = false,
}) {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="input-label">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        className={`input-field ${
          error ? "border-red-500 focus:ring-red-200 focus:border-red-500" : ""
        }`}
        placeholder={placeholder}
        maxLength={maxLength}
        minLength={minLength}
        pattern={pattern}
        disabled={disabled}
        required={required}
      />
      {helpText && !error && (
        <p className="text-gray-500 text-sm mt-1">{helpText}</p>
      )}
      {error && <p className="input-error">{error}</p>}
    </div>
  );
}

export function FormSelect({
  label,
  name,
  value,
  onChange,
  options,
  error,
  required = false,
  placeholder = "Select an option",
}) {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="input-label">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        className={`input-field ${
          error ? "border-red-500 focus:ring-red-200 focus:border-red-500" : ""
        }`}
        required={required}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="input-error">{error}</p>}
    </div>
  );
}

export function FormRadioGroup({
  label,
  name,
  value,
  onChange,
  options,
  error,
  required = false,
}) {
  return (
    <div className="mb-4">
      <label className="input-label">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="mt-2 space-y-2">
        {options.map((option) => (
          <label
            key={option.value}
            className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
              value === option.value
                ? "border-primary-500 bg-primary-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={(e) => onChange(name, e.target.value)}
              className="w-4 h-4 text-primary-600 focus:ring-primary-500"
            />
            <span className="ml-3 text-gray-700">{option.label}</span>
          </label>
        ))}
      </div>
      {error && <p className="input-error">{error}</p>}
    </div>
  );
}

export function FormTextarea({
  label,
  name,
  value,
  onChange,
  error,
  required = false,
  placeholder = "",
  rows = 3,
  minLength,
  helpText,
}) {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="input-label">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        className={`input-field resize-none ${
          error ? "border-red-500 focus:ring-red-200 focus:border-red-500" : ""
        }`}
        placeholder={placeholder}
        rows={rows}
        minLength={minLength}
        required={required}
      />
      {helpText && !error && (
        <p className="text-gray-500 text-sm mt-1">{helpText}</p>
      )}
      {error && <p className="input-error">{error}</p>}
    </div>
  );
}
