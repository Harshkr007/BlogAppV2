import { Outlet } from "react-router-dom";
import "./App.css";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <div>
        <Toaster position="top-center" reverseOrder={false} />
        <main>
          <Outlet />
        </main>
      </div>
    </>
  );
}

export default App;
