import { BookOpen, CheckCircle, Clock, Play, Lock, ArrowRight } from "lucide-react";

const modules = [
  { id: 1, title: "React Fundamentals", lessons: 12, completed: 12, status: "Completed", progress: 100, description: "Core React concepts including components, hooks, and state management.", duration: "6h 30m" },
  { id: 2, title: "TypeScript for React", lessons: 8, completed: 6, status: "In Progress", progress: 75, description: "Type safety, interfaces, generics, and TypeScript patterns in React.", duration: "4h 15m" },
  { id: 3, title: "API Design & Integration", lessons: 10, completed: 3, status: "In Progress", progress: 30, description: "RESTful API design, fetch patterns, error handling, and caching.", duration: "5h 00m" },
  { id: 4, title: "Database Management", lessons: 6, completed: 0, status: "Not Started", progress: 0, description: "PostgreSQL, schema design, migrations, and query optimization.", duration: "3h 45m" },
  { id: 5, title: "UI/UX Design Principles", lessons: 8, completed: 0, status: "Not Started", progress: 0, description: "Design thinking, accessibility, responsive design, and user research.", duration: "4h 00m" },
  { id: 6, title: "Testing & QA", lessons: 7, completed: 0, status: "Not Started", progress: 0, description: "Unit testing, integration testing, E2E testing with Playwright.", duration: "3h 30m" },
];

const statusIcon: Record<string, React.ElementType> = {
  Completed: CheckCircle,
  "In Progress": Play,
  "Not Started": Lock,
};

export default function LearningModules() {
  const currentModule = modules.find(m => m.status === "In Progress");
  const totalProgress = Math.round(modules.reduce((sum, m) => sum + m.progress, 0) / modules.length);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold text-foreground">Learning Modules</h2>
      </div>

      {/* Hero: Current Module */}
      {currentModule && (
        <div className="bg-primary rounded-2xl p-6 text-primary-foreground relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10" style={{ background: 'white', filter: 'blur(60px)' }} />
          <div className="relative z-10">
            <span className="text-xs font-medium bg-white/20 px-3 py-1 rounded-full">Continue Learning</span>
            <h3 className="text-2xl font-display font-bold mt-3">{currentModule.title}</h3>
            <p className="text-sm opacity-80 mt-1 max-w-lg">{currentModule.description}</p>
            <div className="flex items-center gap-6 mt-4">
              <div>
                <p className="text-2xl font-bold font-display">{currentModule.progress}%</p>
                <p className="text-xs opacity-70">Progress</p>
              </div>
              <div>
                <p className="text-2xl font-bold font-display">{currentModule.completed}/{currentModule.lessons}</p>
                <p className="text-xs opacity-70">Lessons</p>
              </div>
              <div>
                <p className="text-2xl font-bold font-display">{currentModule.duration}</p>
                <p className="text-xs opacity-70">Est. Duration</p>
              </div>
              <button className="ml-auto flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white/20 backdrop-blur-sm text-sm font-medium hover:bg-white/30 transition-colors">
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-4 w-full h-2 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-white rounded-full" style={{ width: `${currentModule.progress}%` }} />
            </div>
          </div>
        </div>
      )}

      {/* Overall progress */}
      <div className="flex items-center gap-4 bg-card rounded-xl border border-border px-5 py-3">
        <BookOpen className="w-5 h-5 text-muted-foreground" />
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-foreground">Overall Progress</span>
            <span className="text-sm font-bold text-foreground">{totalProgress}%</span>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-accent rounded-full transition-all" style={{ width: `${totalProgress}%` }} />
          </div>
        </div>
        <span className="text-xs text-muted-foreground">{modules.filter(m => m.status === "Completed").length} of {modules.length} modules</span>
      </div>

      {/* Module path */}
      <div className="space-y-3">
        {modules.map((m, i) => {
          const Icon = statusIcon[m.status];
          const isActive = m.status === "In Progress";
          const isLocked = m.status === "Not Started";
          const isDone = m.status === "Completed";

          return (
            <div
              key={m.id}
              className={`flex items-center gap-5 p-5 rounded-xl border transition-all cursor-pointer
                ${isActive ? 'bg-card border-primary shadow-sm' : isDone ? 'bg-card border-border' : 'bg-muted/30 border-border opacity-70'}
                ${!isLocked ? 'hover:shadow-md' : ''}
              `}
            >
              {/* Step number / icon */}
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                isDone ? 'bg-stat-green-bg' : isActive ? 'bg-primary/10' : 'bg-muted'
              }`}>
                {isDone ? (
                  <CheckCircle className="w-6 h-6 text-stat-green" />
                ) : (
                  <span className={`text-lg font-bold font-display ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>{i + 1}</span>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <h4 className={`font-semibold ${isActive ? 'text-primary' : 'text-foreground'}`}>{m.title}</h4>
                  {isActive && <span className="px-2 py-0.5 rounded text-[10px] font-medium text-stat-blue bg-stat-blue-bg animate-pulse">Current</span>}
                </div>
                <p className="text-xs text-muted-foreground">{m.lessons} lessons · {m.duration}</p>
              </div>

              {/* Progress */}
              <div className="flex items-center gap-3 flex-shrink-0">
                {isDone ? (
                  <span className="text-sm font-medium text-stat-green">Complete ✓</span>
                ) : isActive ? (
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${m.progress}%` }} />
                    </div>
                    <span className="text-xs font-medium text-foreground w-8">{m.progress}%</span>
                  </div>
                ) : (
                  <Lock className="w-4 h-4 text-muted-foreground" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
