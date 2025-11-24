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
  // ref của div, nên dùng HTMLDivElement
  const goTop = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate(); // hook navigate

  // useSelector với RootState và kiểu dữ liệu user
  const userData = useSelector<RootState, User | null>((state) => state.users);

  useEffect(() => {
    goTop.current?.scrollIntoView({ behavior: "smooth" });
    if (userData?.user_id.trim() === "") {
      navigate("/auth");
    }
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
