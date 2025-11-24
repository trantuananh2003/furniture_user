import type { ReactNode } from "react";

function NonHeaderLayout({ children }: { children: ReactNode }) {
  return <div className="relative">{children}</div>;
}

export default NonHeaderLayout;
