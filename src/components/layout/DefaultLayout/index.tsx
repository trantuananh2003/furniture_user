import Header from "../components/Header";
import Footer from "../components/Footer";
import { memo, useEffect, useRef } from "react";
import type { ReactNode } from "react";

interface DefaultLayoutProps {
  children: ReactNode;
}

const DefaultLayout: React.FC<DefaultLayoutProps> = ({ children }) => {
  const goTop = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    goTop.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <div className="flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export default memo(DefaultLayout);
