import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, User, Building2 } from "lucide-react";
import hytLogo from "@/assets/hyt-logo.png";

export default function SignUp() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", department: "", password: "", confirm: "" });

  const update = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/signin");
  };

  return (
    <div className="flex min-h-screen">
      {/* Left panel */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden flex-col justify-between p-12"
        style={{ background: "linear-gradient(180deg, hsl(20 30% 12%) 0%, hsl(15 25% 8%) 100%)" }}>
        <div>
          <img src={hytLogo} alt="HYT Foundation" width={140} height={140} className="mb-6" />
        </div>
        <div>
          <h2 className="text-4xl font-display font-bold leading-tight mb-6">
            <span className="text-[hsl(180,70%,50%)]">START YOUR</span><br />
            <span className="text-[hsl(45,90%,55%)]">JOURNEY WITH</span><br />
            <span className="text-[hsl(0,80%,55%)]">DREAM ACADEMY</span>
          </h2>
        </div>
        <p className="text-sm leading-relaxed max-w-md" style={{ color: "hsl(30 15% 60%)" }}>
          Join our internship program and gain real-world experience with professional mentorship. Build your skills, grow your network, and launch your career.
        </p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center bg-background p-8">
        <div className="w-full max-w-md">
          <h1 className="text-4xl font-display font-bold text-foreground mb-2">Create account.</h1>
          <p className="text-muted-foreground mb-8">Begin your internship journey today.</p>

          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type="text" value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Enter your full name"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="Enter your email"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Department</label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <select value={form.department} onChange={(e) => update("department", e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring appearance-none">
                  <option value="">Select department...</option>
                  <option value="tech">Technology & Innovation</option>
                  <option value="marketing">Marketing & Communications</option>
                  <option value="hr">Human Resources</option>
                  <option value="finance">Finance & Accounting</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type={showPassword ? "text" : "password"} value={form.password} onChange={(e) => update("password", e.target.value)} placeholder="Create a password"
                  className="w-full pl-10 pr-10 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2">
                  {showPassword ? <EyeOff className="w-4 h-4 text-muted-foreground" /> : <Eye className="w-4 h-4 text-muted-foreground" />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type="password" value={form.confirm} onChange={(e) => update("confirm", e.target.value)} placeholder="Confirm your password"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
            </div>

            <button type="submit" className="w-full py-3 rounded-lg bg-stat-orange text-white font-semibold text-sm hover:opacity-90 transition-opacity">
              Create Account
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account? <Link to="/signin" className="text-stat-orange font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
