import React, { useEffect, useState, useContext } from "react";
import logo from "../assets/images/logo.png";
import { NavLink, useNavigate } from "react-router-dom";
import { UserContext } from "./UserContext";
const Navbar = () => {
  const { user, logout } = useContext(UserContext);
  const isEmployer =
    user && user["profile"]["userRole"] === "Employer" ? true : false;
  console.log("Logged In User is.......", isEmployer);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const linkClass = ({ isActive }) =>
    isActive
      ? "text-white bg-black hover:bg-gray-900 hover:text-white rounded-md px-3 py-2"
      : "text-white hover:bg-gray-900 hover:text-white rounded-md px-3 py-2";

  return (
    <nav className="bg-indigo-700 border-b border-indigo-500">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <div className="flex flex-1 items-center justify-center md:items-stretch md:justify-start">
            <NavLink className="flex flex-shrink-0 items-center mr-4" to="/">
              <img className="h-10 w-auto" src={logo} alt="React Jobs" />
              <span className="hidden md:block text-white text-2xl font-bold ml-2">
                Programming Jobs!
              </span>
            </NavLink>
            <div className={user ? "md:ml-auto" : "invisible"}>
              <div className="flex space-x-2">
                <NavLink to="/" className={linkClass}>
                  Home
                </NavLink>
                <NavLink to="/jobs" className={linkClass}>
                  Jobs
                </NavLink>{" "}
                <NavLink
                  to="/add-job"
                  className={isEmployer ? linkClass : "hidden"}
                >
                  Add Job
                </NavLink>
                <button onClick={handleLogout}>Logout</button>
              </div>
            </div>
            <div className={user ? "invisible" : "md:ml-auto"}>
              <div className="flex space-x-2">
                <NavLink to="/login" className={linkClass}>
                  Login
                </NavLink>
                <NavLink to="/register" className={linkClass}>
                  Register
                </NavLink>{" "}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
