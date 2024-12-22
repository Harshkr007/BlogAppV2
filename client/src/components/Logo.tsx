import { useNavigate } from "react-router-dom";

function Logo() {
  const navigate = useNavigate();

  return (
    <div
      className="flex items-center cursor-pointer"
      onClick={() => navigate("/")}
    >
      <div className="flex items-center gap-2">
        <span className="text-3xl font-bold text-white">
          <img
            src="../assets/react.svg"
            alt="BlogSpace"
            className="h-10 w-auto"
          />
        </span>
        <span className="text-3xl font-light text-white"></span>
      </div>
    </div>
  );
}

export default Logo;
