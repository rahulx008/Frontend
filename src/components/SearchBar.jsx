
import { Cross1Icon, MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { useState } from 'react';

export default function SearchBar() {

    const [searchTerm, setSearchTerm] = useState('');
 
    return (
        <div className="w-full max-w-2xl mx-auto px-4">

        {/* Search bar */}
        <div className="flex items-center border-2 border-gray-200 rounded-full bg-white shadow-sm
                        focus-within:border-blue-500 focus-within:shadow-md transition-all duration-200">

            {/* Leading icon */}
            <MagnifyingGlassIcon className="h-5 w-5 ml-4 text-gray-400 flex-shrink-0" />

            {/* Input */}
            <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search anything…"
            className="flex-grow px-3 py-3 sm:py-3.5 text-sm sm:text-base
                        bg-transparent outline-none text-gray-800 placeholder-gray-400
                        min-w-0"
            />
            
            {/* Clear button */}
            {searchTerm && (
                <button className="m-1 p-1 rounded-full hover:bg-gray-200 transition-colors duration-150
                            flex items-center justify-center"
                    onClick={() => setSearchTerm('')}
                >
                    <Cross1Icon className="h-4 w-4 text-gray-400 hover:text-gray-600 transition-colors duration-150" />
                </button>
            )}

            {/* Button — icon-only on mobile, full label on sm+ */}
            <button
                className="m-1 bg-blue-500 hover:bg-blue-600 active:scale-95
                        text-white rounded-full transition-all duration-150
                        flex items-center justify-center gap-2
                        p-2.5 sm:px-5 sm:py-2.5"
            >
                <MagnifyingGlassIcon className="h-4 w-4 flex-shrink-0" />
                <span className="hidden sm:inline text-sm font-medium">Search</span>
            </button>
        </div>
    </div>
    );
}
