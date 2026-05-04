import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";

const Navbar = ({ setToken }) => {
  const navigate = useNavigate();

  const logoutHandler = () => {
    // remove token from storage
    localStorage.removeItem("adminToken");

    // clear state
    setToken("");

    // redirect to login
    navigate("/add");
  };

  return (
    <div className="flex items-center justify-between py-2 px-[4%] bg-white shadow-sm">

      {/* Logo */}
      <img
        className="w-[max(10%,80px)]"
        src={assets.logo}
        alt="logo"
      />

      {/* Right Side */}
      <div className="flex items-center gap-4">

        <p className="hidden sm:block text-sm text-gray-600">
          Admin Panel
        </p>

        <button
          onClick={logoutHandler}
          className="bg-gray-800 text-white px-5 py-2 rounded-full text-xs sm:text-sm hover:bg-black transition"
        >
          Logout
        </button>

      </div>
    </div>
  );
};

export default Navbar;