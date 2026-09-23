import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Lock,
  Eye,
  EyeOff,
  Leaf,
  CheckCircle2,
  FileText,
  BarChart3,
  Users,
  ShieldCheck,
  ArrowRight,
  Mail,
} from "lucide-react";

// JWT Payload Interface
interface JwtPayload {
  sub: string;
  username: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

// Pure Base64Url JWT parser
const parseJwt = (token: string): JwtPayload | null => {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload) as JwtPayload;
  } catch {
    return null;
  }
};

// Simulation mock JWT generator
const createMockJwt = (payload: JwtPayload): string => {
  const header = { alg: "HS256", typ: "JWT" };
  const toBase64Url = (obj: object): string =>
    window
      .btoa(JSON.stringify(obj))
      .replace(/=/g, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");

  const encodedHeader = toBase64Url(header);
  const encodedPayload = toBase64Url(payload);
  const mockSignature = "sZk91T_TatvaSecuredSignatureToken_Xq92";

  return `${encodedHeader}.${encodedPayload}.${mockSignature}`;
};

export default function TavaAuth() {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // If already logged in with a valid token, redirect to /ProductVerify
  useEffect(() => {
    const savedToken = localStorage.getItem("tatva_jwt_token");
    if (savedToken) {
      const decoded = parseJwt(savedToken);
      if (decoded && decoded.exp * 1000 > Date.now()) {
        navigate("/ProductVerify");
      } else {
        localStorage.removeItem("tatva_jwt_token");
      }
    }
  }, [navigate]);

  // const handleAuthSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   setErrorMessage("");

  //   if (!username.trim() || !password.trim()) {
  //     setErrorMessage("Please enter both username and password.");
  //     return;
  //   }

  //   setIsLoading(true);

  //   setTimeout(() => {
  //     const now = Math.floor(Date.now() / 1000);
  //     const tokenPayload: JwtPayload = {
  //       sub: username.toLowerCase().replace(/\s+/g, "_"),
  //       username: username,
  //       email: isSignUp ? email : `${username.toLowerCase()}@tatvafood.com`,
  //       role: username.toLowerCase().includes("admin") ? "Food Inspector" : "Consumer",
  //       iat: now,
  //       exp: now + 3600 * 24, // 24 hours
  //     };

  //     const token = createMockJwt(tokenPayload);

  //     // Save token to localStorage
  //     localStorage.setItem("tatva_jwt_token", token);
  //     setIsLoading(false);

  //     // Navigate to /ProductVerify route
  //     navigate("/ProductVerify");
  //   }, 500);
  // };

  // Handle Login & Sign-Up with live backend API
  const handleAuthSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");

    if (!username.trim() || !password.trim()) {
      setErrorMessage("Please enter both username and password.");
      return;
    }

    if (isSignUp && !email.trim()) {
      setErrorMessage("Please enter your email address.");
      return;
    }

    setIsLoading(true);

    try {
      // Determine endpoint based on mode
      const endpoint = isSignUp
        ? "http://localhost:5000/api/auth/register"
        : "http://localhost:5000/api/auth/login";

      const payload = isSignUp
        ? { username, email, password }
        : { username, password };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Authentication failed.");
      }

      // Save real JWT token to localStorage
      localStorage.setItem("tatva_jwt_token", data.token);

      // Redirect to verification dashboard
      navigate("/ProductVerify");
    } catch (err: any) {
      console.error("Auth error:", err);
      setErrorMessage(err.message || "Failed to connect to the server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F8F5] text-slate-800 flex flex-col justify-between font-sans selection:bg-emerald-200">
      {/* Header */}
      <header className="pt-6 px-6 max-w-7xl mx-auto w-full flex items-center justify-between">
        <div className="flex-1"></div>

        <div className="flex flex-col items-center justify-center text-center">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center text-[#2D6A4F]">
              <Leaf className="w-8 h-8 fill-[#2D6A4F] -rotate-12" />
              <Leaf className="w-7 h-7 fill-[#52B788] text-[#52B788] rotate-45 -ml-3 mb-2" />
            </div>
            <span className="text-4xl font-bold tracking-tight text-[#1B4332]">
              Tatva
            </span>
          </div>
          <p className="text-sm font-medium text-slate-500 mt-0.5 tracking-wide">
            Know Your Food. Trust What You Eat.
          </p>
        </div>

        <div className="flex-1 flex justify-end">
          <span
            style={{ fontFamily: "'Caveat', 'Segoe Script', cursive" }}
            className="text-2xl text-[#40916C] -rotate-3 text-right leading-tight select-none"
          >
            Safer Food
            <br />
            Healthier Tomorrow
          </span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto w-full px-6 py-4 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center flex-1">
        {/* Left Column */}
        <div className="lg:col-span-3 flex flex-col items-start space-y-6">
          <div>
            <h1 className="text-3xl font-extrabold text-[#1B4332] leading-tight">
              Scan
              <br />
              Inspect
              <br />
              Be Sure
            </h1>
            <div className="w-10 h-1 bg-[#2D6A4F] rounded-full mt-2"></div>
          </div>

          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white shadow-xs border border-emerald-100 flex items-center justify-center text-[#2D6A4F]">
                <CheckCircle2 className="w-5 h-5 fill-[#2D6A4F] text-white" />
              </div>
              <span className="text-sm font-semibold text-slate-700">Check Ingredients</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white shadow-xs border border-emerald-100 flex items-center justify-center text-[#2D6A4F]">
                <Leaf className="w-5 h-5 text-[#2D6A4F]" />
              </div>
              <span className="text-sm font-semibold text-slate-700">Detect Risks</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white shadow-xs border border-emerald-100 flex items-center justify-center text-[#2D6A4F]">
                <FileText className="w-5 h-5 text-[#2D6A4F]" />
              </div>
              <span className="text-sm font-semibold text-slate-700">Make Informed Choices</span>
            </div>
          </div>

          <div className="pt-6">
            <span
              style={{ fontFamily: "'Caveat', 'Segoe Script', cursive" }}
              className="text-2xl text-[#40916C] -rotate-6 block select-none leading-snug"
            >
              Because
              <br />
              What You Eat
              <br />
              Matters
            </span>
          </div>
        </div>

        {/* Center Auth Card */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 p-8 w-full max-w-md">
            <div className="flex justify-center mb-3">
              <div className="relative flex items-center justify-center">
                <div className="w-16 h-16 rounded-full border-2 border-dashed border-emerald-500/50 flex items-center justify-center bg-emerald-50/50">
                  <div className="w-12 h-12 rounded-full border-2 border-[#2D6A4F] flex items-center justify-center bg-white shadow-xs">
                    <Leaf className="w-6 h-6 text-[#2D6A4F] fill-emerald-100" />
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-slate-800">
                {isSignUp ? "Create Account" : "Log In"}
              </h2>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                {isSignUp
                  ? "Sign up to track, inspect and verify food labels."
                  : "Access your account to inspect, verify and explore safer food choices."}
              </p>
            </div>

            {errorMessage && (
              <div className="mb-4 text-xs bg-rose-50 text-rose-600 border border-rose-200 rounded-lg p-2.5 text-center">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Username</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#2D6A4F]/30 focus:border-[#2D6A4F] transition"
                    required
                  />
                </div>
              </div>

              {isSignUp && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#2D6A4F]/30 focus:border-[#2D6A4F] transition"
                      required
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-9 pr-10 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#2D6A4F]/30 focus:border-[#2D6A4F] transition"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 bg-[#2D6A4F] hover:bg-[#1B4332] text-white py-2.5 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 shadow-xs transition active:scale-98 disabled:opacity-75 cursor-pointer"
              >
                {isLoading ? (
                  "Authenticating..."
                ) : (
                  <>
                    {isSignUp ? "Sign Up" : "Log In"} <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="text-center mt-5 text-xs text-slate-600">
              {isSignUp ? (
                <>
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setIsSignUp(false);
                      setErrorMessage("");
                    }}
                    className="font-bold text-[#2D6A4F] hover:underline cursor-pointer"
                  >
                    Log in
                  </button>
                </>
              ) : (
                <>
                  New here?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setIsSignUp(true);
                      setErrorMessage("");
                    }}
                    className="font-bold text-[#2D6A4F] hover:underline cursor-pointer"
                  >
                    Sign up
                  </button>
                </>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 text-center">
              <span className="text-[11px] text-slate-400">
                Together for a safer food future
              </span>
            </div>
          </div>
        </div>

        {/* Right Column Product Card */}
        <div className="lg:col-span-4 flex justify-center lg:justify-end">
          <div className="w-64 bg-[#EAD8B7]/80 rounded-2xl p-4 shadow-lg border border-[#D5BE97] relative overflow-hidden flex flex-col items-center">
            <div className="w-full flex justify-between border-b border-[#C8B085] pb-2 mb-3">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="w-1 h-3 bg-[#D5BE97] rounded-xs"></div>
              ))}
            </div>

            <div className="w-full bg-white rounded-xl p-4 shadow-xs border border-slate-100 flex flex-col items-center text-center">
              <h4 className="text-xs font-black tracking-wider text-slate-800 leading-tight">
                CLEAN FOOD
                <br />
                BRIGHTER FUTURE
              </h4>

              <div className="my-3 p-2 border border-slate-200 rounded-lg bg-slate-50">
                <Leaf className="w-16 h-16 text-[#2D6A4F]" />
              </div>

              <span className="text-[10px] font-bold text-slate-600 tracking-wider">
                SCAN TO KNOW
              </span>
            </div>

            <div className="w-full text-center mt-3">
              <span className="text-[10px] text-[#7A6440] font-medium">
                100% Traceable Organic Grains
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-5xl mx-auto px-6 py-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 rounded-full bg-emerald-100/60 flex items-center justify-center text-[#2D6A4F] mb-1.5">
            <Leaf className="w-5 h-5 fill-[#2D6A4F]" />
          </div>
          <span className="text-xs font-bold text-slate-700">Food Safety</span>
        </div>

        <div className="flex flex-col items-center">
          <div className="w-10 h-10 rounded-full bg-emerald-100/60 flex items-center justify-center text-[#2D6A4F] mb-1.5">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-slate-700">Authentic Products</span>
        </div>

        <div className="flex flex-col items-center">
          <div className="w-10 h-10 rounded-full bg-emerald-100/60 flex items-center justify-center text-[#2D6A4F] mb-1.5">
            <BarChart3 className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-slate-700">Evidence Based</span>
        </div>

        <div className="flex flex-col items-center">
          <div className="w-10 h-10 rounded-full bg-emerald-100/60 flex items-center justify-center text-[#2D6A4F] mb-1.5">
            <Users className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-slate-700">Healthier Communities</span>
        </div>
      </footer>
    </div>
  );
}