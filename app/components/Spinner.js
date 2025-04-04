// components/Spinner.js
const Spinner = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white/50 backdrop-blur-md">
      {/* Logo */}
      <img
        src="/logo.png" // ✅ Update with your actual logo path
        alt="M R Consultants"
        className="w-20 h-auto object-contain mb-6 animate-fade-in"
      />

      {/* Spinner Ring */}
      <div className="relative">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2.5 h-2.5 bg-black rounded-full animate-ping"></div>
        </div>
      </div>

      {/* Tagline with enhanced contrast */}
      <p
        className="mt-6 text-[15px] sm:text-[17px] text-[#1A1A1A] font-semibold animate-fade-in"
        style={{
          textShadow: "0 1px 2px rgba(255, 255, 255, 0.7)",
        }}
      >
        Elevating Real Estate Experiences...
      </p>
    </div>
  );
};

export default Spinner;
