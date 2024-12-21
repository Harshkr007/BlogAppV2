import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

function Home() {
  return (
    <div className="h-screen flex flex-col">
      <div className="bg-blue-300 h-20 flex items-center px-12 flex-shrink-0">
        <Header />
      </div>
      <div className="grid grid-cols-5 flex-grow overflow-hidden">
        <div className="col-span-1 overflow-y-auto">
          <Sidebar />
        </div>
        <div className="col-span-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Home;
