import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  ChevronsDownUpIcon,
  ChevronsUpDownIcon,
} from "lucide-react";

interface Option {
  value: string;
  label: string;
}

interface InputSelectProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement> | string) => void;
  options: Option[];
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  searchInput?: React.ReactNode;
  name?: string;
  required?: boolean;
  id?: string;
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

export default function InputSelect({
  value,
  onChange,
  options,
  label = "",
  placeholder = "Select an option",
  disabled = false,
  error,
  searchInput,
  name,
  required = false,
  id,
  fullWidth = true,
  icon,
}: InputSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<Option | null>(() => {
    return options.find((option) => option.value === value) || null;
  });
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  });
  const containerRef = useRef<HTMLDivElement>(null);
  const selectRef = useRef<HTMLSelectElement>(null);

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Update selected option when value changes externally
  useEffect(() => {
    const matchingOption = options.find((option) => option.value === value);
    if (matchingOption) {
      setSelectedOption(matchingOption);
    } else {
      setSelectedOption(null);
    }
  }, [value, options]);

  // Calculate dropdown position when opening
  useEffect(() => {
    if (isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      
      // Calculate the maximum width needed for the content
      const maxOptionWidth = Math.max(
        ...options.map(option => {
          // Create a temporary element to measure text width
          const temp = document.createElement('span');
          temp.style.visibility = 'hidden';
          temp.style.position = 'absolute';
          temp.style.whiteSpace = 'nowrap';
          temp.style.fontSize = '12px'; // text-xs
          temp.style.fontFamily = 'inherit';
          temp.textContent = option.label;
          document.body.appendChild(temp);
          const width = temp.offsetWidth;
          document.body.removeChild(temp);
          return width;
        })
      );
      
      // Add padding for the dropdown (16px on each side)
      const contentWidth = maxOptionWidth + 32;
      const minWidth = 120; // Minimum width
      const maxWidth = 300; // Maximum width
      const dropdownWidth = Math.max(minWidth, Math.min(contentWidth, maxWidth));
      
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 4, // Add 4px spacing (mt-1 equivalent)
        left: rect.right + window.scrollX - dropdownWidth, // Right-align by positioning from right edge
        width: dropdownWidth,
      });
    }
  }, [isOpen, options]);

  const handleSelect = (option: Option) => {
    setSelectedOption(option);
    setIsOpen(false);

    // Create a synthetic event-like object for compatibility
    if (selectRef.current) {
      // Set the native select value
      selectRef.current.value = option.value;

      // Create a custom change event
      const event = {
        target: {
          value: option.value,
          name: selectRef.current.name,
        },
        currentTarget: {
          value: option.value,
          name: selectRef.current.name,
        },
      } as unknown as React.ChangeEvent<HTMLSelectElement>;

      // Call the original onChange
      onChange(event);
    } else {
      // Fallback direct value passing if select element is not available
      onChange(option.value);
    }
  };

  return (
    <div
      className={`relative flex justify-between items-center ${
        fullWidth ? "w-full" : ""
      }`}
      ref={containerRef}
    >
      {/* Hidden native select for form compatibility */}
      <select
        ref={selectRef}
        value={selectedOption?.value || ""}
        onChange={(e) => onChange(e)}
        className="sr-only"
        name={name}
        id={id}
        required={required}
        disabled={disabled}
        aria-hidden="true"
      >
        <option value="" disabled hidden>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {/* Label */}
      {label && (
        <label
          className={`text-xs flex items-center font-bold gap-1 ${
            error ? "text-red-500" : "text-gray-700"
          } ${disabled ? "opacity-50" : ""}`}
          htmlFor={id}
        >
          {icon && icon}
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Custom select UI */}
      <div
        className={`
          relative px-0 py-3
          text-xs
          ${error ? "border-red-500" : "border-gray-200"} 
          ${isOpen ? "border-blue-400 ring-0 ring-blue-100" : ""} 
          ${
            disabled
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "cursor-pointer"
          }
          rounded-lg transition-all duration-150
        `}
        onClick={disabled ? undefined : () => setIsOpen(!isOpen)}
      >
        <div className="flex justify-between items-center">
          <span className={selectedOption ? "text-gray-900" : "text-gray-500"}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className={`ml-2 ${disabled ? "opacity-50" : ""}`}
          >
            {isOpen ? (
              <ChevronsDownUpIcon size={12} className="text-gray-500" />
            ) : (
              <ChevronsUpDownIcon size={12} className="text-gray-500" />
            )}
          </motion.div>
        </div>
      </div>

      {/* Error message */}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}

      {/* Dropdown options rendered via portal */}
      {typeof window !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {isOpen && !disabled && (
              <motion.div
                initial={{ opacity: 0, y: -5, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -5, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="fixed z-[9999] text-xs bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden"
                style={{
                  top: dropdownPosition.top,
                  left: dropdownPosition.left,
                  width: dropdownPosition.width,
                  maxHeight: "250px",
                }}
              >
                <div className="max-h-60 overflow-y-auto relative p-1">
                  {searchInput && (
                    <div className="sticky top-0 w-full bg-white p-2 border-b border-gray-100">
                      {searchInput}
                    </div>
                  )}

                  {options.length > 0 ? (
                    options.map((option) => (
                      <motion.div
                        key={option.value}
                        whileHover={{ backgroundColor: "#f3f4f6" }}
                        className={`
                        px-2 py-1 cursor-pointer rounded text-right transition-colors duration-150
                        ${
                          selectedOption?.value === option.value
                            ? "bg-blue-500 text-white"
                            : "text-gray-800"
                        }
                      `}
                        onClick={() => handleSelect(option)}
                      >
                        {option.label}
                      </motion.div>
                    ))
                  ) : (
                    <div className="px-4 py-2.5 text-gray-500 text-sm">
                      No options available
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </div>
  );
}
