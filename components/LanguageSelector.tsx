import React from 'react';

interface Language {
  code: string;
  name: string;
}

interface LanguageSelectorProps {
  id: string;
  label: string;
  value: string; // This will be the language code
  onChange: (languageCode: string) => void;
  languages: Language[];
}

export function LanguageSelector({ id, label, value, onChange, languages }: LanguageSelectorProps): React.ReactElement {
  return (
    <div>
      <label htmlFor={id} className="block text-lg font-medium text-gray-300">
        {label}
      </label>
      <select
        id={id}
        name={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-gray-700 border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md text-white"
      >
        {/* Fix: Use language code for the option value for robust state handling. */}
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
}
