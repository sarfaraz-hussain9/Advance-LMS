import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { RiMenu3Fill } from "react-icons/ri";
import { FaXmark } from "react-icons/fa6";
import { IoMdArrowDropdown } from "react-icons/io";
import { logout } from "../redux/features/authSlice";
import { useLogoutMutation } from "../redux/api/userApi";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import logo from "../assets/Images/logo.png";

const NavBar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);

  const [menu, setMenu] = useState(false);
  const [profileDropDown, setProfileDropDown] = useState(false);
  const [Logout, { isLoading: logoutLoading }] = useLogoutMutation();

  const handleProfileDropDown = () => {
    setProfileDropDown(!profileDropDown);
  };

  const handleLogout = async () => {
    try {
      await Logout().unwrap();
      dispatch(logout());
      toast.success("Logged out successfully");
      setProfileDropDown(false);
      navigate("/signin");
    } catch (err) {
      toast.error(err.message || "Logout failed");
    }
  };

  return (
    <div className="w-full bg-[#F8F9FA] shadow-md">
      <div className="w-full flex justify-between items-center py-3 px-8">
        {/* Logo and Brand Name */}
        <div className="flex items-center gap-2">
          <img
            src={logo}
            alt="Logo"
            className="w-12 h-12 object-cover"
            aria-label="ED MACHINE Logo"
          />
          <h1 className="text-2xl font-bold text-[#007BFF]">ED MACHINE</h1>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMenu(!menu)}
          className="md:hidden z-50 focus:outline-none"
          aria-label="Toggle Menu"
        >
          {menu ? (
            <FaXmark className="text-4xl text-[#6c757d]" />
          ) : (
            <RiMenu3Fill className="text-4xl text-[#6c757d]" />
          )}
        </button>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex md:items-center gap-8 font-semibold uppercase text-[#6c757d]">
          <li>
            <Link to="/" className="hover:text-[#007BFF] transition-colors">
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/course"
              className="hover:text-[#007BFF] transition-colors"
            >
              Courses
            </Link>
          </li>
          <li>
            <Link
              to="/aboutus"
              className="hover:text-[#007BFF] transition-colors"
            >
              About Us
            </Link>
          </li>
          <li>
            <Link
              to="/contact"
              className="hover:text-[#007BFF] transition-colors"
            >
              Contact
            </Link>
          </li>
          {userInfo ? (
            <li
              onClick={handleProfileDropDown}
              className="cursor-pointer flex items-center gap-1 hover:text-[#007BFF] transition-colors relative"
              aria-label="Profile Dropdown"
            >
              Profile
              <IoMdArrowDropdown />
            </li>
          ) : (
            <li className="bg-[#007BFF] px-3 text-white py-1 rounded-md hover:bg-[#0056b3] transition-colors">
              <Link to="/signin" className="focus:outline-none">
                Sign In
              </Link>
            </li>
          )}
        </ul>
      </div>

      {/* Profile Dropdown */}
      {profileDropDown && (
        <div
          className="absolute top-14 right-6 bg-white border border-[#007BFF] rounded-lg shadow-lg py-2 w-40 transition-opacity duration-300 z-10"
          aria-label="Profile Dropdown Menu"
        >
          <ul className="text-[#6c757d] font-semibold text-center">
            <li className="border-b px-4 py-2 cursor-pointer hover:bg-[#F8F9FA] hover:text-[#007BFF] transition-colors">
              <Link
                to="/profile"
                onClick={() => setProfileDropDown(false)}
                className="block w-full"
              >
                Profile
              </Link>
            </li>
            <li
              onClick={handleLogout}
              className="px-4 py-2 text-red-500 cursor-pointer hover:bg-[#F8F9FA] hover:text-red-700 transition-colors"
            >
              {logoutLoading ? "Logging Out..." : "Logout"}
            </li>
          </ul>
        </div>
      )}

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 left-0 w-screen h-screen bg-[#343a40]/90 backdrop-blur-md transition-transform duration-300 ease-in-out md:hidden z-40 ${
          menu ? "translate-x-0" : "translate-x-full"
        }`}
        aria-label="Mobile Menu"
      >
        <ul className="w-full h-full flex flex-col items-center justify-center gap-8 text-white font-semibold uppercase">
          <li>
            <Link
              to="/"
              onClick={() => setMenu(false)}
              className="hover:text-[#007BFF] transition-colors"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/course"
              onClick={() => setMenu(false)}
              className="hover:text-[#007BFF] transition-colors"
            >
              Courses
            </Link>
          </li>
          <li>
            <Link
              to="/about"
              onClick={() => setMenu(false)}
              className="hover:text-[#007BFF] transition-colors"
            >
              About Us
            </Link>
          </li>
          {userInfo ? (
            <li
              onClick={handleProfileDropDown}
              className="cursor-pointer flex items-center gap-1 hover:text-[#007BFF] transition-colors relative"
              aria-label="Profile Dropdown"
            >
              Profile
              <IoMdArrowDropdown />
            </li>
          ) : (
            <li className="bg-[#007BFF] px-3 text-white py-1 rounded-md hover:bg-[#0056b3] transition-colors">
              <Link to="/signin" className="focus:outline-none">
                Sign In
              </Link>
            </li>
          )}
          {userInfo && (
            <li
              onClick={handleLogout}
              className="text-red-600 hover:text-red-700 transition-colors"
            >
              {logoutLoading ? "Logging Out..." : "Logout"}
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default NavBar;
