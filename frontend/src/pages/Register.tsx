import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Mail, Lock, User, Shield, Loader2, Check, X } from 'lucide-react';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'User'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, register, error } = useAuth();
  const navigate = useNavigate();

  const passwordRequirements = useMemo(() => [
    { label: 'At least 8 characters', test: (pwd: string) => pwd.length >= 8 },
    { label: 'One uppercase letter', test: (pwd: string) => /[A-Z]/.test(pwd) },
    { label: 'One lowercase letter', test: (pwd: string) => /[a-z]/.test(pwd) },
    { label: 'One number', test: (pwd: string) => /[0-9]/.test(pwd) },
    { label: 'One special character', test: (pwd: string) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd) },
  ], []);

  const isEmailValid = useMemo(() => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(formData.email);
  }, [formData.email]);

  const isPasswordValid = useMemo(() => {
    return passwordRequirements.every(req => req.test(formData.password));
  }, [formData.password, passwordRequirements]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEmailValid || !isPasswordValid) return;

    setIsSubmitting(true);
    try {
      await register(formData);
    } catch (err) {
      // Error handled by context
    } finally {
      setIsSubmitting(false);
    }
  };

  // Effect to handle navigation once user is authenticated
  React.useEffect(() => {
    if (user) {
      const targetPath = user.role === 'Admin' ? '/dashboard/overview' : '/dashboard/profile';
      navigate(targetPath, { replace: true });
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0f172a] relative overflow-hidden px-4 py-12">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-600/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-md w-full z-10">
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-10 rounded-3xl shadow-2xl space-y-8">
          <div className="text-center space-y-2">
            <div className="inline-flex p-4 bg-emerald-600/10 rounded-2xl mb-4">
              <UserPlus className="h-8 w-8 text-emerald-500" />
            </div>
            <h2 className="text-4xl font-bold text-white tracking-tight">Create Account</h2>
            <p className="text-slate-400 font-medium">Join us to access your dashboard</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl text-sm flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                {error}
              </div>
            )}
            
            <div className="space-y-4">
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-emerald-500 transition-colors" />
                <input
                  type="text"
                  required
                  className="w-full pl-12 pr-4 py-4 bg-slate-800/50 border border-slate-700 text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all placeholder:text-slate-500"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="relative group">
                <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors ${formData.email && !isEmailValid ? 'text-red-500' : 'text-slate-500 group-focus-within:text-emerald-500'}`} />
                <input
                  type="email"
                  required
                  className={`w-full pl-12 pr-4 py-4 bg-slate-800/50 border text-white rounded-2xl focus:outline-none focus:ring-2 transition-all placeholder:text-slate-500 ${formData.email && !isEmailValid ? 'border-red-500/50 focus:ring-red-500/50' : 'border-slate-700 focus:ring-emerald-500/50 focus:border-emerald-500'}`}
                  placeholder="Email address"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                {formData.email && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    {isEmailValid ? (
                      <Check className="h-5 w-5 text-emerald-500" />
                    ) : (
                      <X className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <div className="relative group">
                  <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors ${formData.password && !isPasswordValid ? 'text-red-500' : 'text-slate-500 group-focus-within:text-emerald-500'}`} />
                  <input
                    type="password"
                    required
                    className={`w-full pl-12 pr-4 py-4 bg-slate-800/50 border text-white rounded-2xl focus:outline-none focus:ring-2 transition-all placeholder:text-slate-500 ${formData.password && !isPasswordValid ? 'border-red-500/50 focus:ring-red-500/50' : 'border-slate-700 focus:ring-emerald-500/50 focus:border-emerald-500'}`}
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
                
                {formData.password && (
                  <div className="bg-slate-800/30 p-4 rounded-2xl border border-slate-800 space-y-2">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Password Requirements</p>
                    <div className="grid grid-cols-1 gap-2">
                      {passwordRequirements.map((req, index) => {
                        const met = req.test(formData.password);
                        return (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            {met ? (
                              <div className="bg-emerald-500/10 p-0.5 rounded-full">
                                <Check className="h-3 w-3 text-emerald-500" />
                              </div>
                            ) : (
                              <div className="bg-slate-700 p-0.5 rounded-full">
                                <X className="h-3 w-3 text-slate-400" />
                              </div>
                            )}
                            <span className={met ? 'text-emerald-500 font-medium' : 'text-slate-400'}>
                              {req.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              <div className="relative group">
                <Shield className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-emerald-500 transition-colors" />
                <select
                  className="w-full pl-12 pr-4 py-4 bg-slate-800/50 border border-slate-700 text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all appearance-none cursor-pointer"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as 'Admin' | 'User' })}
                >
                  <option value="User" className="bg-slate-900">User Role</option>
                  <option value="Admin" className="bg-slate-900">Admin Role</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !isEmailValid || !isPasswordValid}
              className="w-full py-4 px-6 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-semibold rounded-2xl shadow-lg shadow-emerald-500/25 transform transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:grayscale flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div className="text-center">
            <p className="text-slate-400 font-medium">
              Already have an account?{' '}
              <Link to="/login" className="text-emerald-500 hover:text-emerald-400 font-bold underline-offset-4 hover:underline transition-all">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
