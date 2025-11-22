"use client";

import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div>
      <Header />
      <button
        className="fixed top-4 right-2 z-50 text-text md:hidden text-2xl p-2 rounded-md bg-card"
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? <FaTimes /> : <FaBars />}{" "}
      </button>
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 z-40 md:hidden"
          onClick={closeSidebar}
        ></div>
      )}
      <main className="flex-1 overflow-y-auto p-4 md:ml-64 md:p-8 pt-20 md:pt-8">
        {children}
      </main>
    </div>
  );
}
