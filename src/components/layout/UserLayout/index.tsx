import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import React, { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import type { RootState } from "../../../redux/store";
import { useSelector } from "react-redux";
import type User from "~/model/User";
import { useNavigate } from "react-router-dom";

interface UseLayoutProps {
  children: ReactNode;
}

const UseLayout: React.FC<UseLayoutProps> = ({ children }) => {
  const goTop = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    goTop.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <div className="relative">
      <Header />
      <div ref={goTop} />
      <div className="flex">
        <Sidebar />
        <div className="flex-1">{children}</div>
      </div>
      <Footer />
    </div>
  );
};

export default UseLayout;
