import { Link } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import hytLogo from "@/assets/hyt-logo.png";
import landingBg from "../../image.png";
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
import { cn } from "@/lib/utils";
import { portalButtonClass } from "@/lib/portalTheme";

const topCards = [
  {
    title: "About us",
    text: "HYT Foundation exists to inspire and aid young entrepreneurs to attain their full potential. Our purpose is to bring the next generation forward - establishing a future with a society of young generation leaders.",
    accent: "border-l-[#f26e4b]",
  },
  {
    title: "Our Vision",
    text: "Establish a competent society of young professional leaders and entrepreneurs through honing their vocational aptitude with the means of advanced technology, innovating creations to serve the world.",
    accent: "border-l-[#21b7c8]",
  },
  {
    title: "Our Mission",
    text: "Guiding young and aspiring generation leaders by professionally mentoring them, developing a social responsibility and empowering them to pass it forward to future generations while growing internationally.",
    accent: "border-l-[#c8c52a]",
  },
];

const valueGridImages = [img1, img2, img3, img4, img5, img6];

const unitColumns = [
  {
    title: "Creative Unit",
    stripe: "bg-[#f26e4b]",
    gradient: "from-[#f26e4b]/45 via-background/10 to-background/90",
    description: "Design-driven projects that shape HYT’s visual identity across campaigns, brand assets, and content.",
    items: ["Logo", "Animation", "Brand sheet", "Social media posts", "Portfolio", "Pitch deck design"],
  },
  {
    title: "Human Resources Unit",
    stripe: "bg-[#2bb2c8]",
    gradient: "from-[#2bb2c8]/45 via-background/10 to-background/90",
    description: "People operations work focused on recruiting, systems improvement, engagement, and learning support.",
    items: ["Recruitment", "HRMS research and development", "Employee engagement", "Assist in L&D unit"],
  },
  {
    title: "Sales & Marketing Unit",
    stripe: "bg-[#c7ca2f]",
    gradient: "from-[#c7ca2f]/45 via-background/10 to-background/90",
    description: "Customer-focused initiatives covering lead generation, partnerships, marketing strategy, and community growth.",
    items: ["Lead Generation", "Marketing Plan", "Partnership", "Pitch deck", "Community management"],
  },
  {
    title: "Engineering Unit",
    stripe: "bg-[#d85f75]",
    gradient: "from-[#d85f75]/45 via-background/10 to-background/90",
    description: "Process and production analysis with research work, planning, and improvements tied to real operations.",
    items: ["Time and Motion Study", "Cost Benefit Analysis", "Production Planning", "Research and IIOT"],
  },
  {
    title: "Technology Unit",
    stripe: "bg-[#2baec0]",
    gradient: "from-[#2baec0]/45 via-background/10 to-background/90",
    description: "Build and ship software solutions—web/mobile design, frontend/backend development, and applied R&D.",
    items: ["Front-end / Back-end", "Web and mobile design", "Programming", "Research and Development"],
  },
  {
    title: "Accounting Unit",
    stripe: "bg-[#f37a53]",
    gradient: "from-[#f37a53]/45 via-background/10 to-background/90",
    description: "Support finance workflows through administrative work, research, and accounting information systems initiatives.",
    items: ["AIS research", "Administrative", "R&D of KGC"],
  },
  {
    title: "Legal & Justice Unit",
    stripe: "bg-[#d76589]",
    gradient: "from-[#d76589]/45 via-background/10 to-background/90",
    description: "Legal support tasks involving research, document drafting, transcription, and contract review assistance.",
    items: ["Legal Research", "Draft legal documents", "Transcription of meetings", "Review contracts"],
  },
  {
    title: "Learning & Development Unit",
    stripe: "bg-[#d3c737]",
    gradient: "from-[#d3c737]/45 via-background/10 to-background/90",
    description: "Programs and enablement efforts—planning, organizational development support, and knowledge-building initiatives.",
    items: ["Lead Generation", "Strategic Plan", "Organizational Development", "Managerial delegations"],
  },
];

const creativeUnitRef = unitColumns.find((u) => u.title === "Creative Unit") ?? unitColumns[0];

const section = "py-8 sm:py-10";
const container = "mx-auto max-w-6xl px-4 sm:px-6";

export default function Landing() {
  const [flippedUnits, setFlippedUnits] = useState<Record<string, boolean>>({});

  return (
    <div id="top" className="flex min-h-screen flex-col bg-background text-foreground antialiased">
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2.5 sm:px-6">
          <Link to="/" className="flex min-w-0 items-center gap-2.5">
            <img src={hytLogo} alt="HYT Foundation" width={40} height={40} className="shrink-0" />
            <div className="min-w-0 leading-tight">
              <p className="truncate text-[10px] font-semibold tracking-wide text-muted-foreground sm:text-[11px]">
                HELPING YOUTH TRANSCEND
              </p>
              <p className="text-[9px] font-medium tracking-wide text-muted-foreground/80 sm:text-[10px]">FOUNDATION INC.</p>
            </div>
          </Link>
          <nav className="hidden items-center gap-5 text-sm text-muted-foreground md:flex">
            <a href="#top" className="transition-colors hover:text-foreground">
              Home
            </a>
            <a href="#about" className="transition-colors hover:text-foreground">
              About Us
            </a>
            <a href="#join" className="transition-colors hover:text-foreground">
              Why Join Us?
            </a>
            <a href="#dream-academy" className="transition-colors hover:text-foreground">
              Dream Academy
            </a>
            <a href="#units" className="transition-colors hover:text-foreground">
              Units
            </a>
            <a href="#contact" className="transition-colors hover:text-foreground">
              Contact Us
            </a>
          </nav>
          <div className="flex shrink-0 items-center gap-2.5 sm:gap-4">
            <span className="cursor-default text-[10px] text-muted-foreground sm:text-sm">Donate</span>
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

      {/* Hero — shorter viewport */}
      <section className="relative border-b border-border/50">
        <div className="absolute inset-0">
          <img src={landingBg} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-background via-background/80 to-muted/40" />
        </div>
        <div className={`relative ${container} flex min-h-[36vh] flex-col justify-center py-10 text-center sm:min-h-[40vh] sm:py-12`}>
          <h1
            className="text-3xl font-extrabold uppercase leading-[1.1] tracking-tight sm:text-4xl md:text-5xl"
            style={{ fontFamily: '"Happy Monkey", system-ui' }}
          >
            <span className="block text-[#ff4a2f]">Bringing the</span>
            <span className="block text-[#00d2ff]">Next Generation</span>
            <span className="block text-[#d6e63a]">Forward</span>
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-muted-foreground sm:mt-5 sm:text-[15px]">
            We are the foundation for future generation leaders in which we support to enlighten and hone the youth in
            acquiring an adept set of business skills, professionally mentoring young adults and directing them to pursue what
            they aspire to become.
          </p>
          <div className="mt-6 flex justify-center">
            <Button asChild size="default" className="rounded-full px-8 font-medium">
              <a href="#about">ABOUT US</a>
            </Button>
          </div>
        </div>
      </section>

      <main className="flex-1">
        {/* Foundation */}
        <section id="about" className={cn("scroll-mt-16 border-b border-border/40 bg-muted/25", section)}>
          <div className={container}>
            <div className="flex flex-col gap-1 text-center sm:text-left">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Foundation</p>
              <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">Who we are</h2>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-3 sm:gap-4">
              {topCards.map((card) => (
                <article
                  key={card.title}
                  className={cn(
                    "rounded-2xl border border-border/60 bg-card/80 p-4 shadow-sm backdrop-blur-sm sm:p-5",
                    card.accent,
                    "border-l-4",
                  )}
                >
                  <h3 className="text-sm font-semibold sm:text-base">{card.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-[13px]">{card.text}</p>
                </article>
              ))}
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
            <div className="overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-card to-muted/30 shadow-sm">
              <div className="border-b border-border/40 bg-muted/40 px-5 py-4 sm:px-8">
                <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">Dream Academy</h2>
              </div>
              <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[1fr_200px] lg:gap-8">
                <div className="space-y-6 text-sm leading-relaxed text-muted-foreground">
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
                <div className="overflow-hidden rounded-xl border border-border/60 lg:self-start">
                  <img
                    src={train1}
                    alt="Training Program and Objectives"
                    className="aspect-[3/4] max-h-[200px] w-full object-cover sm:max-h-[220px] lg:max-h-[200px]"
                  />
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
                return (
                  <button
                    key={unit.title}
                    type="button"
                    onClick={() => setFlippedUnits((prev) => ({ ...prev, [unit.title]: !prev[unit.title] }))}
                    className="text-left [perspective:1200px]"
                    aria-label={`${unit.title} — ${isFlipped ? "Show unit list" : "Show description"}`}
                  >
                    <div
                      className={cn(
                        "relative w-full rounded-xl border border-border/60 shadow-sm transition-transform duration-500 [transform-style:preserve-3d]",
                        isFlipped ? "[transform:rotateY(180deg)]" : "[transform:rotateY(0deg)]"
                      )}
                    >
                      {/* Height sizer (keeps uniform height based on longest side) */}
                      <div className="grid opacity-0 pointer-events-none">
                        <div className="col-start-1 row-start-1 overflow-hidden rounded-xl bg-card">
                          <div className={cn("h-1 w-full shrink-0", creativeUnitRef.stripe)} aria-hidden />
                          <div className="flex flex-col p-4">
                            <h3 className="text-sm font-semibold leading-snug text-foreground">{creativeUnitRef.title}</h3>
                            <div className="mt-4">
                              <ul className="flex flex-col gap-1.5 text-xs leading-snug text-muted-foreground">
                                {creativeUnitRef.items.map((item) => (
                                  <li key={item} className="flex gap-2">
                                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-foreground/20" aria-hidden />
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div className="mt-3 flex items-center justify-end">
                              <span className="h-4 w-10" />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Front */}
                      <div className="absolute inset-0 overflow-hidden rounded-xl bg-card [backface-visibility:hidden]">
                        <div className={cn("h-1 w-full shrink-0", unit.stripe)} aria-hidden />
                        <div className="relative flex h-full min-h-0 flex-col p-4">
                          <div className={cn("pointer-events-none absolute inset-0 bg-gradient-to-br", unit.gradient)} aria-hidden />
                          <div className="relative">
                            <h3 className="text-sm font-semibold leading-snug text-foreground">{unit.title}</h3>
                          </div>
                          <div className="relative mt-4 flex-1 min-h-0">
                            <ul className="flex flex-col gap-1.5 text-xs leading-snug text-muted-foreground">
                              {unit.items.map((item) => (
                                <li key={item} className="flex gap-2">
                                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-foreground/20" aria-hidden />
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="mt-3 flex items-center justify-end text-muted-foreground">
                            <svg
                              width="40"
                              height="14"
                              viewBox="0 0 40 14"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              aria-hidden="true"
                            >
                              <path d="M1 7H33" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                              <path d="M33 2L39 7L33 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </div>
                        </div>
                      </div>

                      {/* Back */}
                      <div className="absolute inset-0 overflow-hidden rounded-xl bg-card [transform:rotateY(180deg)] [backface-visibility:hidden]">
                        <div className={cn("h-1 w-full shrink-0", unit.stripe)} aria-hidden />
                        <div className="flex h-full min-h-0 flex-col p-4">
                          <h3 className="text-sm font-semibold leading-snug text-foreground">{unit.title}</h3>
                          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{unit.description}</p>
                          <div className="mt-4 flex-1 min-h-0 overflow-y-auto rounded-lg border border-border/60 bg-muted/20 p-3">
                            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                              What you’ll work on
                            </p>
                            <ul className="mt-2 grid grid-cols-1 gap-1.5 text-xs text-muted-foreground">
                              {unit.items.map((item) => (
                                <li key={item} className="flex gap-2">
                                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-foreground/20" aria-hidden />
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
            <div className="mx-auto max-w-lg">
              <h2 className="text-center text-xl font-semibold tracking-tight sm:text-2xl">Contact Us</h2>
              <p className="mt-2 text-center text-sm text-muted-foreground">
                Need to get in touch with us? Either fill out the form with your inquiry or find the department email
                you&apos;d like to contact below.
              </p>
              <form
                className="mt-5 space-y-3 rounded-2xl border border-border/60 bg-card/80 p-4 shadow-sm sm:p-5"
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
        <div className={cn(container, "flex flex-col gap-6 py-8 sm:flex-row sm:items-center sm:justify-between sm:py-10")}>
          <div className="flex items-center gap-3">
            <img src={hytLogo} alt="HYT logo" className="h-12 w-12 sm:h-14 sm:w-14" />
            <div>
              <p className="text-xs font-semibold text-[#ff6f3b]">HELPING YOUTH</p>
              <p className="text-xs font-semibold text-[#20d2ff] sm:text-sm">TRANSCEND FOUNDATION INC.</p>
            </div>
          </div>
          <p className="max-w-sm text-xs leading-relaxed text-white/75">
            We are the foundation for future generation leaders in which we support to enlighten and hone the youth in
            acquiring an adept set of business skills.
          </p>
          <div className="flex flex-wrap gap-x-8 gap-y-2 text-xs sm:text-sm">
            <div>
              <p className="mb-1.5 font-semibold uppercase tracking-wide text-white/50">Quick links</p>
              <ul className="space-y-1 text-white/90">
                <li>
                  <a href="#top" className="hover:text-white">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#about" className="hover:text-white">
                    About us
                  </a>
                </li>
                <li>
                  <a href="#join" className="hover:text-white">
                    Why join us?
                  </a>
                </li>
                <li>
                  <a href="#dream-academy" className="hover:text-white">
                    Dream Academy
                  </a>
                </li>
                <li>
                  <a href="#units" className="hover:text-white">
                    Units
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <p className="mb-1.5 font-semibold uppercase tracking-wide text-white/50">Contact</p>
              <ul className="space-y-1 text-[11px] text-white/80 sm:text-xs">
                <li>Suite 1004 Atlanta Center, San Juan City</li>
                <li>(02) 835 90648 • (63) 961 495 8696</li>
                <li>
                  <a href="mailto:hello@brains.asia" className="hover:text-white">
                    hello@brains.asia
                  </a>
                </li>
              </ul>
              <p className="mb-1.5 mt-3 font-semibold uppercase tracking-wide text-white/50">Social media</p>
              <p className="text-[11px] text-white/45">powered by BRAINS INFINITE INNOVATIONS INC.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
