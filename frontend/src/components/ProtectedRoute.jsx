import useAuthStore from "../zustand/authStore";
import { Outlet, Navigate } from "react-router-dom";

function ProtectedRoute() {
  const { user, loading } = useAuthStore;
  if (loading)
    return (
      <div
        className="flex flex-col items-center justify-center h-screen bg-ivory gap-6"
        role="status"
        aria-live="polite"
        aria-busy="true"
      >
        {/* Logo */}
        <div
          className="font-cormorant text-3xl font-semibold tracking-[0.15em] text-black"
          aria-hidden="true"
        >
          O<span className="text-amber-500">C</span>M
        </div>

        {/* Animated bar */}
        <div
          className="w-32 h-px bg-divider relative overflow-hidden"
          aria-hidden="true"
        >
          <div
            className="absolute top-0 left-0 h-full bg-amber-500"
            style={{
              width: "40%",
              animation: "slide 1.4s ease-in-out infinite",
            }}
          />
        </div>

        {/* Label */}
        <p className="font-coptic text-sm uppercase tracking-[0.25em] text-black">
          Loading, please wait…
        </p>
        <span className="sr-only">Loading the application, please wait.</span>

        <style>{`
        @keyframes slide {
          0%   { transform: translateX(-100%); }
          50%  { transform: translateX(300%); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
      </div>
    );
  return user ? <Outlet /> : <Navigate to={"/auth/login"} />;
}

export default ProtectedRoute;
