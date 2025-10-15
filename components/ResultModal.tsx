import React from 'react';
import type { TranslationResult } from '../types';

interface ResultModalProps {
  result: TranslationResult | null;
  onClose: () => void;
}

export function ResultModal({ result, onClose }: ResultModalProps): React.ReactElement | null {
  if (!result) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full p-4 relative" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-white text-2xl font-bold">&times;</button>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <h3 className="text-lg font-semibold mb-2">Original</h3>
                <img src={result.originalImageUrl} alt="Original comic page" className="w-full h-auto rounded" />
            </div>
            <div>
                <h3 className="text-lg font-semibold mb-2">Translated</h3>
                <img src={result.translatedImageUrl} alt="Translated comic page" className="w-full h-auto rounded" />
            </div>
        </div>
        {result.error && (
            <div className="mt-4 p-3 bg-red-900 border border-red-700 rounded text-red-300">
                <h4 className="font-bold">Error</h4>
                <p>{result.error}</p>
            </div>
        )}
      </div>
    </div>
  );
}
