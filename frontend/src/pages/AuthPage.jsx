import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";


function AuthPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <section className="bg-light flex flex-col items-center justify-center min-h-screen p-10">
        <Outlet />
      </section>
      <Footer />
    </div>
  );
}

export default AuthPage;