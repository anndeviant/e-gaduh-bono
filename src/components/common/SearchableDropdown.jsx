import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, X } from 'lucide-react';

const SearchableDropdown = ({
    options = [],
    value = '',
    onChange,
    placeholder = 'Pilih atau cari...',
    defaultOption = null,
    className = '',
    disabled = false,
    searchPlaceholder = 'Cari...',
    noResultsText = 'Tidak ada hasil ditemukan',
    displayKey = 'label', // key untuk display text
    valueKey = 'value', // key untuk value
    searchKeys = ['label'], // keys yang digunakan untuk pencarian
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const dropdownRef = useRef(null);
    const searchInputRef = useRef(null);

    // Prepare options with default option
    const allOptions = defaultOption ? [defaultOption, ...options] : options;

    // Filter options based on search term
    const filteredOptions = allOptions.filter(option => {
        if (!searchTerm) return true;

        return searchKeys.some(key => {
            const optionValue = option[key]?.toString().toLowerCase() || '';
            return optionValue.includes(searchTerm.toLowerCase());
        });
    });

    // Get current selected option
    const selectedOption = allOptions.find(option => option[valueKey] === value);

    // Handle click outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
                setSearchTerm('');
                setHighlightedIndex(-1);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Focus search input when dropdown opens
    useEffect(() => {
        if (isOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isOpen]);

    // Handle keyboard navigation
    const handleKeyDown = (e) => {
        if (!isOpen) {
            if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
                e.preventDefault();
                setIsOpen(true);
            }
            return;
        }

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setHighlightedIndex(prev =>
                    prev < filteredOptions.length - 1 ? prev + 1 : 0
                );
                break;
            case 'ArrowUp':
                e.preventDefault();
                setHighlightedIndex(prev =>
                    prev > 0 ? prev - 1 : filteredOptions.length - 1
                );
                break;
            case 'Enter':
                e.preventDefault();
                if (highlightedIndex >= 0) {
                    handleOptionSelect(filteredOptions[highlightedIndex]);
                }
                break;
            case 'Escape':
                setIsOpen(false);
                setSearchTerm('');
                setHighlightedIndex(-1);
                break;
            default:
                break;
        }
    };

    const handleOptionSelect = (option) => {
        onChange(option[valueKey]);
        setIsOpen(false);
        setSearchTerm('');
        setHighlightedIndex(-1);
    };

    const handleClear = (e) => {
        e.stopPropagation();
        onChange('');
        setSearchTerm('');
    };

    const toggleDropdown = () => {
        if (!disabled) {
            setIsOpen(!isOpen);
            if (!isOpen) {
                setSearchTerm('');
                setHighlightedIndex(-1);
            }
        }
    };

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            {/* Main Button */}
            <button
                type="button"
                onClick={toggleDropdown}
                onKeyDown={handleKeyDown}
                disabled={disabled}
                className={`
                    w-full flex items-center justify-between px-3 py-2 text-sm border rounded-md
                    focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500
                    ${disabled
                        ? 'bg-gray-100 text-gray-500 cursor-not-allowed border-gray-300'
                        : 'bg-white text-gray-900 hover:border-gray-400 border-gray-300'
                    }
                    ${isOpen ? 'ring-1 ring-green-500 border-green-500' : ''}
                `}
            >
                <span className={`truncate ${!selectedOption ? 'text-gray-500' : ''}`}>
                    {selectedOption ? selectedOption[displayKey] : placeholder}
                </span>
                <div className="flex items-center space-x-1">
                    {selectedOption && !disabled && (
                        <X
                            className="h-4 w-4 text-gray-400 hover:text-gray-600 cursor-pointer"
                            onClick={handleClear}
                        />
                    )}
                    <ChevronDown
                        className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''
                            }`}
                    />
                </div>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-hidden">
                    {/* Search Input */}
                    <div className="p-2 border-b border-gray-200">
                        <div className="relative">
                            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                ref={searchInputRef}
                                type="text"
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setHighlightedIndex(-1);
                                }}
                                onKeyDown={handleKeyDown}
                                placeholder={searchPlaceholder}
                                className="w-full pl-8 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                            />
                        </div>
                    </div>

                    {/* Options List */}
                    <div className="overflow-y-auto max-h-48">
                        {filteredOptions.length === 0 ? (
                            <div className="px-3 py-2 text-sm text-gray-500 text-center mb-2">
                                {noResultsText}
                            </div>
                        ) : (
                            filteredOptions.map((option, index) => (
                                <button
                                    key={option[valueKey]}
                                    type="button"
                                    onClick={() => handleOptionSelect(option)}
                                    className={`
                                        w-full text-left px-3 py-2 text-sm hover:bg-gray-100 focus:outline-none
                                        ${highlightedIndex === index ? 'bg-gray-100' : ''}
                                        ${selectedOption && selectedOption[valueKey] === option[valueKey]
                                            ? 'bg-green-50 text-green-700 font-medium'
                                            : 'text-gray-900'
                                        }
                                        ${index === filteredOptions.length - 1 ? 'mb-2' : ''}
                                    `}
                                    onMouseEnter={() => setHighlightedIndex(index)}
                                >
                                    <div className="truncate">
                                        {option[displayKey]}
                                    </div>
                                    {option.subtitle && (
                                        <div className="text-xs text-gray-500 truncate">
                                            {option.subtitle}
                                        </div>
                                    )}
                                </button>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchableDropdown;
