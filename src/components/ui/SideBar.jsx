// ! NOt using this right now , kinda not working will figure it out later , rn i have sidebar code insde ChatPage.jsx
import React from "react";
import { Menu, ChevronLeft } from "lucide-react";

export default function Sidebar({ open, onToggle, history }) {
  return (
    <div
      className={`relative transition-all duration-300 bg-gray-800 flex flex-col border-r border-gray-700 ${
        open ? "w-64" : "w-16"
      }`}
    >
      {/* Toggle Button */}
      <button
        onClick={onToggle}
        aria-label="Toggle sidebar"
        className="absolute top-4 right-[-1rem] w-8 h-8 flex items-center justify-center rounded-full bg-gray-800/50 backdrop-blur-md text-white border border-gray-600 shadow-md hover:bg-gray-700/25 transition-all outline-none focus:outline-none focus:ring-0 focus:ring-offset-0"
      >
        {open ? <ChevronLeft size={18} /> : <Menu size={18} />}
      </button>

      {/* Chat History List */}
      {open && (
        <div className="mt-16 px-4 overflow-y-auto space-y-2 flex-1">
          {history.map((item, i) => (
            <div
              key={i}
              className="p-2 rounded hover:bg-gray-700 cursor-pointer"
            >
              {item}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
