import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import useAuthStore from "../zustand/authStore";
import useMainStore from "../zustand/mainStore";
import { useNavigate } from "react-router-dom";

const LEADER_ROLES = ["Pastor", "Jr Leader", "Leader", "Staff"];

// NavLink passes { isActive } into this function automatically - it knows if the current url matches the link
const navLinkClass = ({ isActive }) =>
  `flex items-center gap-3 px-4 py-2.5 text-sm tracking-widest uppercase transition-all duration-200 border-l-2 ${
    isActive
      ? "bg-amber-50 text-amber-700 border-amber-500"
      : "text-strong hover:bg-amber-50 hover:text-black border-transparent"
  }`;

const subLinkClass = ({ isActive }) =>
  `flex items-center gap-2.5 pl-9 pr-4 py-2 text-sm tracking-widest uppercase transition-all duration-150 border-l-2 ${
    isActive
      ? "text-amber-700 border-amber-500 bg-amber-50"
      : "text-primary hover:text-black border-transparent hover:bg-amber-50"
  }`;

const SectionLabel = ({ children, id }) => (
  <li
    id={id}
    role="presentation"
    className="px-4 pt-6 pb-1 text-xs uppercase tracking-[0.22em] text-primary font-semibold"
  >
    {children}
  </li>
);

const ChevronIcon = ({ open }) => (
  <svg
    aria-hidden="true"
    focusable="false"
    className={`w-3 h-3 ml-auto transition-transform duration-200 ${open ? "rotate-180" : ""}`}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);

function ExpandableSection({ icon, label, children, defaultOpen = false }) {
  // useState returns [currentValue, setterFunction] - defaultOpen sets what it starts as
  const [open, setOpen] = useState(defaultOpen);
  const panelId = `sidebar-section-${label.replace(/\W+/g, "-").toLowerCase()}`;
  return (
    <li>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
        className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm tracking-widest uppercase transition-all duration-200 border-l-2 border-transparent ${
          open
            ? "text-strong bg-amber-50"
            : "text-strong hover:bg-amber-50 hover:text-black"
        }`}
      >
        {icon}
        {label}
        <ChevronIcon open={open} />
      </button>
      {open && (
        <ul
          id={panelId}
          className="flex flex-col mt-0.5 border-l border-divider ml-4"
        >
          {children}
        </ul>
      )}
    </li>
  );
}

function Sidebar() {
  // zustand - you pass a selector function to pick just the piece of state you need from the store
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  const [activeTray, setActiveTray] = useState(null);

  const handleLogout = () => {
    logout();
    navigate("/auth/login");
  };
  const user = useAuthStore((state) => state.user);
  // ?. is optional chaining - if fellowships is null/undefined this wont throw, just returns undefined
  const fellowships = useMainStore((state) => state.fellowships?.results) || [];

  const userGroups = user?.groups || [];
  // .some() checks if at least one item in the array passes the condition
  const isLeader = userGroups.some((g) => LEADER_ROLES.includes(g));
  const myFellowships = fellowships.filter((g) =>
    g.members?.includes(user?.id),
  );
  // "sticky top-0 hidden md:flex flex-col w-95 h-screen bg-porcelain border-r border-divider"
  return (
    <>
      <aside
        aria-label="Primary"
        className={`sticky top-0 hidden ${user && "md:flex"} flex-col w-95 h-screen bg-porcelain border-r border-divider`}
      >
        <div className="flex items-center justify-between px-6 h-16 border-b border-divider shrink-0">
          <NavLink
            to="/"
            aria-label="Open Church Management — home"
            className="font-cormorant text-2xl font-semibold tracking-[0.15em] text-strong hover:text-amber-700 transition-colors"
          >
            O<span className="text-amber-600">C</span>M
          </NavLink>
          <span
            className="w-1.5 h-1.5 rounded-full bg-amber-500"
            aria-hidden="true"
          />
        </div>

        <nav aria-label="Sidebar" className="flex-1 px-3 py-4 overflow-y-auto">
          <ul className="flex flex-col gap-0.5">
            <li>
              <NavLink to="/feed" className={navLinkClass}>
                <svg
                  className="w-3.5 h-3.5 shrink-0"
                  fill="none"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 7.5h1.5m-1.5 3h1.5m-4.5 5.25h4.5m-4.5-2.25h4.5M4.5 3h15a1.5 1.5 0 0 1 1.5 1.5v15a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 19.5v-15A1.5 1.5 0 0 1 4.5 3Z"
                  />
                </svg>
                Feed
              </NavLink>
            </li>

            <SectionLabel>Outreach</SectionLabel>
            <li>
              <NavLink to="/outreach/charity" className={navLinkClass}>
                <svg
                  className="w-3.5 h-3.5 shrink-0"
                  fill="none"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                  />
                </svg>
                Charity
              </NavLink>
            </li>

            {isLeader && (
              <>
                <SectionLabel>Dashboard</SectionLabel>

                <li>
                  <NavLink to="/dashboard" end className={navLinkClass}>
                    <svg
                      className="w-3.5 h-3.5 shrink-0"
                      fill="none"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21"
                      />
                    </svg>
                    Overview
                  </NavLink>
                </li>

                <ExpandableSection
                  defaultOpen
                  label="Groups"
                  icon={
                    <svg
                      className="w-3.5 h-3.5 shrink-0"
                      fill="none"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
                      />
                    </svg>
                  }
                >
                  <li>
                    <NavLink
                      to="/dashboard/groups/fellowship"
                      className={subLinkClass}
                    >
                      Fellowship Groups
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/dashboard/groups/courses"
                      className={subLinkClass}
                    >
                      Courses
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/dashboard/groups/departments"
                      className={subLinkClass}
                    >
                      Serving Departments
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/dashboard/groups/services"
                      className={subLinkClass}
                    >
                      Services & Equipment
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/dashboard/outreach/charity"
                      className={subLinkClass}
                    >
                      Charity Organisations
                    </NavLink>
                  </li>
                </ExpandableSection>

                <ExpandableSection
                  label="Manage Users"
                  icon={
                    <svg
                      className="w-3.5 h-3.5 shrink-0"
                      fill="none"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Z"
                      />
                    </svg>
                  }
                >
                  <li>
                    <NavLink to="/dashboard/users/all" className={subLinkClass}>
                      All Members
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/dashboard/users/leadership"
                      className={subLinkClass}
                    >
                      Leadership
                    </NavLink>
                  </li>
                </ExpandableSection>
                <li>
                  <NavLink
                    to="/dashboard/streaming"
                    end
                    className={navLinkClass}
                  >
                    <svg
                      className="w-3.5 h-3.5 shrink-0"
                      fill="none"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.75 5.25a2 2 0 0 1 2-2h12.5a2 2 0 0 1 2 2v10.5a2 2 0 0 1-2 2H5.75a2 2 0 0 1-2-2V5.25Z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9.75 8.25l4.5 2.75-4.5 2.75V8.25Z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8.5 19.5h7"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 17.75v1.75"
                      />
                    </svg>
                    Streaming
                  </NavLink>
                </li>
              </>
            )}

            <SectionLabel>Messaging</SectionLabel>
            <li>
              <NavLink to="/threads" className={navLinkClass}>
                <svg
                  className="w-3.5 h-3.5 shrink-0"
                  fill="none"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 7.5h1.5m-1.5 3h1.5m-4.5 5.25h4.5m-4.5-2.25h4.5M4.5 3h15a1.5 1.5 0 0 1 1.5 1.5v15a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 19.5v-15A1.5 1.5 0 0 1 4.5 3Z"
                  />
                </svg>
                Messages
              </NavLink>
            </li>

            <SectionLabel>Scripture</SectionLabel>

            <li>
              <NavLink to="/bible" className={navLinkClass}>
                <svg
                  className="w-3.5 h-3.5 shrink-0"
                  fill="none"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 3.75h9a3 3 0 0 1 3 3v13.5a.75.75 0 0 1-1.125.65L14 19.5l-2.875 1.4A.75.75 0 0 1 10 20.25V6.75a3 3 0 0 0-3-3Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10 6.75A3 3 0 0 0 7 3.75H6"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 10.5h3m-3 3h3"
                  />
                </svg>
                bible
              </NavLink>
            </li>
            <ExpandableSection
              defaultOpen
              label="Plans"
              icon={
                <svg
                  className="w-3.5 h-3.5 shrink-0"
                  fill="none"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
                  />
                </svg>
              }
            >
              <li>
                <NavLink to="/plans/reading" className={subLinkClass}>
                  Reading Plans
                </NavLink>
              </li>
              <li>
                <NavLink to="/plans/verses" className={subLinkClass}>
                  Memory Verses
                </NavLink>
              </li>
            </ExpandableSection>
            <SectionLabel>Streaming</SectionLabel>
            <NavLink to="/streaming" className={navLinkClass}>
              <svg
                className="w-3.5 h-3.5 shrink-0"
                fill="none"
                strokeWidth="1.5"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 5.25a2 2 0 0 1 2-2h12.5a2 2 0 0 1 2 2v10.5a2 2 0 0 1-2 2H5.75a2 2 0 0 1-2-2V5.25Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.75 8.25l4.5 2.75-4.5 2.75V8.25Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.5 19.5h7"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 17.75v1.75"
                />
              </svg>
              stream service
            </NavLink>
          </ul>
        </nav>

        <NavLink to="/profile" className={navLinkClass}>
          <svg
            className="w-3.5 h-3.5 shrink-0"
            fill="none"
            strokeWidth="1.5"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
            />
          </svg>
          Profile
        </NavLink>

        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-2.5 text-left font-coptic text-sm uppercase tracking-widest text-primary hover:text-red-600 hover:bg-red-50 transition-colors group"
        >
          <svg
            className="w-4 h-4 shrink-0 group-hover:translate-x-0.5 transition-transform"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
            />
          </svg>
          Sign Out
        </button>
        <div className="px-5 py-4 border-t border-divider shrink-0">
          <p className="text-xs tracking-widest uppercase text-amber-700">
            Powered by Mavuno Church
          </p>
        </div>
      </aside>
      <div
        className="fixed flex md:hidden bottom-3 left-0 right-0 px-3 z-50"
        role="region"
        aria-label="Mobile navigation"
      >
        {activeTray && (
          <div className="absolute bottom-18 left-3 right-3 bg-porcelain backdrop-blur-md border border-divider rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.15)] overflow-hidden">
            {activeTray === "dashboard" && (
              <ul className="flex flex-col py-2">
                <li className="px-4 pt-2 pb-1 text-[0.65rem] uppercase tracking-[0.22em] text-primary font-semibold">
                  Dashboard
                </li>
                {[
                  { to: "/dashboard", label: "Overview", end: true },
                  {
                    to: "/dashboard/groups/fellowship",
                    label: "Fellowship Groups",
                  },
                  { to: "/dashboard/groups/courses", label: "Courses" },
                  {
                    to: "/dashboard/groups/departments",
                    label: "Serving Departments",
                  },
                  {
                    to: "/dashboard/groups/services",
                    label: "Services & Equipment",
                  },
                  { to: "/dashboard/users/all", label: "All Members" },
                  { to: "/dashboard/users/leadership", label: "Leadership" },
                  { to: "/dashboard/streaming", label: "Streaming Dashboard" },
                  {
                    to: "/dashboard/outreach/charity",
                    label: "Charity Organisations",
                  },
                ].map(({ to, label, end }) => (
                  <li key={to}>
                    <NavLink
                      to={to}
                      end={end}
                      onClick={() => setActiveTray(null)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-5 py-3 text-xs uppercase tracking-widest transition-colors ${
                          isActive
                            ? "text-amber-700 bg-amber-50"
                            : "text-strong hover:text-black hover:bg-amber-50"
                        }`
                      }
                    >
                      {label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            )}
            {activeTray === "scripture" && (
              <ul className="flex flex-col py-2">
                <li className="px-4 pt-2 pb-1 text-[0.65rem] uppercase tracking-[0.22em] text-primary font-semibold">
                  Scripture
                </li>
                {[
                  {
                    to: "/bible",
                    label: "Bible",
                    icon: (
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 3.75h9a3 3 0 0 1 3 3v13.5a.75.75 0 0 1-1.125.65L14 19.5l-2.875 1.4A.75.75 0 0 1 10 20.25V6.75a3 3 0 0 0-3-3Z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M10 6.75A3 3 0 0 0 7 3.75H6"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 10.5h3m-3 3h3"
                        />
                      </svg>
                    ),
                  },
                  {
                    to: "/plans",
                    label: "Plans",
                    icon: (
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 3.75h11a2 2 0 0 1 2 2v12.5a.75.75 0 0 1-1.125.65L15 19l-2.875 1.4A.75.75 0 0 1 11 20.25V5.75a2 2 0 0 0-2-2Z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M8 8.5h6M8 11h6M8 13.5h4"
                        />
                      </svg>
                    ),
                  },
                ].map(({ to, label, icon }) => (
                  <li key={to}>
                    <NavLink
                      to={to}
                      onClick={() => setActiveTray(null)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-5 py-3 text-[0.65rem] uppercase tracking-widest transition-colors ${
                          isActive
                            ? "text-amber-600 bg-amber-50"
                            : "text-primary hover:text-black hover:bg-amber-50"
                        }`
                      }
                    >
                      {icon}
                      {label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        <nav
          aria-label="Mobile primary"
          className="w-full h-16 rounded-2xl bg-porcelain backdrop-blur-md border border-divider shadow-[0_8px_32px_rgba(0,0,0,0.1)]"
        >
          <ul className="flex items-center justify-around h-full px-2">
            <li>
              <NavLink
                to="/feed"
                onClick={() => setActiveTray(null)}
                className={({ isActive }) =>
                  `flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-200 ${
                    isActive
                      ? "text-amber-600"
                      : "text-primary hover:text-black"
                  }`
                }
              >
                {/* NavLink lets you pass a function as children - it gives you isActive so you can use it inside */}
                {({ isActive }) => (
                  <>
                    <span
                      className={`w-5 h-0.5 rounded-full mb-0.5 transition-all duration-200 ${isActive ? "bg-amber-500" : "bg-transparent"}`}
                    />
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 7.5h1.5m-1.5 3h1.5m-4.5 5.25h4.5m-4.5-2.25h4.5M4.5 3h15a1.5 1.5 0 0 1 1.5 1.5v15a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 19.5v-15A1.5 1.5 0 0 1 4.5 3Z"
                      />
                    </svg>
                    <span className="text-[0.65rem] uppercase tracking-widest font-medium">
                      Feed
                    </span>
                  </>
                )}
              </NavLink>
            </li>

            <li>
              <button
                type="button"
                aria-expanded={activeTray === "scripture"}
                aria-label="Scripture menu"
                // passing a function to setActiveTray gives you the previous value (v) so you dont read stale state
                onClick={() =>
                  setActiveTray((v) => (v === "scripture" ? null : "scripture"))
                }
                className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-200 ${
                  activeTray === "scripture"
                    ? "text-amber-600"
                    : "text-primary hover:text-black"
                }`}
              >
                <span
                  className={`w-5 h-0.5 rounded-full mb-0.5 transition-all duration-200 ${activeTray === "scripture" ? "bg-amber-500" : "bg-transparent"}`}
                />
                <svg
                  className="w-5 h-5"
                  fill="none"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 3.75h9a3 3 0 0 1 3 3v13.5a.75.75 0 0 1-1.125.65L14 19.5l-2.875 1.4A.75.75 0 0 1 10 20.25V6.75a3 3 0 0 0-3-3Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10 6.75A3 3 0 0 0 7 3.75H6"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 10.5h3m-3 3h3"
                  />
                </svg>
                <span className="text-[0.65rem] uppercase tracking-widest font-medium">
                  Scripture
                </span>
              </button>
            </li>

            <li>
              <NavLink
                to="/threads"
                onClick={() => setActiveTray(null)}
                className={({ isActive }) =>
                  `flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-200 ${
                    isActive
                      ? "text-amber-600"
                      : "text-primary hover:text-black"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={`w-5 h-0.5 rounded-full mb-0.5 transition-all duration-200 ${isActive ? "bg-amber-500" : "bg-transparent"}`}
                    />
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
                      />
                    </svg>
                    <span className="text-[0.65rem] uppercase tracking-widest font-medium">
                      Messages
                    </span>
                  </>
                )}
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/streaming"
                onClick={() => setActiveTray(null)}
                className={({ isActive }) =>
                  `flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-200 ${
                    isActive
                      ? "text-amber-600"
                      : "text-primary hover:text-black"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={`w-5 h-0.5 rounded-full mb-0.5 transition-all duration-200 ${isActive ? "bg-amber-500" : "bg-transparent"}`}
                    />
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.75 5.25a2 2 0 0 1 2-2h12.5a2 2 0 0 1 2 2v10.5a2 2 0 0 1-2 2H5.75a2 2 0 0 1-2-2V5.25Z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9.75 8.25l4.5 2.75-4.5 2.75V8.25Z"
                      />
                    </svg>
                    <span className="text-[0.65rem] uppercase tracking-widest font-medium">
                      Stream
                    </span>
                  </>
                )}
              </NavLink>
            </li>

            {isLeader && (
              <li>
                <button
                  type="button"
                  aria-expanded={activeTray === "dashboard"}
                  aria-label="Dashboard menu"
                  onClick={() =>
                    setActiveTray((v) =>
                      v === "dashboard" ? null : "dashboard",
                    )
                  }
                  className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-200 ${
                    activeTray === "dashboard"
                      ? "text-amber-600"
                      : "text-primary hover:text-black"
                  }`}
                >
                  <span
                    className={`w-5 h-0.5 rounded-full mb-0.5 transition-all duration-200 ${activeTray === "dashboard" ? "bg-amber-500" : "bg-transparent"}`}
                  />
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21"
                    />
                  </svg>
                  <span className="text-[0.65rem] uppercase tracking-widest font-medium">
                    Dashboard
                  </span>
                </button>
              </li>
            )}

            <li>
              <NavLink
                to="/profile"
                onClick={() => setActiveTray(null)}
                className={({ isActive }) =>
                  `flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-200 ${
                    isActive
                      ? "text-amber-600"
                      : "text-primary hover:text-black"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={`w-5 h-0.5 rounded-full mb-0.5 transition-all duration-200 ${isActive ? "bg-amber-500" : "bg-transparent"}`}
                    />
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                      />
                    </svg>
                    <span className="text-[0.65rem] uppercase tracking-widest font-medium">
                      Profile
                    </span>
                  </>
                )}
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
}

export default Sidebar;
