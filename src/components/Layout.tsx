import type { ReactNode } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <main className="flex  min-h-screen justify-center">
      <div className="h-full min-h-screen  w-full border-x border-slate-400 md:max-w-2xl">
        {children}
      </div>
    </main>
  );
};

export default Layout;
