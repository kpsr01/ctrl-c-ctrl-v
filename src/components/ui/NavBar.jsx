import { useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-[#0e0f1b]/90 border-b border-white/10 shadow-[0_0_20px_#6366f180]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-white tracking-tight hover:opacity-90 transition">
            Cursor for<span className="text-purple-400"> Forms</span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex space-x-4">
            {['Forms', 'Excel', 'PPT'].map((label) => (
              <Link
                key={label}
                to="/chat"
                className="px-4 py-2 text-sm text-gray-300 rounded-md 
                           hover:text-white hover:bg-yellow-400/85 
                           hover:shadow-[0_0_15px_#facc15] 
                           transition duration-200"
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle Menu"
              className="text-gray-300 p-2 rounded hover:bg-white/10 transition"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden px-4 pb-4 space-y-1 backdrop-blur-sm bg-[#0e0f1b]/90 border-t border- /10">
          {['Forms', 'Excel', 'PPT'].map((label) => (
            <Link
              key={label}
              to="/chat"
              onClick={() => setIsOpen(false)}
              className="block text-gray-300 px-3 py-2 rounded-md 
                         hover:text-white hover:bg-yellow-400/85 
                         hover:shadow-[0_0_15px_#facc15] 
                         transition duration-200"
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
