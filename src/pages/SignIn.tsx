import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import hytLogo from "@/assets/hyt-logo.png";

export default function SignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    // For now, just navigate to demo selection
    navigate("/demo");
  };

  return (
    <div className="flex min-h-screen">
      {/* Left panel - dark branded */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden flex-col justify-between p-12"
        style={{ background: "linear-gradient(180deg, hsl(20 30% 12%) 0%, hsl(15 25% 8%) 100%)" }}>
        <div>
          <Link to="/" aria-label="Go to landing page" className="inline-block">
            <img src={hytLogo} alt="HYT Foundation" width={140} height={140} className="mb-6" />
          </Link>
        </div>
        <div>
          <h2 className="text-4xl font-display font-bold leading-tight mb-6">
            <span className="text-[hsl(180,70%,50%)]">BRINGING THE</span><br />
            <span className="text-[hsl(45,90%,55%)]">NEXT GENERATION</span><br />
            <span className="text-[hsl(0,80%,55%)]">FORWARD</span>
          </h2>
        </div>
        <p className="text-sm leading-relaxed max-w-md" style={{ color: "hsl(30 15% 60%)" }}>
          We are the foundation for future generation leaders in which we support to enlighten and hone the youth in acquiring an adept set of business skills, professionally mentoring young adults and directing them to pursue what they aspire to become.
        </p>
      </div>

      {/* Right panel - sign in form */}
      <div className="flex-1 flex items-center justify-center bg-background p-8">
        <div className="w-full max-w-md">
          <h1 className="text-4xl font-display font-bold text-foreground mb-2">Welcome back.</h1>
          <p className="text-muted-foreground mb-8">Sign in to continue your journey.</p>

          <form onSubmit={handleSignIn} className="space-y-5">
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-10 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2">
                  {showPassword ? <EyeOff className="w-4 h-4 text-muted-foreground" /> : <Eye className="w-4 h-4 text-muted-foreground" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="w-4 h-4 rounded border-border accent-primary" />
                <span className="text-sm text-muted-foreground">Remember Me</span>
              </label>
              <button type="button" className="text-sm font-medium text-stat-orange hover:underline">Forgot password?</button>
            </div>

            <button type="submit" className="w-full py-3 rounded-lg bg-stat-orange text-white font-semibold text-sm hover:opacity-90 transition-opacity">
              Sign in
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            New Here? <Link to="/signup" className="text-stat-orange font-medium hover:underline">Create your account</Link>
          </p>
          <p className="text-center mt-3">
            <Link to="/demo" className="text-stat-orange font-medium text-sm hover:underline">DEMO</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
