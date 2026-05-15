import { Link } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import hytLogo from "@/assets/hyt-logo.png";
import hytFullLogo from "@/assets/hyt full logo.png";
import landingBg from "@/assets/background.jpg";
import hytBlackLogo from "../../logo black.png";
import img1 from "@/assets/1.jpg";
import img2 from "@/assets/2.jpg";
import img3 from "@/assets/3.jpg";
import img4 from "@/assets/4.jpg";
import img5 from "@/assets/5.jpg";
import img6 from "@/assets/6.jpg";
import why1 from "@/assets/why1.jpg";
import why2 from "@/assets/why2.jpg";
import train1 from "@/assets/train1.jpg";
import aboutFoundationImg from "@/assets/About.jpg";
import missionFoundationImg from "@/assets/Mission.jpg";
import visionFoundationImg from "@/assets/Vision.jpg";
import creativeUnitCardBg from "@/assets/Creative Unit.png";
import hrUnitCardBg from "@/assets/HR Unit.png";
import salesMarketingUnitCardBg from "@/assets/Sales and Marketing Unit.png";
import engineeringUnitCardBg from "@/assets/Engineering Unit.png";
import techUnitCardBg from "@/assets/Tech Unit.jpg";
import accountingUnitCardBg from "@/assets/Accounting Unit.jpg";
import lawAndJusticeUnitCardBg from "@/assets/Law and Justice Unit.jpg";
import lndUnitCardBg from "@/assets/LnD Unit.jpeg";
import { cn } from "@/lib/utils";
import { portalButtonClass } from "@/lib/portalTheme";
import { Sparkles, Target, Users } from "lucide-react";

const topCards = [
  {
    title: "About us",
    text: "HYT Foundation exists to inspire and aid young entrepreneurs to attain their full potential. Our purpose is to bring the next generation forward - establishing a future with a society of young generation leaders.",
    accent: "border-l-[#f26e4b]",
    color: "#f26e4b",
  },
  {
    title: "Our Vision",
    text: "Establish a competent society of young professional leaders and entrepreneurs through honing their vocational aptitude with the means of advanced technology, innovating creations to serve the world.",
    accent: "border-l-[#21b7c8]",
    color: "#21b7c8",
  },
  {
    title: "Our Mission",
    text: "Guiding young and aspiring generation leaders by professionally mentoring them, developing a social responsibility and empowering them to pass it forward to future generations while growing internationally.",
    accent: "border-l-[#ebe01a]",
    color: "#ebe01a",
  },
];

const valueGridImages = [img1, img2, img3, img4, img5, img6];

type UnitColumn = {
  title: string;
  stripe: string;
  gradient: string;
  description: string;
  items: string[];
  /** Full-bleed photo on card front (with overlays). */
  cardBg?: string;
};

const unitColumns: UnitColumn[] = [
  {
    title: "Creative Unit",
    stripe: "bg-[#f26e4b]",
    gradient: "from-[#f26e4b]/70 via-background/25 to-background/75",
    description: "Design-driven projects that shape HYT’s visual identity across campaigns, brand assets, and content.",
    items: ["Logo", "Animation", "Brand sheet", "Social media posts", "Portfolio", "Pitch deck design"],
    cardBg: creativeUnitCardBg,
  },
  {
    title: "Human Resources Unit",
    stripe: "bg-[#2bb2c8]",
    gradient: "from-[#2bb2c8]/70 via-background/25 to-background/75",
    description: "People operations work focused on recruiting, systems improvement, engagement, and learning support.",
    items: ["Recruitment", "HRMS research and development", "Employee engagement", "Assist in L&D unit"],
    cardBg: hrUnitCardBg,
  },
  {
    title: "Sales & Marketing Unit",
    stripe: "bg-[#eedc18]",
    gradient: "from-[#eedc18]/70 via-background/25 to-background/75",
    description: "Customer-focused initiatives covering lead generation, partnerships, marketing strategy, and community growth.",
    items: ["Lead Generation", "Marketing Plan", "Partnership", "Pitch deck", "Community management"],
    cardBg: salesMarketingUnitCardBg,
  },
  {
    title: "Engineering Unit",
    stripe: "bg-[#d85f75]",
    gradient: "from-[#d85f75]/70 via-background/25 to-background/75",
    description: "Process and production analysis with research work, planning, and improvements tied to real operations.",
    items: ["Time and Motion Study", "Cost Benefit Analysis", "Production Planning", "Research and IIOT"],
    cardBg: engineeringUnitCardBg,
  },
  {
    title: "Technology Unit",
    stripe: "bg-[#2baec0]",
    gradient: "from-[#2baec0]/70 via-background/25 to-background/75",
    description: "Build and ship software solutions—web/mobile design, frontend/backend development, and applied R&D.",
    items: ["Front-end / Back-end", "Web and mobile design", "Programming", "Research and Development"],
    cardBg: techUnitCardBg,
  },
  {
    title: "Accounting Unit",
    stripe: "bg-[#f37a53]",
    gradient: "from-[#f37a53]/70 via-background/25 to-background/75",
    description: "Support finance workflows through administrative work, research, and accounting information systems initiatives.",
    items: ["AIS research", "Administrative", "R&D of KGC"],
    cardBg: accountingUnitCardBg,
  },
  {
    title: "Legal & Justice Unit",
    stripe: "bg-[#d76589]",
    gradient: "from-[#d76589]/70 via-background/25 to-background/75",
    description: "Legal support tasks involving research, document drafting, transcription, and contract review assistance.",
    items: ["Legal Research", "Draft legal documents", "Transcription of meetings", "Review contracts"],
    cardBg: lawAndJusticeUnitCardBg,
  },
  {
    title: "Learning & Development Unit",
    stripe: "bg-[#f2e820]",
    gradient: "from-[#f2e820]/70 via-background/25 to-background/75",
    description: "Programs and enablement efforts—planning, organizational development support, and knowledge-building initiatives.",
    items: ["Lead Generation", "Strategic Plan", "Organizational Development", "Managerial delegations"],
    cardBg: lndUnitCardBg,
  },
];

const tallestUnit = unitColumns.reduce((tallest, unit) =>
  unit.items.length > tallest.items.length ? unit : tallest,
);

const section = "py-8 sm:py-10";
const container = "mx-auto max-w-6xl px-4 sm:px-6";

export default function Landing() {
  const [flippedUnits, setFlippedUnits] = useState<Record<string, boolean>>({});
  const [aboutCompass, setAboutCompass] = useState<(typeof topCards)[number]["title"]>(topCards[0]?.title ?? "About us");

  return (
    <div id="top" className="flex min-h-screen flex-col bg-background text-foreground antialiased">
      {/* Hero band — shared background for header + hero */}
      <div className="relative isolate overflow-hidden border-b border-white/10">
        <div className="absolute inset-0">
          <div
            className="h-full w-full bg-cover bg-center bg-fixed bg-no-repeat"
            style={{ backgroundImage: `url(${landingBg})` }}
            aria-hidden
          />
          <div className="absolute inset-0 bg-black/60" />
          <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/55 to-black/20" />
        </div>

        <header className="relative z-10 sticky top-0 z-50 border-b border-white/10 bg-black/25 backdrop-blur-md">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-3.5">
          <Link to="/" className="flex min-w-0 items-center gap-2.5">
            <img src={hytLogo} alt="HYT Foundation" width={44} height={44} className="shrink-0 sm:h-11 sm:w-11" />
            <div className="min-w-0 leading-tight">
              <p className="truncate text-[11px] font-semibold tracking-wide text-white/90 sm:text-xs">
                HELPING YOUTH TRANSCEND
              </p>
              <p className="text-[10px] font-medium tracking-wide text-white/70 sm:text-[11px]">FOUNDATION INC.</p>
            </div>
          </Link>
          <nav className="hidden items-center gap-5 text-sm font-medium text-white/80 md:flex">
            <a href="#top" className="transition-colors hover:text-white">
              Home
            </a>
            <a href="#about" className="transition-colors hover:text-white">
              About Us
            </a>
            <a href="#join" className="transition-colors hover:text-white">
              Why Join Us?
            </a>
            <a href="#dream-academy" className="transition-colors hover:text-white">
              Dream Academy
            </a>
            <a href="#units" className="transition-colors hover:text-white">
              Units
            </a>
            <a href="#contact" className="transition-colors hover:text-white">
              Contact Us
            </a>
          </nav>
          <div className="flex shrink-0 items-center gap-2.5 sm:gap-4">
            <span className="cursor-default text-xs text-white/75 sm:text-sm">Donate</span>
            <Button
              asChild
              size="sm"
              className={cn(
                portalButtonClass,
                "h-auto min-h-9 max-w-[10.5rem] whitespace-normal px-2.5 py-2 text-center text-[11px] font-semibold leading-snug sm:max-w-none sm:px-4 sm:text-sm sm:leading-none",
              )}
            >
              <Link to="/signin">Dream Academy Portal</Link>
            </Button>
          </div>
        </div>
      </header>

        <section className={`relative z-10 ${container} flex min-h-[58vh] flex-col justify-center py-16 text-center sm:min-h-[64vh] sm:py-20 md:min-h-[68vh] md:py-24`}>
          <h1
            className="text-4xl font-extrabold uppercase leading-[1.08] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
            style={{ fontFamily: '"Happy Monkey", system-ui' }}
          >
            <span className="block text-[#ff4a2f]">Bringing the</span>
            <span className="block text-[#00d2ff]">Next Generation</span>
            <span className="block text-[#f5ec24]">Forward</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/90 sm:mt-7 sm:text-lg md:text-xl">
            We are the foundation for future generation leaders in which we support to enlighten and hone the youth in
            acquiring an adept set of business skills, professionally mentoring young adults and directing them to pursue what
            they aspire to become.
          </p>
          <div className="mt-8 flex justify-center sm:mt-10">
            <Button asChild size="lg" className="rounded-full px-10 text-base font-semibold">
              <a href="#about">ABOUT US</a>
            </Button>
          </div>
        </section>
      </div>

      <main className="flex-1">
        {/* Foundation */}
        <section id="about" className={cn("scroll-mt-16  bg-muted/25", section)}>
          <div className={container}>
            <div className="flex flex-col gap-1 text-center sm:text-left">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Foundation</p>
              <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">Who we are</h2>
            </div>
            <div className="mt-6">
              {(() => {
                const active = topCards.find((c) => c.title === aboutCompass) ?? topCards[0];
                const activeColor = active?.color ?? "#ffffff";
                const tabs = topCards.map((c) => ({
                  title: c.title,
                  short: c.title === "About us" ? "About" : c.title === "Our Vision" ? "Vision" : "Mission",
                }));
                const activeIdx = Math.max(0, tabs.findIndex((t) => t.title === aboutCompass));

                const foundationPanelImage =
                  active.title === "About us"
                    ? aboutFoundationImg
                    : active.title === "Our Vision"
                      ? visionFoundationImg
                      : missionFoundationImg;
                const foundationPanelAlt =
                  active.title === "About us"
                    ? "HYT Foundation team"
                    : active.title === "Our Vision"
                      ? "Vision and future direction"
                      : "Mission and purpose";

                return (
                  <div className="rounded-3xl  bg-card/80 shadow-sm backdrop-blur-sm overflow-hidden">
                    <div
                      className="relative p-5 sm:p-6"
                      style={{
                        backgroundImage: `radial-gradient(900px circle at 30% 0%, ${activeColor}40 0%, transparent 50%), radial-gradient(700px circle at 100% 30%, ${activeColor}28 0%, transparent 55%)`,
                      }}
                    >
                      <div className="mx-auto max-w-4xl">
                        <div className="flex items-center justify-between gap-2 rounded-2xl bg-background/60 p-2 shadow-sm">
                          

                          <div className="relative grid flex-1 grid-cols-3 rounded-xl bg-muted/40 p-1">
                            <div
                              className="pointer-events-none absolute inset-y-1 left-1 w-[calc((100%-0.5rem)/3)] rounded-lg bg-background shadow-sm transition-transform duration-300 ease-out"
                              style={{ transform: `translateX(${activeIdx * 100}%)` }}
                              aria-hidden
                            />
                            {tabs.map((t) => {
                              const isActive = t.title === aboutCompass;
                              return (
                                <button
                                  key={t.title}
                                  type="button"
                                  onClick={() => setAboutCompass(t.title)}
                                  className={cn(
                                    "relative z-10 rounded-lg px-3 py-2 text-xs font-semibold transition-colors",
                                    isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                                  )}
                                  aria-pressed={isActive}
                                >
                                  {t.short}
                                </button>
                              );
                            })}
                          </div>

                          
                        </div>

                        <div className="mt-5 grid gap-5 lg:grid-cols-2 lg:items-stretch">
                          <div className="min-w-0">
                            <div key={active.title} className="animate-in fade-in-0 slide-in-from-bottom-2 duration-250">
                              <h4 className="text-lg font-semibold tracking-tight text-foreground sm:text-xl">{active.title}</h4>
                              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{active.text}</p>
                            </div>
                          </div>
                          <div className="relative min-h-[260px] overflow-hidden rounded-2xl border border-border/60 bg-muted/30 sm:min-h-[320px]">
                            <img
                              key={active.title}
                              src={foundationPanelImage}
                              alt={foundationPanelAlt}
                              className="h-full w-full min-h-[260px] object-cover sm:min-h-[320px]"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </section>

        {/* Values — horizontal strip + compact logo */}
        <section className={cn(section, "border-b border-border/40")}>
          <div className={container}>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-xl">
                <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">Our values</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  HYT Foundation seeks to inspire and aid young entrepreneurs to attain their full potential. Our purpose is
                  to bring the next generation forward and establish a society of young generation leaders.
                </p>
              </div>
              <div className="flex justify-center lg:justify-end">
                <img src={hytBlackLogo} alt="HYT black logo" className="h-11 w-auto max-w-[140px] object-contain opacity-90 sm:h-12" />
              </div>
            </div>
            <div className="mx-auto mt-5 grid w-full max-w-3xl grid-cols-3 gap-2.5 sm:max-w-4xl sm:gap-3 md:max-w-5xl md:grid-cols-6">
              {valueGridImages.map((imageSrc, i) => (
                <div
                  key={i}
                  className="aspect-[4/3] w-full overflow-hidden rounded-lg border border-border/60 bg-card shadow-sm"
                >
                  <img src={imageSrc} alt={`HYT values ${i + 1}`} className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why join — centered image pair, then tabs */}
        <section id="join" className={cn("scroll-mt-16 border-b border-border/40 bg-muted/20", section)}>
          <div className={container}>
            <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">Why join us</h2>
            <div className="mx-auto mt-5 grid max-w-3xl grid-cols-2 gap-3 sm:max-w-4xl sm:gap-4">
              <div className="aspect-[4/3] overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm">
                <img src={why1} alt="Why should you join" className="h-full w-full object-cover" />
              </div>
              <div className="aspect-[4/3] overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm">
                <img src={why2} alt="Who are we helping" className="h-full w-full object-cover" />
              </div>
            </div>
            <Tabs defaultValue="why-do" className="mx-auto mt-6 w-full max-w-3xl sm:max-w-4xl">
              <TabsList className="grid h-auto w-full grid-cols-2 gap-1 rounded-xl bg-muted/60 p-1 sm:grid-cols-4">
                <TabsTrigger value="why-do" className="rounded-lg text-xs sm:text-sm">
                  Why we do it
                </TabsTrigger>
                <TabsTrigger value="who-are" className="rounded-lg text-xs sm:text-sm">
                  Who we are
                </TabsTrigger>
                <TabsTrigger value="why-join" className="rounded-lg text-xs sm:text-sm">
                  Why join
                </TabsTrigger>
                <TabsTrigger value="who-help" className="rounded-lg text-xs sm:text-sm">
                  Who we help
                </TabsTrigger>
              </TabsList>
              <TabsContent value="why-do" className="mt-4 rounded-2xl border border-border/60 bg-card/80 p-4 text-sm leading-relaxed text-muted-foreground shadow-sm">
                Our goal is to bring forth knowledgeable young entrepreneurs and cater the world&apos;s needs through these
                exemplary leaders while adapting and understanding generational differences by being flexible and innovative.
              </TabsContent>
              <TabsContent value="who-are" className="mt-4 rounded-2xl border border-border/60 bg-card/80 p-4 text-sm leading-relaxed text-muted-foreground shadow-sm">
                We are the foundation for future generation leaders in which we support to enlighten and hone the youth in
                acquiring an adept set of business skills, professionally mentoring young adults and directing them to pursue
                what they aspire to become.
              </TabsContent>
              <TabsContent value="why-join" className="mt-4 rounded-2xl border border-border/60 bg-card/80 p-4 shadow-sm">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  To become outstanding young aspiring leaders and entrepreneurs, the HYT Foundation Inc. provides
                  opportunities for young people to learn and enhance their abilities.
                </p>
              </TabsContent>
              <TabsContent value="who-help" className="mt-4 rounded-2xl border border-border/60 bg-card/80 p-4 shadow-sm">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  The HYT Foundation Inc. is assisting future generations in accomplishing goals, by providing professional
                  mentoring to emerging professional leaders and entrepreneurs. To motivate and pass on their knowledge and
                  skills to future generations leaders.
                </p>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Dream Academy — single slab */}
        <section id="dream-academy" className={cn("scroll-mt-16 border-b border-border/40", section)}>
          <div className={container}>
            <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-card via-muted/50 to-muted/70 shadow-sm">
              {/* accent bar */}
              <div
                className="h-1.5 w-full"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(255,74,47,0.95) 0%, rgba(0,210,255,0.95) 50%, rgba(245,236,36,0.95) 100%)",
                }}
                aria-hidden
              />
              {/* glow */}
              <div
                className="pointer-events-none absolute -top-24 right-0 h-72 w-72 rounded-full blur-3xl opacity-55"
                style={{ background: "radial-gradient(circle, rgba(0,210,255,0.75) 0%, transparent 55%)" }}
                aria-hidden
              />
              <div
                className="pointer-events-none absolute -bottom-24 left-0 h-72 w-72 rounded-full blur-3xl opacity-50"
                style={{ background: "radial-gradient(circle, rgba(255,74,47,0.75) 0%, transparent 55%)" }}
                aria-hidden
              />

              <div className="border-b border-border/40 bg-muted/40 px-5 py-4 sm:px-8">
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                      <Sparkles className="h-3.5 w-3.5" />
                      Featured Program
                    </div>
                    <h2 className="mt-2 text-xl font-semibold tracking-tight sm:text-2xl">
                    <span className="text-[#ff4a2f]">Dream</span>{" "}
                    <span className="text-[#00d2ff]">Academy</span>
                    <span className="ml-2 align-middle text-[#f5ec24]">•</span>
                    </h2>
                    <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                      A hands-on training experience built to help young people grow skills, gain real work exposure, and prepare for future careers.
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Button asChild size="sm" className={cn(portalButtonClass, "rounded-full")}>
                        <Link to="/signin">Open Portal</Link>
                      </Button>
                      <Button asChild size="sm" variant="outline" className="rounded-full">
                        <a href="#contact">Contact Us</a>
                      </Button>
                    </div>
                  </div>
                  <div
                    className="hidden h-2 w-32 rounded-full sm:block"
                    style={{
                      background:
                        "linear-gradient(90deg, rgba(255,74,47,0.9) 0%, rgba(0,210,255,0.9) 50%, rgba(245,236,36,0.9) 100%)",
                    }}
                    aria-hidden
                  />
                </div>
              </div>
              <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[1fr_260px] lg:gap-8">
                <div className="space-y-6 text-sm leading-relaxed text-muted-foreground">
                  <div className="flex flex-wrap gap-2">
                    <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-3 py-1.5 text-xs font-semibold text-foreground">
                      <Target className="h-4 w-4 text-[#ff4a2f]" />
                      Mentorship-led
                    </div>
                    <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-3 py-1.5 text-xs font-semibold text-foreground">
                      <Users className="h-4 w-4 text-[#00d2ff]" />
                      Multi-industry exposure
                    </div>
                    <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-3 py-1.5 text-xs font-semibold text-foreground">
                      <Sparkles className="h-4 w-4 text-[#f5ec24]" />
                      Hands-on learning
                    </div>
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-foreground">About Dream Academy</h3>
                    <p className="mt-2">
                      Dream Academy is a platform developed through the partnership of Helping Youth Transcend Foundation and
                      Klassic Solutions Inc. to assist young people in developing their abilities, talents, and gaining
                      experience in preparation for their future careers.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-foreground">Training program and objectives</h3>
                    <h4 className="mt-3 text-xs font-semibold uppercase tracking-wide text-primary">Training program</h4>
                    <p className="mt-1.5">
                      The Dream Academy Training Program consists of working as a trainee mainly under the Klassic Group of
                      Companies and trusted partners and sponsors. It is a multi-industry company that helps young people to
                      be flexible, adapt, grow and learn successfully.
                    </p>
                    <h4 className="mt-4 text-xs font-semibold uppercase tracking-wide text-primary">Training objectives</h4>
                    <p className="mt-1.5">
                      The Dream Academy is dedicated to assisting the younger generation in thriving, developing, and
                      transforming into their best selves. Since the organization is diversified, with numerous enterprises in
                      different industries, the youth will develop into well-rounded individuals. HYT Foundation Inc. desires
                      young people to transcend and preserve this generation while pursuing their aspirations.
                    </p>
                  </div>
                  <div className="border-t border-border/50 pt-6">
                    <h3 className="text-base font-semibold text-foreground">Dreamer&apos;s goals</h3>
                    <p className="mt-2">
                      Our goal is to inspire youths to lead, manage, and educate others as entrepreneurs. Also, bring forth their
                      abilities to explore and applaud it by sharing it with others. To realize its goal of serving the
                      world&apos;s youth and fostering their ambition to lead the next generation, this is to make the world a
                      better place for communities by contributing to our young people and general society in any such,
                      virtuous, and high-quality manner.
                    </p>
                  </div>
                </div>
                <div className="relative overflow-hidden rounded-2xl border border-border/60 lg:self-start">
                  <img
                    src={train1}
                    alt="Training Program and Objectives"
                    className="aspect-[3/4] w-full object-cover"
                  />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/70 via-black/20 to-transparent" aria-hidden />
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="inline-flex items-center rounded-full bg-black/60 px-3 py-1 text-[11px] font-semibold text-white">
                      Training Program
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Units — uniform card grid */}
        <section id="units" className={cn("scroll-mt-16 border-b border-border/40 bg-muted/25", section)}>
          <div className={container}>
            <div className="text-center">
              <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">Unit assignments</h2>
              <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
                Explore the units where trainees contribute across the organization.
              </p>
            </div>
            <div className="mx-auto mt-6 grid max-w-5xl grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
              {unitColumns.map((unit) => {
                const isFlipped = Boolean(flippedUnits[unit.title]);
                const photoBg = unit.cardBg;
                const hasPhotoBg = Boolean(photoBg);
                return (
                  <button
                    key={unit.title}
                    type="button"
                    onClick={() => setFlippedUnits((prev) => ({ ...prev, [unit.title]: !prev[unit.title] }))}
                    className="text-left [perspective:1200px]"
                    aria-label={`${unit.title} — ${isFlipped ? "Show description" : "Show unit list"}`}
                  >
                    <div
                      className={cn(
                        "relative w-full transition-transform duration-500 [transform-style:preserve-3d]",
                        hasPhotoBg
                          ? "rounded-2xl border border-white/10 shadow-2xl shadow-black/35 ring-1 ring-black/30"
                          : "rounded-xl border border-border/60 shadow-sm",
                        isFlipped ? "[transform:rotateY(180deg)]" : "[transform:rotateY(0deg)]",
                      )}
                    >
                      <div
                        className={cn(
                          "pointer-events-none flex flex-col overflow-hidden opacity-0",
                          hasPhotoBg ? "rounded-2xl" : "rounded-xl",
                        )}
                        aria-hidden
                      >
                        <div className="h-20 shrink-0 sm:h-24" />
                        <div className="p-3 sm:p-4">
                          <h3 className="text-center text-sm font-semibold leading-snug">{tallestUnit.title}</h3>
                          <ul className="mt-2 flex flex-col gap-1.5 text-justify text-xs leading-relaxed">
                            {tallestUnit.items.map((item) => (
                              <li key={item} className="flex gap-2">
                                <span className="shrink-0 text-muted-foreground" aria-hidden>
                                  —
                                </span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div
                        className={cn(
                          "absolute inset-0 flex flex-col overflow-hidden bg-card [backface-visibility:hidden]",
                          hasPhotoBg ? "rounded-2xl" : "rounded-xl",
                        )}
                      >
                        {hasPhotoBg ? (
                          <div className="relative h-20 w-full shrink-0 overflow-hidden sm:h-24">
                            <div
                              className="absolute inset-0 bg-cover bg-center"
                              style={{ backgroundImage: `url(${photoBg})` }}
                              aria-hidden
                            />
                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/40" aria-hidden />
                          </div>
                        ) : (
                          <div className={cn("h-1 w-full shrink-0", unit.stripe)} aria-hidden />
                        )}
                        <div className="flex min-h-0 flex-1 flex-col p-3 sm:p-4">
                          <h3 className="text-center text-sm font-semibold leading-snug text-foreground">{unit.title}</h3>
                          <p className="mt-2 flex-1 text-justify text-xs leading-relaxed text-muted-foreground">{unit.description}</p>
                          <div className="mt-auto flex justify-start pt-2 text-xs font-medium text-muted-foreground">
                            &gt; View Details
                          </div>
                        </div>
                      </div>

                      <div
                        className={cn(
                          "absolute inset-0 flex flex-col overflow-hidden bg-card [transform:rotateY(180deg)] [backface-visibility:hidden]",
                          hasPhotoBg ? "rounded-2xl" : "rounded-xl",
                        )}
                      >
                        {hasPhotoBg ? (
                          <div className="relative h-20 w-full shrink-0 overflow-hidden sm:h-24">
                            <div
                              className="absolute inset-0 bg-cover bg-center"
                              style={{ backgroundImage: `url(${photoBg})` }}
                              aria-hidden
                            />
                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/40" aria-hidden />
                          </div>
                        ) : (
                          <div className={cn("h-1 w-full shrink-0", unit.stripe)} aria-hidden />
                        )}
                        <div className="relative flex min-h-0 flex-1 flex-col">
                          <div className={cn("pointer-events-none absolute inset-0 bg-gradient-to-br", unit.gradient)} aria-hidden />
                          <div className="relative z-[1] flex min-h-0 flex-1 flex-col p-3 sm:p-4">
                            <h3 className="text-center text-sm font-semibold leading-snug text-foreground">{unit.title}</h3>
                            <ul className="mt-2 flex flex-1 flex-col gap-1.5 text-justify text-xs leading-relaxed text-muted-foreground">
                              {unit.items.map((item) => (
                                <li key={item} className="flex gap-2">
                                  <span className="shrink-0 text-foreground/40" aria-hidden>
                                    —
                                  </span>
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Contact + aside */}
        <section id="contact" className={cn("scroll-mt-16", section)}>
          <div className={container}>
            <div className="mx-auto w-full max-w-5xl">
              <h2 className="text-center text-xl font-semibold tracking-tight sm:text-2xl">Contact Us</h2>
              <p className="mx-auto mt-2 max-w-2xl text-center text-sm text-muted-foreground">
                Need to get in touch with us? Either fill out the form with your inquiry or find the department email
                you&apos;d like to contact below.
              </p>
              <form
                className="mt-6 space-y-4 rounded-2xl border border-border/60 bg-card/80 p-5 shadow-sm sm:p-7"
                onSubmit={(e) => {
                  e.preventDefault();
                  const data = new FormData(e.currentTarget);
                  const name = String(data.get("name") ?? "").trim();
                  const email = String(data.get("email") ?? "").trim();
                  const message = String(data.get("message") ?? "").trim();
                  const subject = encodeURIComponent("HYT Foundation Inquiry");
                  const body = encodeURIComponent([`Name: ${name || "-"}`, `Email: ${email || "-"}`, "", message].join("\n"));
                  window.location.href = `mailto:hello@brains.asia?subject=${subject}&body=${body}`;
                }}
              >
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="contact-name">Name *</Label>
                    <Input id="contact-name" name="name" placeholder="Your name" required className="h-10" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="contact-email">Email *</Label>
                    <Input id="contact-email" name="email" type="email" placeholder="you@example.com" required className="h-10" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="contact-message">Message *</Label>
                  <Textarea id="contact-message" name="message" placeholder="Write your message here..." rows={3} required className="min-h-[100px] resize-y" />
                </div>
                <Button type="submit" className="w-full bg-[#111827] text-white sm:w-auto">
                  SUBMIT
                </Button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/60 bg-[#0f121a] text-white">
        <div
          className={cn(
            container,
            "grid gap-10 py-10 sm:py-12 lg:grid-cols-[1fr_auto] lg:items-start lg:gap-14",
          )}
        >
          <div className="grid items-center gap-8 sm:grid-cols-2 sm:gap-10 lg:gap-12">
            <img
              src={hytFullLogo}
              alt="Helping Youth Transcend Foundation Inc."
              className="h-auto w-full object-contain sm:max-h-36 md:max-h-44 lg:max-h-48"
            />
            <p className="text-sm leading-relaxed text-white/80 sm:text-base md:text-lg md:leading-relaxed">
              We are the foundation for future generation leaders in which we support to enlighten and hone the youth in
              acquiring an adept set of business skills.
            </p>
          </div>
          <div className="text-sm sm:min-w-[220px] lg:text-base">
            <p className="mb-2 font-semibold uppercase tracking-wide text-white/50">Contact</p>
            <ul className="space-y-1.5 text-white/85">
              <li>Suite 1004 Atlanta Center, San Juan City</li>
              <li>(02) 835 90648 • (63) 961 495 8696</li>
              <li>
                <a href="mailto:hello@brains.asia" className="hover:text-white">
                  hello@brains.asia
                </a>
              </li>
            </ul>
            <p className="mb-2 mt-5 font-semibold uppercase tracking-wide text-white/50">Social media</p>
            <p className="text-xs text-white/45 sm:text-sm">powered by BRAINS INFINITE INNOVATIONS INC.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
