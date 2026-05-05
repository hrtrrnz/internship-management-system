import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import hytLogo from "@/assets/hyt-logo.png";
import { portal } from "@/lib/portalTheme";
import { cn } from "@/lib/utils";
import { useRole, type UserRole } from "@/contexts/RoleContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const fieldClass =
  "w-full rounded-lg border border-border bg-background py-3 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring";

type DemoKey = "none" | UserRole;

type DemoAccount = {
  id: UserRole;
  label: string;
  email: string;
  password: string;
  path: string;
};

const demoAccounts: DemoAccount[] = [
  {
    id: "student",
    label: "Intern",
    email: "intern.dreamacademy@gmail.com",
    password: "Intern@123",
    path: "/portal",
  },
  {
    id: "mentor",
    label: "Mentor",
    email: "mentor@demo.dreamacademy.ph",
    password: "mentor",
    path: "/mentor",
  },
  {
    id: "admin",
    label: "Administrator",
    email: "admin@demo.dreamacademy.ph",
    password: "admin",
    path: "/admin",
  },
];

export default function SignIn() {
  const navigate = useNavigate();
  const { setRole } = useRole();
  const [demoKey, setDemoKey] = useState<DemoKey>("none");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);

  const applyDemoAccount = (key: DemoKey) => {
    setDemoKey(key);
    if (key === "none") {
      setEmail("");
      setPassword("");
      return;
    }
    const acc = demoAccounts.find((a) => a.id === key);
    if (acc) {
      setEmail(acc.email);
      setPassword(acc.password);
    }
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (demoKey === "none") {
      toast.error("Select a demo account to continue.");
      return;
    }
    const acc = demoAccounts.find((a) => a.id === demoKey);
    if (!acc) {
      toast.error("Invalid demo account.");
      return;
    }
    setRole(acc.id);
    navigate(acc.path, { state: { remember } });
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
            <span className="text-[#20d2ff]">BRINGING THE</span>
            <br />
            <span className="text-[#d6e63a]">NEXT GENERATION</span>
            <br />
            <span className="text-[#ff6f3b]">FORWARD</span>
          </h2>
        </div>
        <p className={cn("max-w-md text-sm leading-relaxed", portal.muted)}>
          We are the foundation for future generation leaders in which we support to enlighten and hone the youth in
          acquiring an adept set of business skills, professionally mentoring young adults and directing them to pursue what
          they aspire to become.
        </p>
      </div>

      <div className="flex flex-1 items-center justify-center bg-background p-6 sm:p-8">
        <div className="w-full max-w-md">
          <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Dream Academy Portal</p>
          <h1 className="mb-2 font-display text-4xl font-bold text-foreground">Welcome back.</h1>
          <p className="mb-8 text-sm text-muted-foreground">Sign in to continue your journey.</p>

          <form onSubmit={handleSignIn} className="space-y-5">
            <div className="space-y-1.5">
              <label htmlFor="demo-account" className="text-sm font-medium text-foreground">
                Demo account
              </label>
              <Select value={demoKey} onValueChange={(v) => applyDemoAccount(v as DemoKey)}>
                <SelectTrigger id="demo-account" className="h-11 w-full">
                  <SelectValue placeholder="Select demo account" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Select demo account</SelectItem>
                  {demoAccounts.map((acc) => (
                    <SelectItem key={acc.id} value={acc.id}>
                      {acc.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">Credentials fill in automatically for the role you pick.</p>
            </div>

            <div>
              <label htmlFor="signin-email" className="mb-1.5 block text-sm font-medium text-foreground">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="signin-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className={fieldClass}
                  autoComplete="username"
                />
              </div>
            </div>

            <div>
              <label htmlFor="signin-password" className="mb-1.5 block text-sm font-medium text-foreground">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="signin-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className={cn(fieldClass, "pr-10")}
                  autoComplete="current-password"
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

            <div className="flex items-center justify-between">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="h-4 w-4 rounded border-border accent-primary"
                />
                <span className="text-sm text-muted-foreground">Remember Me</span>
              </label>
              <button type="button" className="text-sm font-medium text-stat-orange hover:underline">
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-stat-orange py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              Sign in
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            New Here?{" "}
            <Link to="/signup" className="font-medium text-stat-orange hover:underline">
              Create your account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
