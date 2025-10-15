import React, { useEffect } from 'react';
import type { TranslationResult } from '../types';

interface WebtoonViewerProps {
  results: TranslationResult[];
  onReset: () => void;
}

export function WebtoonViewer({ results, onReset }: WebtoonViewerProps): React.ReactElement {
  useEffect(() => {
    // Clean up object URLs when the component unmounts or results change to prevent memory leaks
    return () => {
      results.forEach(result => {
        // The original image is always an object URL that needs cleanup
        if (result.originalImageUrl.startsWith('blob:')) {
          URL.revokeObjectURL(result.originalImageUrl);
        }
        // The translated image might be an object URL too, if translation failed
        if (result.translatedImageUrl.startsWith('blob:')) {
          URL.revokeObjectURL(result.translatedImageUrl);
        }
      });
    };
  }, [results]);

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <button
          onClick={onReset}
          className="py-2 px-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 transition-colors"
        >
          Translate New Images
        </button>
      </div>

      <div className="bg-gray-900 flex flex-col items-center space-y-0">
        {results.map((result) => (
          <div key={result.id} className="w-full max-w-3xl mb-4 bg-black shadow-lg relative">
            <img 
              src={result.translatedImageUrl} 
              alt="Translated comic page" 
              className="w-full h-auto block"
            />
            {result.error && (
              <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4">
                  <div className="text-center text-red-400 bg-gray-900 bg-opacity-80 p-4 rounded-lg">
                      <h3 className="text-lg font-bold">Translation Error</h3>
                      <p className="text-sm">{result.error}</p>
                  </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
