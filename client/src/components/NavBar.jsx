import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { RiMenu3Fill } from "react-icons/ri";
import { FaXmark } from "react-icons/fa6";
import { IoMdArrowDropdown } from "react-icons/io";
import { logout } from "../redux/features/authSlice";
import { useLogoutMutation } from "../redux/api/userApi";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

const NavBar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);

  const [menu, setMenu] = useState(false);
  const [profileDropDown, setProfileDropDown] = useState(false);
  const [Logout, { isLoading: logoutLoading, isError: logoutError }] =
    useLogoutMutation();

  const handleProfileDropDown = () => {
    setProfileDropDown(!profileDropDown);
  };

  // logout
  const handleLogout = async () => {
    try {
      await Logout().unwrap();
      console.log("dispatch not workng");
      dispatch(logout());
      console.log("dispatch workng");
      toast.success("User logged out successfully");
      setProfileDropDown(false);
      navigate("/signin");
    } catch (err) {
      toast.error(err.message || "Logout failed");
    }
  };

  return (
    <div className=" w-full bg-background shadow fixed top-0 left-0 z-50">
      <div className="w-full flex justify-between items-center py-2 px-8">
        <div className="flex items-end gap-1 z-50">
          <img src="/logo.png" alt="Logo" className="w-12 h-12 object-cover" />
          <h1 className="text-2xl font-bold text-primery">ED MACHINE</h1>
        </div>
        <div onClick={() => setMenu(!menu)} className="md:hidden z-50">
          {menu ? (
            <FaXmark className="text-4xl text-accent" />
          ) : (
            <RiMenu3Fill className="text-4xl text-accent" />
          )}
        </div>
        <ul className="hidden md:flex gap-8 font-semibold uppercase text-accent">
          <li>
            <Link to="/home">Home</Link>
          </li>
          <li>
            <Link to="/course">Course</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          {userInfo && (
            <li
              onClick={handleProfileDropDown}
              className="cursor-pointer flex items-center gap-1"
            >
              profile
              <span>
                <IoMdArrowDropdown />
              </span>
            </li>
          )}
        </ul>
      </div>
      {/* profile dropdown */}
      <div
        className={`fixed top-12 right-2 py-2 bg-background border-2 border-primery ${
          profileDropDown ? "block" : "hidden"
        }`}
      >
        <ul className="w-full h-full text-accent text-center font-semibold uppercase flex flex-col justify-center px-3">
          <li
            onClick={() => setProfileDropDown(false)}
            className="border-b-2 border-box5 py-1 px-2"
          >
            <Link to="/profile">profile</Link>
          </li>
          <li
            onClick={handleLogout}
            className=" py-1 text-[#FF0000] px-2 cursor-pointer"
          >
            logout
          </li>
        </ul>
      </div>
      {/* mobile menu */}
      <div
        className={`fixed top-0 left-0 w-screen h-screen bg-box3 transition-transform duration-300 ease-in-out md:hidden ${
          menu ? "translate-x-0" : "translate-x-full"
        } z-40`}
      >
        <ul className="w-full h-full flex flex-col items-center justify-center gap-8 font-semibold uppercase text-accent">
          <li>
            <Link to="/" onClick={() => setMenu(false)}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/course" onClick={() => setMenu(false)}>
              Course
            </Link>
          </li>
          <li>
            <Link to="/about" onClick={() => setMenu(false)}>
              About
            </Link>
          </li>
          <li>
            <Link to="/profile" onClick={() => setMenu(false)}>
              Profile
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default NavBar;
