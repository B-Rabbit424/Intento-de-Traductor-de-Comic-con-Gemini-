import React from 'react';

export function Header(): React.ReactElement {
  return (
    <header className="bg-gray-900 shadow-md">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">
          Webtoon Translator
        </h1>
        <p className="text-indigo-400">Powered by Gemini</p>
      </div>
    </header>
  );
}
