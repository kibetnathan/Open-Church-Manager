import React from "react";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import useAuthStore from "../zustand/authStore";

function Home() {
  const user = useAuthStore((state) => state.user);

  return (
    <>
      <main id="main-content">
        {/* ── Hero ── */}
        <header
          className="relative min-h-screen w-full flex items-center"
          style={{
            backgroundImage: "url(images/mavuno_entrance.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-black/55 backdrop-blur-[2px]" />

          <div className="relative z-10 w-full px-6 sm:px-10 lg:px-16 py-20">
            <div className="max-w-2xl bg-black/30 backdrop-blur-sm shadow-[0px_0px_40px_rgba(0,0,0,0.6)] p-8 sm:p-12">
              <span className="text-xs text-amber-500 font-coptic tracking-[0.25em] uppercase">
                — Powered by Mavuno Church
              </span>
              <h1 className="mt-4 mb-6 text-4xl sm:text-5xl lg:text-[3.5rem] font-cormorant font-light text-[#fffffc] leading-tight">
                This is{" "}
                <span className="text-amber-500 italic font-bold">
                  Open Church Management
                </span>
              </h1>
              <p className="mb-8 text-base sm:text-lg text-[#fffffc] font-coptic leading-relaxed">
                A free, open-source platform built for Mavuno Church —
                connecting members, leadership, and fellowship groups in one
                place.
              </p>
              <Link
                to={user ? "/feed" : "/auth/login"}
                className="inline-block bg-amber-500 hover:bg-amber-600 text-[#000000] font-coptic text-xs uppercase tracking-[0.2em] px-8 py-4 transition-colors rounded-md"
              >
                Get Started
              </Link>
            </div>
          </div>
        </header>

        {/* ── About strip ── */}
        <section
          id="about"
          aria-labelledby="about-heading"
          className="bg-ivory border-b border-divider px-6 sm:px-10 lg:px-16 py-16 sm:py-20"
        >
          <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-10 lg:gap-20 items-start">
            <div className="lg:w-1/2">
              <p className="text-sm uppercase tracking-[0.22em] text-secondary mb-3 font-coptic">
                About the Platform
              </p>
              <h2
                id="about-heading"
                className="font-cormorant text-4xl sm:text-5xl font-light text-strong leading-tight"
              >
                Built for Mavuno.
                <br />
                <span className="text-amber-600 italic">
                  Free for any church.
                </span>
              </h2>
              <div className="w-8 h-0.5 bg-amber-500 mt-5" aria-hidden="true" />
            </div>
            <p className="lg:w-1/2 text-primary font-coptic text-base sm:text-lg leading-relaxed pt-2">
              OCM was designed around how Mavuno Church actually operates — with
              fellowship groups, serving departments, discipleship courses, and
              a leadership structure that values both accountability and
              flexibility. It's open source so any Baptist or low-church
              congregation can adapt it to their own needs without paying for
              enterprise software.
            </p>
          </div>
        </section>

        {/* ── Stats ── */}
        <section
          aria-label="Platform highlights"
          className="bg-amber-500 m-10 rounded-md px-6 sm:px-10 lg:px-16 py-12"
        >
          <ul
            role="list"
            className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8"
          >
            {[
              { value: "Relevant", label: "Features" },
              { value: "5+", label: "Grouping models" },
              { value: "100%", label: "Open Source" },
              { value: "1", label: "Church, Many Members" },
            ].map(({ value, label }) => (
              <li
                key={label}
                className="flex flex-col items-center text-center"
              >
                <p className="font-cormorant text-4xl sm:text-5xl font-light text-black">
                  {value}
                </p>
                <p className="font-coptic text-sm uppercase tracking-widest text-black/85 mt-1">
                  {label}
                </p>
              </li>
            ))}
          </ul>
        </section>

        {/* ── Features ── */}
        <section
          aria-labelledby="features-heading"
          className="bg-ivory px-6 sm:px-10 lg:px-16 py-20 sm:py-28"
        >
          <div className="max-w-6xl mx-auto">
            <div className="mb-12">
              <p className="text-sm uppercase tracking-[0.22em] text-secondary mb-2 font-coptic">
                What's Inside
              </p>
              <h2
                id="features-heading"
                className="font-cormorant text-4xl sm:text-5xl font-light text-strong"
              >
                Platform Features
              </h2>
              <div className="w-8 h-0.5 bg-amber-500 mt-4" aria-hidden="true" />
            </div>

            <ul
              role="list"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {[
                {
                  number: "01",
                  title: "Fellowship Groups",
                  body: "Members are organised into fellowship groups — Young Adults, Women of Grace, Men's Brotherhood, and more. Leaders manage membership and group activities from the dashboard.",
                },
                {
                  number: "02",
                  title: "Serving Departments",
                  body: "Track which members serve in worship, hospitality, media, or ushering. Assign crew to services and manage equipment from one place.",
                },
                {
                  number: "03",
                  title: "Discipleship Courses",
                  body: "Run structured courses within the church — track enrolment, progress, and completion across different cohorts of members.",
                },
                {
                  number: "04",
                  title: "Role-Based Access",
                  body: "Pastors, Jr Leaders, Elders, and Staff get full dashboard access. Regular members see the feed and their own groups — no more data leaks.",
                },
                {
                  number: "05",
                  title: "Community Feed",
                  body: "A shared feed for posts, announcements, and updates. Members can like and comment; leadership can broadcast to the whole church.",
                },
                {
                  number: "06",
                  title: "Group Messaging",
                  body: "Real-time group chats tied to each fellowship group — so Young Adults can coordinate Friday Bible study without leaving the platform.",
                },
              ].map(({ number, title, body }) => (
                <li key={number}>
                  <article className="h-full bg-ivory border border-divider p-6 hover:border-amber-400 hover:shadow-md transition-all group">
                    <p
                      className="font-cormorant text-3xl font-light text-amber-600/70 mb-4 group-hover:text-amber-600 transition-colors"
                      aria-hidden="true"
                    >
                      {number}
                    </p>
                    <h3 className="font-cormorant text-2xl font-semibold text-strong mb-2">
                      {title}
                    </h3>
                    <p className="font-coptic text-base text-primary leading-relaxed">
                      {body}
                    </p>
                  </article>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── How it works ── */}
        <section
          aria-labelledby="roles-heading"
          className="bg-panel px-6 sm:px-10 lg:px-16 py-20 sm:py-28 border-y border-divider"
        >
          <div className="max-w-6xl mx-auto">
            <div className="mb-12">
              <p className="text-sm uppercase tracking-[0.22em] text-secondary mb-2 font-coptic">
                How It Works
              </p>
              <h2
                id="roles-heading"
                className="font-cormorant text-4xl sm:text-5xl font-light text-strong"
              >
                For Every Role
              </h2>
              <div className="w-8 h-0.5 bg-amber-500 mt-4" aria-hidden="true" />
            </div>

            <ul role="list" className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  role: "Member",
                  color: "border-gray-300",
                  accent: "text-strong",
                  points: [
                    "View and react to the community feed",
                    "See your fellowship group and courses",
                    "Chat in your group's messaging channel",
                    "Edit your profile and profile picture",
                  ],
                },
                {
                  role: "Leader / Elder",
                  color: "border-amber-500",
                  accent: "text-amber-700",
                  points: [
                    "Everything a Member can do",
                    "Manage fellowship groups and members",
                    "Run and enrol members in courses",
                    "Assign serving roles and departments",
                  ],
                },
                {
                  role: "Pastor / Staff",
                  color: "border-black",
                  accent: "text-strong",
                  points: [
                    "Full dashboard access",
                    "Manage all users and leadership roles",
                    "Oversee services and equipment",
                    "View church-wide analytics and data",
                  ],
                },
              ].map(({ role, color, accent, points }) => (
                <li key={role}>
                  <article
                    className={`h-full bg-ivory border-t-4 ${color} p-6 shadow-sm`}
                    aria-labelledby={`role-${role.replace(/\W+/g, "-")}`}
                  >
                    <h3
                      id={`role-${role.replace(/\W+/g, "-")}`}
                      className={`font-cormorant text-2xl font-semibold ${accent} mb-4`}
                    >
                      {role}
                    </h3>
                    <ul className="flex flex-col gap-2.5">
                      {points.map((p) => (
                        <li key={p} className="flex items-start gap-2.5">
                          <span
                            className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 shrink-0"
                            aria-hidden="true"
                          />
                          <span className="font-coptic text-base text-primary leading-relaxed">
                            {p}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </article>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── CTA ── */}
        <section
          aria-labelledby="cta-heading"
          className="bg-amber-500 m-10 rounded-md px-6 sm:px-10 lg:px-24 py-16 sm:py-20"
        >
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-8">
            <div>
              <h2
                id="cta-heading"
                className="font-cormorant text-3xl sm:text-4xl font-semibold text-black leading-tight"
              >
                Ready to get started?
              </h2>
              <p className="font-coptic text-base text-black/85 mt-2 tracking-wide">
                Join Mavuno Church's platform or fork it for your own
                congregation.
              </p>
            </div>
            <Link
              to={user ? "/feed" : "/auth/login"}
              className="shrink-0 bg-black hover:bg-stone-800 text-white font-coptic text-sm uppercase tracking-[0.18em] px-8 py-4 transition-colors"
            >
              {user ? "Go to Feed" : "Sign In"}
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default Home;
