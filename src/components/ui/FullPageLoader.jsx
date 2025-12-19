export default function FullPageLoader() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900">
      <div className="relative flex items-center justify-center">
        {/* Outer Rotating Glow Ring */}
        <div className="absolute w-24 h-24 border-4 border-t-slate-400 border-r-transparent border-b-slate-600 border-l-transparent rounded-full animate-spin"></div>

        {/* Inner Pulsing Logo */}
        <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-2xl animate-pulse border-2 border-slate-700">
          <img
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6913ef9d88f5466c017efc78/37663a551_GORILLATAGACADEMYPFP.png"
            alt="Loading Logo"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Brand Text */}
      <div className="mt-6 text-center">
        <h1 className="text-lg font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent animate-bounce">
          Gorilla Tag Academy
        </h1>
        <p className="text-xs text-slate-500 tracking-widest uppercase mt-1">
          Setting up your session...
        </p>
      </div>
    </div>
  );
}
