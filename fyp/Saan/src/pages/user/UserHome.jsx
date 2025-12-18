import React from "react";
import { useNavigate } from "react-router-dom";

function UserHome() {
  const navigate = useNavigate();
  const [searchFilters, setSearchFilters] = React.useState({
    eventType: "",
    location: "",
    date: "",
    attendees: "",
  });

  // Check if user is logged in
  React.useEffect(() => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("userRole");

    if (!token || userRole !== "user") {
      navigate("/");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  // Mock venue data
  const venues = [
    {
      id: 1,
      name: "SAN",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdQd25EXYnIuCtQZqKaNwn9cYdsAO3S0KErw&s",
      rating: 4.8,
      location: "Kathmandu, Kapan",
      capacity: 500,
      type: "Wedding",
    },
    {
      id: 2,
      name: "Second venue",
      image:
        "https://i.pinimg.com/736x/ae/91/8d/ae918d723bcc84209d38b97d0a368819.jpg",
      rating: 4.6,
      location: "Chabahil, Kathmandu",
      capacity: 300,
      type: "Wedding",
    },
    {
      id: 3,
      name: " Third Banquit Hall",
      image:
        "https://i.pinimg.com/1200x/45/de/94/45de943be4717f7de5245b8236522b17.jpg",
      rating: 4.7,
      location: "Thimi, Bhaktapur",
      capacity: 400,
      type: "Corporate",
    },
    {
      id: 4,
      name: "Riverside Hall",
      image:
        "https://i.pinimg.com/736x/16/20/d1/1620d1aef134f60722a9eb07a4c030c4.jpg",
      rating: 4.5,
      location: " Lalitpur, Patan",
      capacity: 600,
      type: "Conference",
    },
    {
      id: 5,
      name: "Fifth Resort",
      image:
        "https://i.pinimg.com/1200x/6b/d0/5e/6bd05e85477e1de00d848b67e75710ec.jpg",
      rating: 4.9,
      location: "kathmandu, Nepal",
      capacity: 350,
      type: "Wedding",
    },
    {
      id: 6,
      name: "Food House",
      image:
        "https://i.pinimg.com/736x/c7/ef/b9/c7efb9d3fcdd08634e867c628e48a405.jpg",
      rating: 4.4,
      location: "Lalitpur, Nepal",
      capacity: 250,
      type: "Wedding",
    },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Fixed Navigation */}
      <nav className="fixed top-0 w-full bg-[#5d0f0f] text-white flex items-center justify-between px-8 py-3 shadow-lg z-50">
        <div className="flex items-center space-x-3">
          <img
            src="src/assets/logo.png"
            alt="SAN Logo"
            className="w-12 h-12 object-contain"
          />
          <span className="text-xl font-bold">SAAN</span>
        </div>

        <div className="flex space-x-10 text-lg font-medium">
          <button className="hover:text-gray-300 transition-colors">
            Product ▾
          </button>
          <button className="hover:text-gray-300 transition-colors">
            Browse Venues
          </button>
          <button className="hover:text-gray-300 transition-colors">
            Blogs
          </button>
          <button className="hover:text-gray-300 transition-colors">
            About us
          </button>
        </div>

        <div className="flex space-x-4 items-center">
          <span className="text-sm">
            {localStorage.getItem("userName")}
          </span>
          <button
            onClick={handleLogout}
            className="bg-gray-100 text-black px-4 py-1 rounded hover:bg-gray-300 font-medium transition-colors"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Add padding for fixed navigation */}
      <div className="pt-20"></div>

      {/* Hero Section */}
      <div
        className="relative w-full h-96 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('https://images.unsplash.com/photo-1519167758481-dc80ecac1d47?w=1200&h=600&fit=crop')`,
        }}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <h1 className="text-5xl font-bold text-white text-center mb-4">
            FIND YOUR PERFECT SPACE <br />
            FOR YOUR EVENT.
          </h1>
          <p className="text-xl text-gray-200 mb-8">
            Search unique venues, compare prices and book online now.
          </p>

          {/* Search Filters */}
          <div className="flex gap-4 bg-white bg-opacity-90 p-6 rounded-lg shadow-lg flex-wrap justify-center">
            <select
              value={searchFilters.eventType}
              onChange={(e) =>
                setSearchFilters({ ...searchFilters, eventType: e.target.value })
              }
              className="px-4 py-2 rounded border border-gray-300 focus:outline-none text-gray-700"
            >
              <option value="">Events</option>
              <option value="wedding">Wedding</option>
              <option value="corporate">Corporate</option>
              <option value="birthday">Birthday</option>
              <option value="conference">Conference</option>
            </select>

            <input
              type="text"
              placeholder="Location"
              value={searchFilters.location}
              onChange={(e) =>
                setSearchFilters({ ...searchFilters, location: e.target.value })
              }
              className="px-4 py-2 rounded border border-gray-300 focus:outline-none text-gray-700"
            />

            <input
              type="date"
              value={searchFilters.date}
              onChange={(e) =>
                setSearchFilters({ ...searchFilters, date: e.target.value })
              }
              className="px-4 py-2 rounded border border-gray-300 focus:outline-none text-gray-700"
            />

            <input
              type="number"
              placeholder="Attendees"
              value={searchFilters.attendees}
              onChange={(e) =>
                setSearchFilters({
                  ...searchFilters,
                  attendees: e.target.value,
                })
              }
              className="px-4 py-2 rounded border border-gray-300 focus:outline-none text-gray-700"
            />

            <button className="bg-[#5d0f0f] text-white px-8 py-2 rounded hover:bg-[#4a0c0c] font-semibold transition-colors">
              Explore
            </button>
          </div>
        </div>
      </div>

      {/* Popular Venues Section */}
      <div className="max-w-7xl mx-auto w-full py-16 px-6">
        <h2 className="text-4xl font-bold text-[#5d0f0f] mb-4">Popular Venues</h2>
        <p className="text-gray-600 mb-12">
          Discover the best venues for your event
        </p>

        {/* Venues Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {venues.map((venue) => (
            <div
              key={venue.id}
              className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300"
            >
              {/* Venue Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={venue.image}
                  alt={venue.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-4 right-4 bg-[#5d0f0f] text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {venue.type}
                </span>
              </div>

              {/* Venue Details */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {venue.name}
                </h3>

                {/* Rating */}
                <div className="flex items-center mb-3">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <span key={i}>
                        {i < Math.floor(venue.rating) ? "★" : "☆"}
                      </span>
                    ))}
                  </div>
                  <span className="text-gray-700 ml-2 font-semibold">
                    {venue.rating}
                  </span>
                </div>

                {/* Location and Capacity */}
                <div className="text-gray-600 text-sm mb-4 space-y-1">
                  <p>📍 {venue.location}</p>
                  <p>👥 Capacity: {venue.capacity} guests</p>
                </div>

                {/* Action Button */}
                <button className="w-full bg-[#5d0f0f] text-white py-2 rounded hover:bg-[#4a0c0c] font-semibold transition-colors">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#5d0f0f] text-white mt-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-3 items-center mb-8">
            {/* Left - Logo */}
            <div className="flex items-center space-x-3">
              <img
                src="src/assets/logo.png"
                alt="SAN Logo"
                className="w-12 h-12 object-contain"
              />
              <span className="text-xl font-bold">SAAN</span>
            </div>

            {/* Center - Copyright */}
            <div className="text-center">
              <p className="text-gray-300 text-sm">
                &copy; 2025 SAAN Venues. All rights reserved.
              </p>
            </div>

            {/* Right - Social Media Links */}
            <div className="flex justify-end space-x-6">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-gray-300 transition-colors text-2xl"
                title="Facebook"
              >
                f
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-gray-300 transition-colors text-2xl"
                title="Instagram"
              >
                📷
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-gray-300 transition-colors text-2xl"
                title="TikTok"
              >
                🎵
              </a>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="border-t border-gray-700 pt-8">
            <div className="grid grid-cols-3 gap-8 text-sm text-gray-300">
              <div>
                <h4 className="font-bold text-white mb-3">Company</h4>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      About Us
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Careers
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Contact
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-white mb-3">Support</h4>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Help Center
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Safety
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Terms
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-white mb-3">Legal</h4>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Terms of Service
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Cookie Policy
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default UserHome;
