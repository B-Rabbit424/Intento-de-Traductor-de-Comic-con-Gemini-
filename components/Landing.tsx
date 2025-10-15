import React from 'react';
import { UploadForm } from './UploadForm';

interface LandingProps {
    onTranslate: (files: File[], sourceLang: string, targetLang: string) => void;
    isTranslating: boolean;
}

export function Landing({ onTranslate, isTranslating }: LandingProps): React.ReactElement {
  return (
    <main className="flex-grow flex flex-col items-center justify-center p-4">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-extrabold text-white sm:text-5xl">
          Translate Your Webtoons Instantly
        </h2>
        <p className="mt-4 text-xl text-gray-400">
          Upload your comic pages and let Gemini AI handle the translation.
        </p>
      </div>
      <UploadForm onTranslate={onTranslate} isTranslating={isTranslating} />
    </main>
  );
}
