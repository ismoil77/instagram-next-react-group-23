import React from 'react';
import useDarkSide from '@/hook/useDarkSide';

const DarkMode = () => {
    const [theme, setTheme] = useDarkSide();

    return (
        <div className="flex justify-between items-center">
            <span className="text-base">Переключить тему </span>
          
            <label className="relative inline-flex items-center cursor-pointer">
                <input
                    type="checkbox"
                    checked={theme === 'dark'}
                    onChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-400 rounded-full peer-checked:bg-blue-600 transition-colors"></div>
                <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-full"></div>
            </label>
        </div>
    );
};

export default DarkMode;
