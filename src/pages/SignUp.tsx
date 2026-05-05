import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, User, Building2 } from "lucide-react";
import hytLogo from "@/assets/hyt-logo.png";
import { portal } from "@/lib/portalTheme";
import { cn } from "@/lib/utils";

const fieldClass =
  "w-full rounded-lg border border-border bg-background py-3 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring";

export default function SignUp() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", department: "", password: "", confirm: "" });

  const update = (field: string, value: string) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/signin");
  };

  return (
    <div className="flex min-h-screen">
      <div
        className={cn(
          "relative hidden w-1/2 flex-col justify-between overflow-hidden p-12 lg:flex",
          portal.bg,
          portal.text,
        )}
      >
        <div>
          <Link to="/" aria-label="Go to landing page" className="inline-block">
            <img src={hytLogo} alt="HYT Foundation" width={140} height={140} className="mb-6" />
          </Link>
        </div>
        <div>
          <h2 className="mb-6 font-display text-4xl font-bold leading-tight">
            <span className="text-[#20d2ff]">START YOUR</span>
            <br />
            <span className="text-[#d6e63a]">JOURNEY WITH</span>
            <br />
            <span className="text-[#ff6f3b]">DREAM ACADEMY</span>
          </h2>
        </div>
        <p className={cn("max-w-md text-sm leading-relaxed", portal.muted)}>
          Join our internship program and gain real-world experience with professional mentorship. Build your skills, grow
          your network, and launch your career.
        </p>
      </div>

      <div className="flex flex-1 items-center justify-center bg-background p-6 sm:p-8">
        <div className="w-full max-w-md">
          <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Dream Academy Portal</p>
          <h1 className="mb-2 font-display text-4xl font-bold text-foreground">Create account.</h1>
          <p className="mb-8 text-sm text-muted-foreground">Begin your internship journey today.</p>

          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <label htmlFor="signup-name" className="mb-1.5 block text-sm font-medium text-foreground">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="signup-name"
                  type="text"
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder="Enter your full name"
                  className={fieldClass}
                />
              </div>
            </div>

            <div>
              <label htmlFor="signup-email" className="mb-1.5 block text-sm font-medium text-foreground">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="signup-email"
                  type="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  placeholder="Enter your email"
                  className={fieldClass}
                />
              </div>
            </div>

            <div>
              <label htmlFor="signup-dept" className="mb-1.5 block text-sm font-medium text-foreground">
                Department
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <select
                  id="signup-dept"
                  value={form.department}
                  onChange={(e) => update("department", e.target.value)}
                  className={cn(fieldClass, "appearance-none")}
                >
                  <option value="">Select department...</option>
                  <option value="tech">Technology & Innovation</option>
                  <option value="marketing">Marketing & Communications</option>
                  <option value="hr">Human Resources</option>
                  <option value="finance">Finance & Accounting</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="signup-password" className="mb-1.5 block text-sm font-medium text-foreground">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="signup-password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => update("password", e.target.value)}
                  placeholder="Create a password"
                  className={cn(fieldClass, "pr-10")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="signup-confirm" className="mb-1.5 block text-sm font-medium text-foreground">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="signup-confirm"
                  type="password"
                  value={form.confirm}
                  onChange={(e) => update("confirm", e.target.value)}
                  placeholder="Confirm your password"
                  className={fieldClass}
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-stat-orange py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              Create Account
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/signin" className="font-medium text-stat-orange hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
