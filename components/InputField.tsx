import React, { useState } from 'react';

interface InputFieldProps {
  label: string;
  type: 'text' | 'password' | 'email';
  value: string;
  onChange: (val: string) => void;
  error?: string | string[];
  placeholder?: string;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  type,
  value,
  onChange,
  error,
  placeholder
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  
  const isPassword = type === 'password';
  const currentType = isPassword ? (showPassword ? 'text' : 'password') : type;
  
  const hasValue = value.length > 0;
  const hasError = !!error && (Array.isArray(error) ? error.length > 0 : true);
  const errorList = Array.isArray(error) ? error : (error ? [error] : []);

  return (
    <div className="mb-4 w-full group">
      <div 
        className={`relative flex flex-col border-[3px] rounded-[2rem] transition-all duration-200 px-7 py-3 min-h-[84px] justify-center
          ${hasError ? 'border-red-600 bg-white shadow-[0_0_0_1px_rgba(220,27,34,0.1)]' : isFocused ? 'border-black ring-2 ring-black/5' : 'border-black bg-white'}
        `}
      >
        {/* Floating Label - turns red on error */}
        <label 
          className={`text-[13px] font-black uppercase tracking-wider transition-all duration-200 select-none
            ${hasError ? 'text-red-600' : 'text-gray-400'}
            ${(hasValue || isFocused) ? 'opacity-100 translate-y-0 mb-1' : 'opacity-0 translate-y-2 pointer-events-none h-0'}
          `}
        >
          {label}
        </label>

        <div className="flex items-center">
          <input
            type={currentType}
            value={value}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onChange={(e) => onChange(e.target.value)}
            placeholder={!isFocused ? placeholder || label : ''}
            className={`w-full bg-transparent outline-none text-gray-900 font-bold text-xl py-1 placeholder-gray-400 transition-all
              ${(hasValue || isFocused) ? 'mt-[-2px]' : 'mt-0'}
            `}
          />
          
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="ml-2 text-gray-800 hover:text-black focus:outline-none transition-transform active:scale-90"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              <i className={`fa-regular ${showPassword ? 'fa-eye-slash' : 'fa-eye'} text-2xl`}></i>
            </button>
          )}
        </div>
      </div>

      {/* Multiple Inline Error Display */}
      {errorList.length > 0 && (
        <div className="mt-2 ml-4 space-y-1 animate-fade-in">
          {errorList.map((err, idx) => (
            <div key={idx} className="flex items-center gap-2 text-red-600">
              <span className="w-1 h-1 bg-red-600 rounded-full" />
              <p className="text-[14px] font-bold leading-tight">
                {err}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};