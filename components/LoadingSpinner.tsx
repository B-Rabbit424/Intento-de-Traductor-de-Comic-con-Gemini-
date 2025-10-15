import React from 'react';

interface LoadingSpinnerProps {
  text?: string;
}

export function LoadingSpinner({ text = 'Translating images, please wait...' }: LoadingSpinnerProps): React.ReactElement {
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex flex-col items-center justify-center z-50">
      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-indigo-500"></div>
      <p className="text-white text-lg mt-4">{text}</p>
    </div>
  );
}
