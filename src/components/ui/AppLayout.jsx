import Header from "@/pages/Header";
import { Outlet } from "react-router-dom";

function AppLayout() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-slate-950">
        <Outlet />
      </main>
    </>
  );
}

export default AppLayout;
