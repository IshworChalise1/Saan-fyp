import React from "react";

function Navigation() {
  return (
    <nav className="w-full bg-[#5d0f0f] text-white flex items-center justify-between px-8 py-3 shadow">
      {/* Logo */}
      <div className="flex items-center space-x-3">
        <img
          src="src/assets/logo.png"
          alt="SAN Logo"
          className="w-12 h-12 object-contain"
        />
      </div>

      {/* Nav Buttons */}
      <div className="flex space-x-10 text-lg font-medium">
        <button className="hover:text-gray-300">Product ▾</button>
        <button className="hover:text-gray-300">Browse Venue By</button>
        <button className="hover:text-gray-300">Blogs</button>
        <button className="hover:text-gray-300">About us</button>
      </div>

      <div className="flex space-x-4">
        <button className="bg-gray-100 text-black px-4 py-1 rounded hover:bg-gray-300">Login</button>
        <button className="bg-gray-800 text-white px-4 py-1 rounded hover:bg-gray-700">Request Demo</button>
      </div>
    </nav>
  );
}

export default Navigation;
