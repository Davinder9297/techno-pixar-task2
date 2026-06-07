import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  fullPage?: boolean;
  size?: number;
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  fullPage = false, 
  size = 40,
  message = 'Loading...'
}) => {
  const content = (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative">
        <Loader2 
          size={size} 
          className="text-blue-500 animate-spin" 
        />
        <div 
          className="absolute inset-0 blur-xl bg-blue-500/20 rounded-full animate-pulse"
          style={{ width: size, height: size }}
        ></div>
      </div>
      {message && (
        <p className="text-slate-400 font-semibold tracking-tight text-sm uppercase">
          {message}
        </p>
      )}
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 z-[200] bg-[#020617] flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
};

export default LoadingSpinner;
