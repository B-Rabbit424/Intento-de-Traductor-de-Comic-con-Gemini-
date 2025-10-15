import React, { useState, useEffect } from 'react';
import { HistoryItem } from '../types';
import { getHistory, clearHistory } from '../services/historyService';

interface HistoryViewerProps {
    onSelectHistoryItem: (item: HistoryItem) => void;
}

export function HistoryViewer({ onSelectHistoryItem }: HistoryViewerProps): React.ReactElement {
    const [history, setHistory] = useState<HistoryItem[]>([]);

    useEffect(() => {
        setHistory(getHistory());
    }, []);
    
    const handleClearHistory = () => {
        clearHistory();
        setHistory([]);
    }

    if (history.length === 0) {
        return (
            <div className="text-center p-8">
                <p className="text-gray-400">No translation history found.</p>
            </div>
        );
    }

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-white">Translation History</h2>
                <button 
                    onClick={handleClearHistory}
                    className="py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-md transition-colors"
                >
                    Clear History
                </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {history.map(item => (
                    <div 
                        key={item.id} 
                        className="bg-gray-700 rounded-lg overflow-hidden shadow-lg cursor-pointer transform hover:scale-105 transition-transform"
                        onClick={() => onSelectHistoryItem(item)}
                    >
                        <img src={item.previewImageUrl} alt="Translation preview" className="w-full h-48 object-cover" />
                        <div className="p-4">
                            <p className="text-white font-semibold">{new Date(item.timestamp).toLocaleString()}</p>
                            <p className="text-gray-300 text-sm">{item.imageCount} image(s)</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
