import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets";

const Sidebar = () => {
  return (
    <div className="w-[200px] min-h-screen border-r bg-white">

      <div className="flex flex-col gap-2 pt-6 px-3 text-sm">

        {/* ADD PRODUCT */}
        <NavLink
          to="/add"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 rounded-md transition 
            ${isActive ? "bg-black text-white [&>img]:invert" 
            : "hover:bg-gray-100"}`
          }
        >
          <img className="w-5 h-5" src={assets.add_icon} alt="" />
          <p>Add Product</p>
        </NavLink>

        {/* LIST PRODUCTS */}
        <NavLink
          to="/list"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 rounded-md transition 
            ${isActive ? "bg-black text-white [&>img]:invert" 
            : "hover:bg-gray-100"}`
          }
        >
          <img className="w-5 h-5" src={assets.order_icon} alt="" />
          <p>Products</p>
        </NavLink>

        {/* ORDERS */}
        <NavLink
          to="/orders"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 rounded-md transition 
            ${isActive ? "bg-black text-white [&>img]:invert" 
            : "hover:bg-gray-100"}`
          }
        >
          <img className="w-5 h-5" src={assets.order_icon} alt="" />
          <p>Orders</p>
        </NavLink>

      </div>
    </div>
  );
};

export default Sidebar;