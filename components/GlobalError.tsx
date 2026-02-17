import React from 'react';

interface GlobalErrorProps {
  message?: string;
}

export const GlobalError: React.FC<GlobalErrorProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div className="mb-8 p-5 bg-[#FDE8E8] rounded-[1.25rem] flex items-start animate-fade-in shadow-sm border border-[#F8B4B4]/30">
      <div className="flex-shrink-0 mt-0.5">
        <i className="fa-solid fa-circle-exclamation text-[#C81E1E] text-xl"></i>
      </div>
      <div className="ml-4">
        <p className="text-[16px] font-bold text-[#C81E1E] leading-snug">
          {message}
        </p>
      </div>
    </div>
  );
};