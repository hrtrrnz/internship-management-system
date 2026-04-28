import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import hytLogo from "@/assets/hyt-logo.png";
import landingBg from "../../image.png";

export default function Landing() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header
        className="text-white"
        style={{ background: "linear-gradient(rgb(40, 28, 21) 0%, rgb(26, 18, 15) 100%)" }}
      >
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-3">
            <img src={hytLogo} alt="HYT Foundation" width={40} height={40} />
            <div className="leading-tight">
              <p className="text-sm font-bold tracking-wide">HYT Foundation</p>
              <p className="text-xs tracking-wide text-white/70">Dream Academy Portal</p>
            </div>
          </Link>
          <div className="flex items-center gap-6">
            <nav className="hidden items-center gap-4 text-sm md:flex" aria-label="Quick links">
              <a href="#about" className="text-white/75 hover:text-white">
                About Us
              </a>
              <a href="#contact" className="text-white/75 hover:text-white">
                Contact
              </a>
            </nav>
            <Link to="/signin" className="text-sm font-medium text-white/85 hover:text-white">
              Sign in
            </Link>
          </div>
        </div>
      </header>

      <main
        className="relative flex-1 bg-cover bg-center"
        style={{ backgroundImage: `url(${landingBg})` }}
      >
        <div className="pointer-events-none absolute inset-0 bg-black/35" />
        <section className="relative w-full">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/25 via-black/40 to-black/55" />
          <div className="relative mx-auto max-w-5xl px-6 py-16 md:py-24">
            <div className="max-w-2xl">
              <p className="text-sm font-medium text-white/85">Helping Youth Transcend Foundation Inc.</p>
              <h1 className="mt-3 text-balance text-4xl font-semibold tracking-tight md:text-5xl">
                <span className="text-white">Building future-generation leaders</span>
              </h1>
              <p className="mt-4 text-pretty text-base text-white/85 md:text-lg">
                We are the foundation for future generation leaders in which we support to enlighten and hone the youth
                in acquiring an adept set of business skills, professionally mentoring young adults and directing them
                to pursue what they aspire to become.
              </p>

            <ul className="mt-8 space-y-3 text-sm text-white/85">
              <li className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-stat-blue" />
                Skill-building programs designed to develop practical, career-ready business skills.
              </li>
              <li className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-stat-orange" />
                Professional mentorship that strengthens confidence, character, and direction.
              </li>
              <li className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-stat-green" />
                Guided pathways that help young adults pursue what they aspire to become.
              </li>
            </ul>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Button asChild size="lg">
                <Link to="/signin" className="gap-2">
                  Enter portal <ArrowRight />
                </Link>
              </Button>
            </div>
          </div>
        </div>
        </section>

        <section className="relative w-full pb-16 md:pb-24">
          <div className="mx-auto max-w-5xl px-6 pt-0 md:pt-0">
            <div className="rounded-xl border border-white/20 bg-black/35 p-6 md:p-8 backdrop-blur-[2px]">
              <div className="space-y-8">
                <div id="about" className="w-full rounded-lg border border-white/20 bg-black/35 p-6">
                  <h2 className="text-xl font-semibold tracking-tight text-white">Our Values</h2>
                  <p className="mt-3 text-sm leading-6 text-white/85">
                    HYT Foundation exists to inspire and aid young entrepreneurs to attain their full potential. Our
                    purpose is to bring the next generation forward – establishing a future with a society of young
                    generation leaders.
                  </p>
                </div>

                <div id="contact" className="w-full rounded-lg border border-white/20 bg-black/35 p-6">
                  <h2 className="text-xl font-semibold tracking-tight text-white">Contact us</h2>
                  <p className="mt-3 text-sm leading-6 text-white/85">
                    Want to partner, volunteer, or learn more? Send us a message and we’ll get back to you.
                  </p>

                  <form
                    className="mt-6 space-y-4"
                    onSubmit={(e) => {
                      e.preventDefault();
                      const form = e.currentTarget;
                      const data = new FormData(form);
                      const name = String(data.get("name") ?? "").trim();
                      const email = String(data.get("email") ?? "").trim();
                      const message = String(data.get("message") ?? "").trim();

                      const subject = encodeURIComponent("Website contact form");
                      const body = encodeURIComponent(
                        [`Name: ${name || "-"}`, `Email: ${email || "-"}`, "", message].join("\n"),
                      );

                      window.location.href = `mailto:info@hytfoundation.org?subject=${subject}&body=${body}`;
                    }}
                  >
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="contact-name">Name</Label>
                        <Input
                          id="contact-name"
                          name="name"
                          autoComplete="name"
                          placeholder="Your name"
                        className="border-white/20 bg-white/90"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contact-email">Email</Label>
                        <Input
                          id="contact-email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          placeholder="you@example.com"
                          required
                        className="border-white/20 bg-white/90"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contact-message">Message</Label>
                      <Textarea
                        id="contact-message"
                        name="message"
                        placeholder="How can we help?"
                        rows={5}
                        required
                      className="border-white/20 bg-white/90"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <Button type="submit">Send message</Button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer
        className="border-t border-border/20 text-white/80"
        style={{ background: "linear-gradient(rgb(40, 28, 21) 0%, rgb(26, 18, 15) 100%)" }}
      >
        <div className="mx-auto flex max-w-5xl flex-col gap-4 px-6 py-8 text-sm md:flex-row md:items-start md:justify-between">
          <p>© {new Date().getFullYear()} Helping Youth Transcend Foundation Inc.</p>
          <div className="space-y-1 md:text-right">
            <p>Suite 1004 Atlanta Center, Annapolis St., San Juan City, Metro Manila, Philippines</p>
            <p>(02) 835 90648 • (63) 961 495 8696 • (63) 905 102 4246</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

