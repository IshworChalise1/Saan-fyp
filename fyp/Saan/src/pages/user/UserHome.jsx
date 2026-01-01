import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  FaSearch, 
  FaMapMarkerAlt, 
  FaUsers, 
  FaStar, 
  FaCalendarAlt,
  FaFacebookF, 
  FaInstagram, 
  FaTiktok
} from "react-icons/fa";
import Navigation from "../../components/Navigation";

function UserHome() {
  const navigate = useNavigate();
  const [searchFilters, setSearchFilters] = useState({
    eventType: "",
    location: "",
    date: "",
    attendees: "",
  });

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("userRole");

    if (!token || userRole !== "user") {
      navigate("/");
    }
  }, [navigate]);

  // Mock venue data
  const venues = [
    {
      id: 1,
      name: "Grand SAN Banquet",
      image:
        "https://images.unsplash.com/photo-1519677100203-3f3e5d046410?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      rating: 4.8,
      location: "Kathmandu, Kapan",
      capacity: 500,
      type: "Wedding",
      price: "NPR 250,000",
    },
    {
      id: 2,
      name: "Elegant Gardens",
      image:
        "https://images.unsplash.com/photo-1519167758481-dc80ecac1d47?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      rating: 4.6,
      location: "Chabahil, Kathmandu",
      capacity: 300,
      type: "Wedding",
      price: "NPR 180,000",
    },
    {
      id: 3,
      name: "Corporate Hub",
      image:
        "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      rating: 4.7,
      location: "Thimi, Bhaktapur",
      capacity: 400,
      type: "Corporate",
      price: "NPR 150,000",
    },
    {
      id: 4,
      name: "Riverside Convention",
      image:
        "https://images.unsplash.com/photo-1511578314322-379afb476865?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      rating: 4.5,
      location: "Lalitpur, Patan",
      capacity: 600,
      type: "Conference",
      price: "NPR 200,000",
    },
    {
      id: 5,
      name: "Mountain View Resort",
      image:
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      rating: 4.9,
      location: "Kathmandu, Nepal",
      capacity: 350,
      type: "Wedding",
      price: "NPR 300,000",
    },
    {
      id: 6,
      name: "Royal Banquet Hall",
      image:
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      rating: 4.4,
      location: "Lalitpur, Nepal",
      capacity: 250,
      type: "Wedding",
      price: "NPR 120,000",
    },
  ];

  // Event types for dropdown
  const eventTypes = [
    "Wedding", "Corporate", "Birthday", "Conference", "Seminar", "Reception", "Party"
  ];

  const handleVenueClick = (venueId) => {
    navigate(`/venue/${venueId}`);
  };

  const handleSearch = () => {
    // Filter venues based on search criteria
    const filteredVenues = venues.filter(venue => {
      if (searchFilters.eventType && venue.type !== searchFilters.eventType) return false;
      if (searchFilters.location && !venue.location.toLowerCase().includes(searchFilters.location.toLowerCase())) return false;
      // Add more filter logic as needed
      return true;
    });
    
    // For now, just navigate to browse-venue with filters
    navigate("/browse-venue", { 
      state: { 
        filters: searchFilters 
      } 
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation />
      
      {/* Add padding for fixed navigation */}
      <div className="pt-16"></div>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-[#5d0f0f] to-[#7a1c1c]">
        <div className="absolute inset-0 bg-black opacity-50">
          <img
            src="https://i.pinimg.com/1200x/0f/53/0f/0f530fc2d1a3feaef403ca936b218ce5.jpg"
            alt="Background"
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Find Your Perfect Space
              <br />
              <span className="text-yellow-300">For Your Special Event</span>
            </h1>
            <p className="text-xl text-gray-200 mb-10 max-w-2xl mx-auto">
              Discover and book unique venues for weddings, corporate events, and celebrations
            </p>

            {/* Search Filters */}
            <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <FaSearch />
                  </div>
                  <select
                    value={searchFilters.eventType}
                    onChange={(e) =>
                      setSearchFilters({ ...searchFilters, eventType: e.target.value })
                    }
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#5d0f0f] focus:border-transparent text-gray-700 bg-gray-50"
                  >
                    <option value="">Event Type</option>
                    {eventTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <FaMapMarkerAlt />
                  </div>
                  <input
                    type="text"
                    placeholder="Location"
                    value={searchFilters.location}
                    onChange={(e) =>
                      setSearchFilters({ ...searchFilters, location: e.target.value })
                    }
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#5d0f0f] focus:border-transparent text-gray-700 bg-gray-50"
                  />
                </div>

                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <FaCalendarAlt />
                  </div>
                  <input
                    type="date"
                    value={searchFilters.date}
                    onChange={(e) =>
                      setSearchFilters({ ...searchFilters, date: e.target.value })
                    }
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#5d0f0f] focus:border-transparent text-gray-700 bg-gray-50"
                  />
                </div>

                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <FaUsers />
                  </div>
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
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#5d0f0f] focus:border-transparent text-gray-700 bg-gray-50"
                  />
                </div>
              </div>
              
              <button 
                onClick={handleSearch}
                className="mt-6 w-full md:w-auto bg-gradient-to-r from-[#5d0f0f] to-[#7a1c1c] text-white px-8 py-3 rounded-xl hover:from-[#4a0c0c] hover:to-[#651616] font-semibold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
              >
                <FaSearch />
                <span>Explore Venues</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-12 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "Venues Listed", value: "200+" },
              { label: "Happy Customers", value: "5,000+" },
              { label: "Events Hosted", value: "10,000+" },
              { label: "Cities Covered", value: "15+" }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-[#5d0f0f] mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Popular Venues Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Popular <span className="text-[#5d0f0f]">Venues</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover the most sought-after venues for your perfect event
          </p>
        </div>

        {/* Venues Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {venues.map((venue) => (
            <div
              key={venue.id}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* Venue Image */}
              <div className="relative h-56 md:h-64 overflow-hidden">
                <img
                  src={venue.image}
                  alt={venue.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4">
                  <span className="bg-[#5d0f0f] text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
                    {venue.type}
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1 rounded-lg text-sm">
                  {venue.price}
                </div>
              </div>

              {/* Venue Details */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold text-gray-900 line-clamp-1">
                    {venue.name}
                  </h3>
                  <div className="flex items-center bg-yellow-50 px-2 py-1 rounded">
                    <FaStar className="text-yellow-400 mr-1" />
                    <span className="font-bold text-gray-900">{venue.rating}</span>
                  </div>
                </div>

                <div className="flex items-center text-gray-600 mb-3">
                  <FaMapMarkerAlt className="text-gray-400 mr-2" />
                  <span className="text-sm">{venue.location}</span>
                </div>

                <div className="flex items-center text-gray-600 mb-6">
                  <FaUsers className="text-gray-400 mr-2" />
                  <span className="text-sm">Capacity: {venue.capacity} guests</span>
                </div>

                <button 
                  onClick={() => handleVenueClick(venue.id)}
                  className="w-full bg-gradient-to-r from-[#5d0f0f] to-[#7a1c1c] text-white py-3 rounded-xl hover:from-[#4a0c0c] hover:to-[#651616] font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link
            to="/browse-venue"
            className="inline-block border-2 border-[#5d0f0f] text-[#5d0f0f] hover:bg-[#5d0f0f] hover:text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300"
          >
            View All Venues
          </Link>
        </div>
      </div>

      {/* Footer - REMOVED CTA SECTION AND NEWSLETTER */}
      <footer className="bg-[#3a0a0a] text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Company Info */}
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <img
                  src="src/assets/logo.png"
                  alt="SAN Logo"
                  className="w-12 h-12 object-contain"
                />
                <span className="text-xl font-bold">SAAN</span>
              </div>
              <p className="text-gray-400 mb-6">
                Your trusted partner in finding the perfect venue for every occasion.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
                  <FaFacebookF />
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
                  <FaInstagram />
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
                  <FaTiktok />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-bold text-lg mb-6">Quick Links</h4>
              <ul className="space-y-3">
                <li><Link to="/browse-venue" className="text-gray-400 hover:text-white transition-colors">Browse Venues</Link></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">How It Works</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Testimonials</a></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="font-bold text-lg mb-6">Support</h4>
              <ul className="space-y-3">
                <li><Link to="/customer-inquiry" className="text-gray-400 hover:text-white transition-colors">Help Center</Link></li>
                <li><Link to="/customer-inquiry" className="text-gray-400 hover:text-white transition-colors">Contact Us</Link></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">FAQs</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Booking Guide</a></li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} SAAN Venues. All rights reserved.</p>
            <div className="mt-4 text-sm">
              <a href="#" className="hover:text-white transition-colors mx-4">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors mx-4">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors mx-4">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default UserHome;