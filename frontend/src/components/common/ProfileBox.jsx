import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../store/authSlice.js";
import { showSuccess } from "../../lib/toast.js";

export default function ProfileBox() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const handleClick = () => {
    dispatch(logout());
    showSuccess("Logout Successful");
  };

  return (
    <div className="absolute right-0 top-10 w-44 sm:w-48 md:w-56 bg-white shadow-lg rounded-lg p-3 sm:p-4 border z-50">
      <p className="text-sm sm:text-base font-semibold text-gray-800 break-words">
        {user.username}
      </p>

      <p className="mt-2 text-xs sm:text-sm text-gray-600 cursor-pointer">
        Change Password
      </p>

      <button
        className="mt-3 w-full bg-red-500 text-white py-2 text-sm sm:text-base rounded hover:bg-red-600"
        onClick={handleClick}
      >
        Logout
      </button>
    </div>
  );
}
