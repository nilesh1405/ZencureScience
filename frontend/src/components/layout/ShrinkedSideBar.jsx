import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { sideBarOpen, sideBarClose } from "../../store/uiSlice.js";
import { sidebarMenus } from "../../lib/sideBarUtility.js";
import { Link } from "react-router-dom";
import { X, Menu } from "lucide-react";
import { useLocation } from "react-router-dom";

export default function SideBar() {
  const dispatch = useDispatch();
  const [click, setClick] = useState(false);
  const location = useLocation();
  useEffect(() => {
    setClick(false);
  }, [location.pathname]);
  const user = useSelector((state) => state.auth.user);
  const role = user?.role;
  const menus = sidebarMenus[role] || [];

  return (
    <div className="z-10">
      <button
        onClick={() => setClick(!click)}
        className="fixed top-4 left-4 z-50 bg-white shadow-lg rounded-lg p-2"
      >
        <Menu size={28} />
      </button>

      {click && (
        <>
          <div className="bg-yellow-300 m-4 rounded-2xl border-2">
            {menus.map((menu) => (
              <Link
                key={menu.path}
                to={menu.path}
                className="
      flex items-center
      px-3 py-3 mb-2
      rounded-xl
      text-gray-800
      hover:bg-white
      hover:text-blue-600
      hover:shadow-md
      transition-all duration-300
    "
              >
                <img
                  src={menu.icon}
                  alt={menu.name}
                  className="w-6 h-6 object-contain shrink-0"
                />

                <span
                  className={`
        ml-3 whitespace-nowrap overflow-hidden
        transition-all duration-300
        "opacity-100 w-auto"
      `}
                >
                  {menu.name}
                </span>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
