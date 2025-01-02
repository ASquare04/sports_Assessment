import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { auth } from "../utility/firebase";
import { signOut } from "firebase/auth";
import { FaBars, FaTimes, FaMoon, FaSun } from "react-icons/fa";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {

    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Error logging out:", err);
    }
  };

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const newTheme = !prev;
      localStorage.setItem("theme", newTheme ? "dark" : "light");
      return newTheme;
    });
  };

  return (
    <nav className="sticky top-0 z-10 bg-white dark:bg-black">
      <div className="max-w-screen-xl mx-auto px-4 py-3 flex justify-between items-center">

        <div className="flex items-center space-x-4">
          <Link to="/" className="text-2xl font-bold">
            DASHLINE
          </Link>
        </div>

        <div className="hidden md:flex items-center space-x-12">
          {!user ? (
            <>
              <Link to="/login" className="font-medium">
                Account
              </Link>
              <button
                onClick={toggleDarkMode}
                className="border-2 bg-black text-white dark:bg-white dark:text-black rounded-full p-2 ml-4 md:ml-0 focus:outline-none"
              >
                {isDarkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
              </button>
            </>
          ) : (
            <>
              <Link to="/dashboard" className="font-medium">
                Dashboard
              </Link>
              <Link to="/payout" className="font-medium">
                Manage Payout
              </Link>
              <span className="font-medium">
                {user.displayName || "Username"}
              </span>
              <button
                onClick={handleLogout}
                className="bg-black text-white dark:bg-white dark:text-black px-4 py-2"
              >
                Logout
              </button>
              <button
                onClick={toggleDarkMode}
                className="border-2 bg-black text-white dark:bg-white dark:text-black rounded-full p-2 ml-4 md:ml-0 focus:outline-none"
              >
                {isDarkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
              </button>
            </>
          )}
        </div>

        <button
          onClick={toggleMenu}
          className="ml-4 md:hidden text-gray-800 dark:text-white focus:outline-none"
        >
          {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-[#121212] flex flex-col">
          <ul className="flex flex-col items-center space-y-4 py-4">
            {!user ? (
              <li>
                <Link to="/login" className="font-medium" onClick={toggleMenu}>
                  Account
                </Link>
                <button
                  onClick={toggleDarkMode}
                  className="border-2 bg-black text-white dark:bg-white dark:text-black rounded-full p-2 ml-4 md:ml-0 focus:outline-none"
                >
                  {isDarkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
                </button>
              </li>
            ) : (
              <>
                <li>
                  <Link
                    to="/dashboard"
                    className="text-gray-800 dark:text-white font-medium"
                    onClick={toggleMenu}
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    to="/payout"
                    className="text-gray-800 dark:text-white font-medium"
                    onClick={toggleMenu}
                  >
                    Manage Payout
                  </Link>
                </li>
                <li className="text-gray-800 dark:text-white font-medium">
                  {user.displayName || "Username"}
                </li>
                <li className="flex items-center">
                  <button
                    onClick={() => {
                      handleLogout();
                      toggleMenu();
                    }}
                    className="bg-black text-white dark:bg-white dark:text-black px-4 py-2"
                  >
                    Logout
                  </button>
                  <button
                    onClick={toggleDarkMode}
                    className="border-2 bg-black text-white dark:bg-white dark:text-black rounded-full p-2 ml-4 md:ml-0 focus:outline-none"
                  >
                    {isDarkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
