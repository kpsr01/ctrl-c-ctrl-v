import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
export default function LandingPage() {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  useEffect(() => {
    setTimeout(() => setShow(true), 100);
  }, []);
  return (
    <div className="w-screen min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-3 sm:p-6 pt-[10vh] overflow-x-hidden relative">
      {/* Animated background gradient */}
      <div className="absolute inset-0 -z-10 animate-gradient bg-gradient-to-br from-purple-900 via-gray-900 to-red-900 opacity-60">
        {/* Floating orbs */}
        <div className="absolute top-1/4 left-1/4 w-20 h-20 sm:w-32 sm:h-32 bg-purple-500/20 rounded-full blur-xl animate-float-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-24 h-24 sm:w-40 sm:h-40 bg-red-500/20 rounded-full blur-xl animate-float-medium"></div>
        <div className="absolute top-1/2 left-1/2 w-16 h-16 sm:w-24 sm:h-24 bg-pink-500/20 rounded-full blur-xl animate-float-fast"></div>
      </div>
      <div className={`text-center max-w-full sm:max-w-2xl mx-auto transition-all duration-1000 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}` }>
        <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
          <span className="block relative animate-fade-in group">
            <span className="relative inline-block bg-gradient-to-r from-white via-purple-100 to-white bg-clip-text text-transparent animate-text-shimmer">
              Generate Microsoft Forms
            </span>
            {/* Removed hover underline and blur effect */}
          </span>
          <span className="block text-3xl xs:text-4xl sm:text-5xl md:text-7xl relative group mt-2 sm:mt-4 leading-[1.15] overflow-visible">
            <span className="relative inline-block bg-gradient-to-r from-purple-600 via-pink-700 to-red-500 bg-clip-text text-transparent animate-slide-in animate-pulse-glow leading-[1.15]">
              Instantly
              <span className="absolute inset-0 bg-gradient-to-r from-purple-600/30 via-pink-700/30 to-red-500/30 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-pulse-subtle"></span>
            </span>
            {/* Floating particles */}
            <span className="hidden sm:block absolute -left-4 top-1/2 w-2 h-2 bg-purple-500 rounded-full animate-particle-1"></span>
            <span className="hidden sm:block absolute -right-4 top-1/3 w-2 h-2 bg-pink-500 rounded-full animate-particle-2"></span>
            <span className="hidden sm:block absolute right-1/4 -bottom-2 w-1.5 h-1.5 bg-red-500 rounded-full animate-particle-3"></span>
          </span>
        </h1>
        <p className={`text-base xs:text-lg sm:text-2xl text-gray-300 mb-10 sm:mb-20 transition-all duration-1000 delay-200 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}` }>
          Natural language to fully structured forms – fast, simple, powerful.
        </p>
        <div className="flex justify-center w-full">
          <GradientOutlineButton onClick={() => navigate('/chat')} />
        </div>
      </div>
      <div className={`mt-8 sm:mt-16 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8 max-w-full sm:max-w-5xl w-full px-0 xs:px-2 sm:px-4 transition-all duration-1000 delay-300 ${show ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}` }>
          <div>
            <FeatureCard emoji="⚡" title="Speed" description="Lightning fast form generation" />
          </div>
          <div>
            <FeatureCard emoji="🎯" title="Accuracy" description="Smart field suggestions based on context" />
          </div>
          <div>
            <FeatureCard emoji="📤" title="Export" description="Export to Microsoft Forms and Google Docs" />
          </div>
      </div>
      {/* Keyframes for custom animations */}
      <style>{`
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fade-in 1.2s cubic-bezier(.4,0,.2,1) both; }
        
        @keyframes slide-in { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
        .animate-slide-in { animation: slide-in 1.2s 0.2s cubic-bezier(.4,0,.2,1) both; }
        
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient { background-size: 200% 200%; animation: gradient 8s ease-in-out infinite; }

        @keyframes text-shimmer {
          0% { background-position: -200% 50%; }
          100% { background-position: 200% 50%; }
        }
        .animate-text-shimmer {
          background-size: 200% auto;
          animation: text-shimmer 4s linear infinite;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
        }
        
        @keyframes float-slow {
          0%, 100% { transform: translateY(0) translateX(0); }
          25% { transform: translateY(-20px) translateX(10px); }
          50% { transform: translateY(0) translateX(20px); }
          75% { transform: translateY(20px) translateX(10px); }
        }
        .animate-float-slow { animation: float-slow 8s ease-in-out infinite; }
        
        @keyframes float-medium {
          0%, 100% { transform: translateY(0) translateX(0); }
          25% { transform: translateY(20px) translateX(-10px); }
          50% { transform: translateY(0) translateX(-20px); }
          75% { transform: translateY(-20px) translateX(-10px); }
        }
        .animate-float-medium { animation: float-medium 6s ease-in-out infinite; }
        
        @keyframes float-fast {
          0%, 100% { transform: translateY(0) translateX(0); }
          25% { transform: translateY(-15px) translateX(15px); }
          50% { transform: translateY(0) translateX(30px); }
          75% { transform: translateY(15px) translateX(15px); }
        }
        .animate-float-fast { animation: float-fast 4s ease-in-out infinite; }

        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }

        @keyframes morph-to-circle {
          0% {
            border-radius: 0.75rem;
          }
          50% {
            border-radius: 2rem;
          }
          100% {
            border-radius: 9999px;
          }
        }

        .group:hover .morph-to-circle {
          animation: morph-to-circle 1.2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        @keyframes pulse-glow {
          0%, 100% { text-shadow: 0 0 30px rgba(168, 85, 247, 0.4); }
          50% { text-shadow: 0 0 15px rgba(168, 85, 247, 0.1); }
        }
        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }

        @keyframes pulse-subtle {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.05); opacity: 0.5; }
        }
        .animate-pulse-subtle {
          animation: pulse-subtle 2s ease-in-out infinite;
        }

        @keyframes particle-float-1 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.6; }
          50% { transform: translate(10px, -10px) scale(1.2); opacity: 0.8; }
        }
        .animate-particle-1 {
          animation: particle-float-1 3s ease-in-out infinite;
        }

        @keyframes particle-float-2 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.6; }
          50% { transform: translate(-10px, -8px) scale(1.1); opacity: 0.8; }
        }
        .animate-particle-2 {
          animation: particle-float-2 4s ease-in-out infinite;
        }

        @keyframes particle-float-3 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.6; }
          50% { transform: translate(8px, -12px) scale(1.15); opacity: 0.8; }
        }
        .animate-particle-3 {
          animation: particle-float-3 3.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

function GradientOutlineButton({ onClick }) {
  return (
    <button 
      onClick={onClick}
      className="group relative inline-flex items-center justify-center rounded-xl px-4 py-2 xs:px-6 xs:py-3 md:px-9 md:py-4 text-base xs:text-lg md:text-xl font-bold text-white transition-all duration-300 focus:outline-none w-full sm:w-auto overflow-hidden shadow-lg hover:scale-105 hover:shadow-2xl hover:-translate-y-1 cursor-pointer transform"
    >
      {/* Glowing gradient shadow */}
      <span
        className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 opacity-30 blur-md transition-all duration-300 group-hover:opacity-70 group-hover:blur-xl group-hover:scale-110"
        aria-hidden="true"
      ></span>
      {/* Button surface */}
      <span className="absolute inset-0 rounded-xl bg-gray-700 border-2 border-transparent transition-all duration-300 group-hover:border-pink-500"></span>
      {/* Text */}
      <span className="relative z-10 inline-flex items-center transition-transform duration-300 group-hover:scale-110">
        <span className="transform transition-transform duration-300 group-hover:translate-x-1">Try Now</span>
        <span className="ml-2 transform transition-transform duration-300 group-hover:translate-x-2">→</span>
      </span>
    </button>
  );
}



function FeatureCard({ emoji, title, description }) {
  return (
    <div className="bg-gray-800 rounded-xl p-3 xs:p-4 md:p-6 shadow-md text-center flex flex-col items-center transition-all duration-1000 ease-in-out relative aspect-square overflow-hidden w-full max-w-xs mx-auto">
      {/* Static border gradient (no hover) */}
      <div className="absolute -inset-[1px] bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-xl opacity-0 blur-sm transition-all duration-1000 ease-in-out"></div>
      <div className="relative bg-gray-800 rounded-xl p-3 xs:p-4 md:p-6 w-full h-full transition-all duration-1000 ease-in-out">
        <div className="text-2xl xs:text-3xl md:text-4xl mb-1 xs:mb-2 md:mb-3 animate-fade-in animate-bounce-slow" style={{ animationDelay: '0.5s', animationFillMode: 'both' }}>{emoji}</div>
        <h3 className="text-lg xs:text-xl md:text-2xl font-semibold mb-1 xs:mb-2 animate-fade-in" style={{ animationDelay: '0.7s', animationFillMode: 'both' }}>{title}</h3>
        <p className="text-gray-400 text-sm xs:text-base md:text-lg animate-fade-in" style={{ animationDelay: '0.9s', animationFillMode: 'both' }}>{description}</p>
      </div>
    </div>
  );
}
