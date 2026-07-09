import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../store/authSlice.js";
import { showError, showSuccess } from "../../lib/toast.js";
import { api } from "../../lib/axios.js";
import { useState } from "react";

export default function ProfileBox() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const handleClick = () => {
    dispatch(logout());
    showSuccess("Logout Successful");
  };

  const [showModal, setShowModal] = useState(false);

  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setPasswords((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handlePasswordChange = async () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      return showError("Passwords do not match");
    }

    try {
      await api.put("/auth/updatepassword", {
        oldPassword: passwords.oldPassword,
        newPassword: passwords.newPassword,
      });

      showSuccess("Password changed successfully");

      setShowModal(false);

      setPasswords({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      showError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="absolute right-0 top-10 w-44 sm:w-48 md:w-56 bg-white shadow-lg rounded-lg p-3 sm:p-4 border z-50">
      <p className="text-sm sm:text-base font-semibold text-gray-800 break-words">
        {user.username}
      </p>

      <p
        className="mt-2 text-xs sm:text-sm text-blue-600 cursor-pointer hover:underline"
        onClick={() => setShowModal(true)}
      >
        Change Password
      </p>

      <button
        className="mt-3 w-full bg-red-500 text-white py-2 text-sm sm:text-base rounded hover:bg-red-600"
        onClick={handleClick}
      >
        Logout
      </button>
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[100]">
          <div className="bg-white rounded-xl p-6 w-[90%] max-w-md">
            <h2 className="text-xl font-semibold mb-4">Change Password</h2>

            <input
              type="password"
              name="oldPassword"
              placeholder="Current Password"
              value={passwords.oldPassword}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 mb-3"
            />

            <input
              type="password"
              name="newPassword"
              placeholder="New Password"
              value={passwords.newPassword}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 mb-3"
            />

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={passwords.confirmPassword}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 mb-5"
            />

            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 border rounded-lg"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>

              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                onClick={handlePasswordChange}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
