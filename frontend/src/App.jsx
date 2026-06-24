import Home from "./pages/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import LoginForm from "./components/LoginForm";
import SignUpForm from "./components/SignUpForm";
import Feed from "./pages/Feed";
import FeedChannel from "./components/FeedChannel";
import PostForm from "./components/PostForm";
import Dashboard from "./pages/Dashboard";
import DashboardOverview from "./components/DashboardOverview";
import Fellowships from "./components/Fellowships";
import CourseDashboard from "./components/CourseDashboard";
import DepartmentDashboard from "./components/DepartmentDashboard";
import ServicesDashboard from "./components/ServicesDashboard";
import UsersDashboard from "./components/UsersDashboard";
import LeadershipDashboard from "./components/LeadershipDashboard";
import CharityOrganisationDashboard from "./components/CharityOrganisationDashboard";
import PostView from "./components/PostView";
import ThreadsPage from "./pages/ThreadsPage";
import useAuthStore from "./zustand/authStore";
import { useEffect } from "react";
import BiblePage from "./pages/BiblePage";
import StreamingPage from "./pages/StreamingPage";
import ProfilePage from "./pages/ProfilePage";
import PageNotFound from "./pages/PageNotFound";
import ComingSoon from "./pages/ComingSoon";
import AdminStreamPanel from "./components/AdminStreamPanel";
import MemorizePage from "./pages/MemorizePage";
import ReadingPlansPage from "./pages/ReadingPlan";
import CharityOrganisationsPage from "./pages/CharityOrganisationsPage";
import Navbar from "./components/Navbar";

function App() {
  const initAuth = useAuthStore((state) => state.initAuth);
  const loading = useAuthStore((state) => state.loading);
  // const wipUrls = [
  //   "/plans",
  //   "/plans/*",
  // ]

  useEffect(() => {
    const unsubscribe = initAuth();
    return () => unsubscribe();
  }, [initAuth]);


  if (loading) {
    return (
      <div
        className="flex flex-col items-center justify-center h-screen bg-ivory gap-6"
        role="status"
        aria-live="polite"
        aria-busy="true"
      >
        {/* Logo */}
        <div className="font-cormorant text-3xl font-semibold tracking-[0.15em] text-black" aria-hidden="true">
          O<span className="text-amber-500">C</span>M
        </div>

        {/* Animated bar */}
        <div className="w-32 h-px bg-divider relative overflow-hidden" aria-hidden="true">
          <div
            className="absolute top-0 left-0 h-full bg-amber-500"
            style={{
              width: "40%",
              animation: "slide 1.4s ease-in-out infinite",
            }}
          />
        </div>

        {/* Label */}
        <p className="font-coptic text-sm uppercase tracking-[0.25em] text-black">
          Loading, please wait…
        </p>
        <span className="sr-only">Loading the application, please wait.</span>

        <style>{`
        @keyframes slide {
          0%   { transform: translateX(-100%); }
          50%  { transform: translateX(300%); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
      </div>
    );
  }
  return (
    <Router>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/threads" element={<ThreadsPage />} />
        <Route path="/bible" element={<BiblePage />} />
        <Route path="/plans/verses" element={<MemorizePage />} />
        <Route path="/plans/reading" element={<ReadingPlansPage />} />
        <Route path="/streaming" element={<StreamingPage />} />
        <Route path="/feed" element={<Feed />}>
          <Route path="/feed/" element={<FeedChannel />} />
          <Route path="/feed/post/:postId" element={<PostView />} />
          <Route path="upload/" element={<PostForm />} />
        </Route>
        <Route path="/auth" element={<AuthPage />}>
          <Route path="login" element={<LoginForm />} />
          <Route path="signup" element={<SignUpForm />} />
        </Route>
        <Route path="/dashboard" element={<Dashboard />}>
          <Route path="/dashboard/" element={<DashboardOverview />} />
          <Route path="groups/fellowship" element={<Fellowships />} />
          <Route path="groups/courses" element={<CourseDashboard />} />
          <Route path="groups/departments" element={<DepartmentDashboard />} />
          <Route path="groups/services" element={<ServicesDashboard />} />
          <Route path="users/all" element={<UsersDashboard />} />
          <Route path="users/leadership" element={<LeadershipDashboard />} />
          <Route path="streaming" element={<AdminStreamPanel />} />
          <Route path="outreach/charity" element={<CharityOrganisationDashboard />} />
        </Route>
        <Route path="/outreach/charity" element={<CharityOrganisationsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="*" element={<PageNotFound />} />
        {/* {wipUrls.map((path) =>
          (<Route key={path} path={path} element={<ComingSoon/>}/>))} */}
      </Routes>
    </Router>
  );
}

export default App;
