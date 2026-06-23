import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Mail, Lock, Loader2, AlertCircle } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [urlMessage, setUrlMessage] = useState<string | null>(null);
  const { user, login, error } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const msg = params.get('message');
    if (msg) {
      setUrlMessage(msg);
    }
  }, [location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUrlMessage(null);
    setIsSubmitting(true);
    try {
      await login(email, password);
      // Dynamic redirection based on role handled in AuthContext or here
    } catch (err) {
      // Error handled by context
    } finally {
      setIsSubmitting(false);
    }
  };

  // Effect to handle navigation once user is authenticated
  useEffect(() => {
    if (user) {
      const targetPath = user.role === 'Admin' ? '/dashboard/overview' : '/dashboard/profile';
      navigate(targetPath, { replace: true });
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0f172a] relative overflow-hidden px-4">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-md w-full z-10">
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-10 rounded-3xl shadow-2xl space-y-8">
          <div className="text-center space-y-2">
            <div className="inline-flex p-4 bg-blue-600/10 rounded-2xl mb-4">
              <LogIn className="h-8 w-8 text-blue-500" />
            </div>
            <h2 className="text-4xl font-bold text-white tracking-tight">Welcome Back</h2>
            <p className="text-slate-400 font-medium">Please enter your details to sign in</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {urlMessage && (
              <div className="bg-amber-500/10 border border-amber-500/50 text-amber-400 p-4 rounded-xl text-sm flex items-center gap-3 animate-pulse">
                <AlertCircle className="h-5 w-5 shrink-0" />
                {urlMessage}
              </div>
            )}
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl text-sm flex items-center gap-3 animate-shake">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                {error}
              </div>
            )}
            
            <div className="space-y-4">
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="email"
                  required
                  className="w-full pl-12 pr-4 py-4 bg-slate-800/50 border border-slate-700 text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-slate-500"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="password"
                  required
                  className="w-full pl-12 pr-4 py-4 bg-slate-800/50 border border-slate-700 text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-slate-500"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-semibold rounded-2xl shadow-lg shadow-blue-500/25 transform transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          <div className="text-center">
            <p className="text-slate-400 font-medium">
             Forgot password?
              <Link to="/forgot-password" className="text-blue-500 hover:text-blue-400 font-bold underline-offset-4 hover:underline transition-all">
                Reset it
              </Link>
            </p>
          </div>

          <div className="text-center">
            <p className="text-slate-400 font-medium">
              Don't have an account?{' '}
              <Link to="/register" className="text-blue-500 hover:text-blue-400 font-bold underline-offset-4 hover:underline transition-all">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
