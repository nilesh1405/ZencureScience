import { useState, useRef, useEffect } from "react";
import ProfileBox from "../common/ProfileBox.jsx";
import companyLogo from "../../assets/images/companyLogo.jpeg";
import ProfileMenuImage from "../../assets/images/ProfileMenuImage.png";

export default function Navbar() {
  const [login] = useState(true);
  const [showDialog, setShowDialog] = useState(false);

  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowDialog(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="bg-yellow-300 p-2 h-14 sm:h-12 w-auto m-2 sm:ml-4 sm:mr-4 rounded-lg">
      <div className="flex justify-between items-center h-full">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          <img
            src={companyLogo}
            alt="logo"
            className="h-8 w-8 sm:h-9 sm:w-9 rounded-full"
          />

          <h1 className="text-base sm:text-xl md:text-2xl font-bold text-gray-800 truncate">
            Zencure Science
          </h1>
        </div>

        {login && (
          <div ref={menuRef} className="relative z-10 flex-shrink-0">
            <img
              src={ProfileMenuImage}
              alt="icon"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full cursor-pointer"
              onClick={() => setShowDialog(!showDialog)}
            />

            {showDialog && <ProfileBox />}
          </div>
        )}
      </div>
    </div>
  );
}
