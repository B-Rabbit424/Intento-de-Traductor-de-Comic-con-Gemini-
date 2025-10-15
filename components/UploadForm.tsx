import React, { useState, useCallback, ChangeEvent } from 'react';
import { useDropzone } from 'react-dropzone';
import { LanguageSelector } from './LanguageSelector';
import { SOURCE_LANGUAGES, SUPPORTED_LANGUAGES } from '../constants';
import { UploadIcon } from './UploadIcon';

interface UploadFormProps {
  onTranslate: (files: File[], sourceLang: string, targetLang: string) => void;
  isTranslating: boolean;
}

export function UploadForm({ onTranslate, isTranslating }: UploadFormProps): React.ReactElement {
  const [files, setFiles] = useState<File[]>([]);
  const [sourceLangCode, setSourceLangCode] = useState('auto');
  const [targetLangCode, setTargetLangCode] = useState('en');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const imageFiles = acceptedFiles.filter(file => file.type.startsWith('image/'));
    setFiles(prevFiles => [...prevFiles, ...imageFiles].sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true })));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.png', '.gif', '.webp', '.jpg'] },
    multiple: true,
  });

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prevFiles => [...prevFiles, ...newFiles].sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true })));
    }
  };

  const removeFile = (fileName: string) => {
    setFiles(files.filter(file => file.name !== fileName));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length > 0) {
      const sourceLangName = SOURCE_LANGUAGES.find(l => l.code === sourceLangCode)?.name || 'Auto-detect';
      const targetLangName = SUPPORTED_LANGUAGES.find(l => l.code === targetLangCode)?.name || 'English';
      onTranslate(files, sourceLangName, targetLangName);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 bg-gray-800 rounded-lg shadow-xl">
      <form onSubmit={handleSubmit}>
        <div 
          {...getRootProps()}
          className={`flex flex-col items-center justify-center w-full h-64 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-700 hover:bg-gray-600 transition-colors ${isDragActive ? 'border-indigo-500' : ''}`}
        >
          <input {...getInputProps()} className="hidden" />
          <UploadIcon />
          <p className="mb-2 text-sm text-gray-400">
            <span className="font-semibold">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-gray-400">PNG, JPG, GIF or WEBP</p>
        </div>

        {files.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-medium text-white mb-2">Selected Files:</h3>
            <ul className="max-h-48 overflow-y-auto bg-gray-700 rounded-md p-2 space-y-2">
              {files.map(file => (
                <li key={file.name} className="flex justify-between items-center text-sm text-gray-300 p-2 bg-gray-600 rounded">
                  <span>{file.name}</span>
                  <button type="button" onClick={() => removeFile(file.name)} className="text-red-400 hover:text-red-300 font-bold">&times;</button>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <LanguageSelector
            id="source-language"
            label="From"
            value={sourceLangCode}
            onChange={setSourceLangCode}
            languages={SOURCE_LANGUAGES}
          />
          <LanguageSelector
            id="target-language"
            label="To"
            value={targetLangCode}
            onChange={setTargetLangCode}
            languages={SUPPORTED_LANGUAGES}
          />
        </div>

        <div className="mt-8">
          <button
            type="submit"
            disabled={files.length === 0 || isTranslating}
            className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 disabled:bg-gray-500 disabled:cursor-not-allowed transition-all"
          >
            {isTranslating ? 'Translating...' : `Translate ${files.length} Image(s)`}
          </button>
        </div>
      </form>
    </div>
  );
}
