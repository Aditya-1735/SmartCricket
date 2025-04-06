import React from "react";
import { Link } from "react-router-dom";
import { Home, Clock, LogIn } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <span className=" font-bold text-xl">SmartCricket</span>
            <div className=" flex items-center ml-8 space-x-6">
              <Link to="/" className="ml-8 flex items-center space-x-2 text-gray-700 ">
                <Home className="size-5" />
                <span>Home</span>
              </Link>
              <Link to="/past" className="flex items-center space-x-2 text-gray-700">
                <Clock className="size-5" />
                <span>Past Matches</span>
              </Link>
            </div>
          </div>

          <div>
            <Link to="/login" className="flex items-center space-x-2 text-cricket-green">
              <LogIn className="size-5" />
              <span>Login</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;