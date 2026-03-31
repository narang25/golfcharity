export interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  name: string;
  label: string;
  error?: string;
}

export function FormInput({ id, name, label, error, ...props }: FormInputProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium text-emerald-950/70 ml-1">
        {label}
      </label>
      <input
        id={id}
        name={name}
        className={`w-full px-4 py-3 bg-white/50 backdrop-blur-sm border rounded-2xl outline-none transition-all duration-300 focus:bg-white placeholder:text-gray-400
          ${error 
            ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20" 
            : "border-gray-200 focus:border-emerald-500 hover:border-emerald-200 focus:ring-2 focus:ring-emerald-500/20"
          }`}
        {...props}
      />
      {error && (
        <p className="text-xs text-red-500 mt-1 ml-1 animate-in fade-in slide-in-from-top-1">
          {error}
        </p>
      )}
    </div>
  );
}
