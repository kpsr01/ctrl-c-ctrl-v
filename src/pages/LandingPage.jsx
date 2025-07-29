export default function LandingPage() {
  return (
    <div className="w-screen h-screen bg-gray-900 text-white flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-2xl">
      <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
  <span className="block">Generate Microsoft Forms</span>
  <span className="block text-5xl md:text-7xl bg-gradient-to-r from-purple-600 via-pink-700 to-red-500 bg-clip-text text-transparent">
    Instantly
  </span>
</h1>

        <p className="text-2xl text-gray-300 mb-20">
          Natural language to fully structured forms – fast, simple, powerful.
        </p>
        <div className="flex justify-center">
          <GradientOutlineButton>
            Try Now →
          </GradientOutlineButton>
        </div>
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full">
        <FeatureCard emoji="⚡" title="Speed" description="Lightning fast form generation" />
        <FeatureCard emoji="🎯" title="Accuracy" description="Smart field suggestions based on context" />
        <FeatureCard emoji="📤" title="Export" description="Export to Microsoft Forms and Google Docs" />
      </div>
    </div>
  );
}

function GradientOutlineButton({ children }) {
  return (
    <button className="group relative inline-flex items-center justify-center rounded-xl px-9 py-4 text-xl font-bold text-white transition-all duration-300 focus:outline-none w-[54%] h-[144%]">
      {/* Glowing gradient shadow */}
      <span
        className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 opacity-30 blur-md transition-all duration-300 group-hover:opacity-70 group-hover:blur-xl"
        aria-hidden="true"
      ></span>

      {/* Button surface */}
      <span className="absolute inset-0 rounded-xl bg-[#101122] border-2 border-transparent transition-all duration-300"></span>

      {/* Text */}
      <span className="relative z-10">{children}</span>
    </button>
  );
}



function FeatureCard({ emoji, title, description }) {
  return (
    <div className="bg-gray-800 rounded-xl p-8 shadow-md text-center flex flex-col items-center">
      <div className="text-4xl mb-3">{emoji}</div>
      <h3 className="text-2xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-400 text-lg">{description}</p>
    </div>
  );
}
