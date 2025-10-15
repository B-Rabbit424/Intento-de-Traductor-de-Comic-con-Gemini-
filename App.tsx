import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { Landing } from './components/Landing';
import { LoadingSpinner } from './components/LoadingSpinner';
import { WebtoonViewer } from './components/WebtoonViewer';
import { Cropper } from './components/Cropper';
import { translateImage } from './services/geminiService';
import { TranslationResult } from './types';
import { saveToHistory } from './services/historyService';

export default function App(): React.ReactElement {
  const [isTranslating, setIsTranslating] = useState(false);
  const [results, setResults] = useState<TranslationResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Cropper state
  const [croppingFile, setCroppingFile] = useState<{file: File, fileUrl: string} | null>(null);
  const [filesToProcess, setFilesToProcess] = useState<File[]>([]);
  const [sourceLang, setSourceLang] = useState('');
  const [targetLang, setTargetLang] = useState('');
  const [processedResults, setProcessedResults] = useState<TranslationResult[]>([]);

  const processFile = useCallback(async (file: File, srcLang: string, tgtLang: string, cropBlob: Blob | null) => {
    const originalImageUrl = URL.createObjectURL(cropBlob || file);
    const result: TranslationResult = {
      id: file.name,
      originalImageUrl,
      translatedImageUrl: '',
      error: undefined,
    };

    try {
      const translatedDataUrl = await translateImage(file, srcLang, tgtLang, cropBlob);
      result.translatedImageUrl = translatedDataUrl;
    } catch (e: any) {
      result.error = e.message || 'An unknown error occurred.';
      result.translatedImageUrl = originalImageUrl; // Show original on error
    }
    return result;
  }, []);

  const processNextFile = useCallback(async (
    files: File[], 
    srcLang: string, 
    tgtLang: string, 
    currentResults: TranslationResult[]
  ) => {
    if (files.length === 0) {
      setResults(currentResults);
      setIsTranslating(false);
      if (currentResults.length > 0) {
        saveToHistory({
          id: Date.now().toString(),
          timestamp: Date.now(),
          previewImageUrl: currentResults[0]?.translatedImageUrl || '',
          imageCount: currentResults.length,
          results: currentResults,
        });
      }
      return;
    }

    const [nextFile, ...remainingFiles] = files;
    setFilesToProcess(remainingFiles);
    setCroppingFile({ file: nextFile, fileUrl: URL.createObjectURL(nextFile) });
    setProcessedResults(currentResults);
  }, []);

  const handleTranslate = useCallback((files: File[], srcLang: string, tgtLang: string) => {
    setIsTranslating(true);
    setError(null);
    setResults([]);
    setSourceLang(srcLang);
    setTargetLang(tgtLang);
    processNextFile(files, srcLang, tgtLang, []);
  }, [processNextFile]);
  
  const handleCropConfirm = async (cropBlob: Blob | null) => {
    if (croppingFile) {
      // Show loading spinner while processing the single file
      setIsTranslating(true);
      const currentFileToProcess = croppingFile.file;
      const fileUrlToRevoke = croppingFile.fileUrl;
      setCroppingFile(null); // Hide cropper
      
      const result = await processFile(currentFileToProcess, sourceLang, targetLang, cropBlob);
      
      const newResults = [...processedResults, result];
      URL.revokeObjectURL(fileUrlToRevoke);
      
      // Continue with next file
      processNextFile(filesToProcess, sourceLang, targetLang, newResults);
    }
  };

  const handleCropCancel = () => {
    if(croppingFile){
       // Skip cropping and just process the whole image by passing null blob
       handleCropConfirm(null);
    }
  };

  const handleReset = () => {
    setResults([]);
    setError(null);
    setProcessedResults([]);
    setFilesToProcess([]);
    setCroppingFile(null);
  };

  return (
    <div className="bg-gray-800 text-white min-h-screen flex flex-col font-sans">
      <Header />
      {isTranslating && !croppingFile && <LoadingSpinner />}
      {croppingFile && (
        <Cropper 
          imageUrl={croppingFile.fileUrl} 
          onConfirm={handleCropConfirm}
          onCancel={handleCropCancel}
        />
      )}

      <div className="flex-grow container mx-auto px-4 py-8">
        {results.length === 0 && !isTranslating && !croppingFile && (
            <Landing onTranslate={handleTranslate} isTranslating={isTranslating} />
        )}
        {results.length > 0 && (
            <WebtoonViewer results={results} onReset={handleReset} />
        )}
        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
      </div>
    </div>
  );
}
