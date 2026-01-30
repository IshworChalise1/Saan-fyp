import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { venueAPI, menuAPI, packageAPI, bookingAPI } from '../../services/api';
import { FaArrowLeft, FaPhone, FaEnvelope, FaMapMarkerAlt, FaShoppingCart, FaPlus, FaMinus, FaChevronLeft, FaChevronRight, FaTimes } from 'react-icons/fa';

function UserVenueDetail() {
  const { venueId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [venue, setVenue] = useState(null);
  const [menus, setMenus] = useState([]);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [selectedTab, setSelectedTab] = useState('overview'); // overview, menus, packages, booking
  const [numberOfGuests, setNumberOfGuests] = useState(50);
  const [selectedItems, setSelectedItems] = useState({});
  const [galleryImageIndex, setGalleryImageIndex] = useState(0);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [bookingData, setBookingData] = useState({
    eventDate: '',
    eventType: '',
    selectedPackage: null,
    selectedMenu: null,
    guestCount: 50,
    specialRequirements: ''
  });
  const [bookingSuccess, setBookingSuccess] = useState('');

  // Remove edit state - customers cannot edit venue details
  const [showEditModal] = useState(false);
  const [editFormData] = useState({});
  const [editLoading] = useState(false);
  const [editError] = useState('');
  const [editSuccess] = useState('');

  // Fetch data
  useEffect(() => {
    fetchData();
  }, [venueId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [venueResponse, menusResponse, packagesResponse] = await Promise.all([
        venueAPI.getSingleVenue(venueId),
        menuAPI.getVenueMenus(venueId),
        packageAPI.getVenuePackages(venueId)
      ]);

      if (venueResponse.success) {
        setVenue(venueResponse.data || venueResponse.venue);
      } else if (venueResponse.data) {
        setVenue(venueResponse.data);
      }
      if (menusResponse.success) {
        setMenus(menusResponse.menus || []);
      }
      if (packagesResponse.success) {
        setPackages(packagesResponse.packages || []);
      }
    } catch (err) {
      setError('Failed to load venue details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectItem = (menuId, itemId) => {
    const key = `${menuId}-${itemId}`;
    setSelectedItems(prev => ({
      ...prev,
      [key]: (prev[key] || 0) + 1
    }));
  };

  const handleDeselectItem = (menuId, itemId) => {
    const key = `${menuId}-${itemId}`;
    setSelectedItems(prev => {
      const updated = { ...prev };
      if (updated[key] > 1) {
        updated[key]--;
      } else {
        delete updated[key];
      }
      return updated;
    });
  };

  const calculateMenuTotal = () => {
    let total = 0;
    Object.keys(selectedItems).forEach(key => {
      const [menuId, itemId] = key.split('-');
      const menu = menus.find(m => m._id === menuId);
      if (menu) {
        const item = menu.items.find(i => i._id === itemId);
        if (item) {
          total += item.pricePerPlate * selectedItems[key] * numberOfGuests;
        }
      }
    });
    return total;
  };

  // Edit functionality disabled for customers - they cannot edit venue details
  // Only venue owners in their registration page can edit
  
  const handleBooking = async () => {
    if (!bookingData.eventDate) {
      alert('Please select an event date');
      return;
    }

    if (!token) {
      alert('Please login to book a venue');
      navigate('/login');
      return;
    }

    try {
      // Prepare selected menu items with details
      const selectedMenuItemsArray = [];
      Object.keys(selectedItems).forEach(key => {
        const [menuId, itemId] = key.split('-');
        const menu = menus.find(m => m._id === menuId);
        if (menu) {
          const item = menu.items.find(i => i._id === itemId);
          if (item) {
            selectedMenuItemsArray.push({
              menuId: menu._id,
              menuName: menu.name,
              itemId: item._id,
              itemName: item.name,
              price: item.pricePerPlate,
              quantity: selectedItems[key]
            });
          }
        }
      });

      // Get package details
      const selectedPackageData = bookingData.selectedPackage 
        ? packages.find(p => p._id === bookingData.selectedPackage)
        : null;

      const packageData = selectedPackageData ? {
        packageId: selectedPackageData._id,
        packageName: selectedPackageData.name,
        packageType: selectedPackageData.type,
        basePrice: selectedPackageData.basePrice
      } : {};

      // Calculate total
      const menuTotal = calculateMenuTotal();
      const packagePrice = selectedPackageData?.basePrice || 0;
      let addOnsTotal = 0;
      
      let selectedAddOnsData = {
        decoration: { enabled: false, price: 0 },
        soundSystem: { enabled: false, price: 0 },
        bartender: { enabled: false, price: 0 }
      };

      if (selectedPackageData?.addOns) {
        if (selectedPackageData.addOns.decoration?.enabled) {
          selectedAddOnsData.decoration = selectedPackageData.addOns.decoration;
          addOnsTotal += selectedPackageData.addOns.decoration.price;
        }
        if (selectedPackageData.addOns.soundSystem?.enabled) {
          selectedAddOnsData.soundSystem = selectedPackageData.addOns.soundSystem;
          addOnsTotal += selectedPackageData.addOns.soundSystem.price;
        }
        if (selectedPackageData.addOns.bartender?.enabled) {
          selectedAddOnsData.bartender = selectedPackageData.addOns.bartender;
          addOnsTotal += selectedPackageData.addOns.bartender.price;
        }
      }

      const totalPrice = menuTotal + packagePrice + addOnsTotal;

      const payload = {
        venueId: venue._id,
        eventDate: new Date(bookingData.eventDate),
        eventType: bookingData.eventType,
        numberOfGuests: numberOfGuests,
        selectedMenuItems: selectedMenuItemsArray,
        selectedPackage: packageData,
        selectedAddOns: selectedAddOnsData,
        specialRequests: bookingData.specialRequirements,
        totalPrice: totalPrice
      };

      const response = await bookingAPI.createBooking(token, payload);
      if (response.success) {
        setBookingSuccess('Booking request sent successfully! Venue owner will contact you soon.');
        setTimeout(() => {
          navigate('/user-home');
        }, 3000);
      }
    } catch (err) {
      alert('Failed to create booking');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#5d0f0f]"></div>
      </div>
    );
  }

  if (!venue) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-[#5d0f0f] hover:text-[#4a0c0c] mb-4"
        >
          <FaArrowLeft className="mr-2" /> Back
        </button>
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Venue not found</p>
        </div>
      </div>
    );
  }

  const menuTotal = calculateMenuTotal();
  const packagePrice = bookingData.selectedPackage 
    ? packages.find(p => p._id === bookingData.selectedPackage)?.basePrice || 0 
    : 0;
  const totalPrice = menuTotal + packagePrice;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with back button */}
      <div className="bg-white border-b p-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-[#5d0f0f] hover:text-[#4a0c0c] mb-4"
        >
          <FaArrowLeft className="mr-2" /> Back
        </button>
      </div>

      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {error && (
          <div className="p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>
        )}

        {bookingSuccess && (
          <div className="p-4 bg-green-100 text-green-700 rounded-lg">{bookingSuccess}</div>
        )}

        {/* Enhanced Venue Header with Gallery */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Gallery Section */}
          <div className="relative w-full h-96 bg-gray-800 group">
            {venue.images && venue.images.length > 0 ? (
              <>
                <img
                  src={venue.images[galleryImageIndex]}
                  alt={`${venue.name} - ${galleryImageIndex + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = "https://i.pinimg.com/736x/08/c7/22/08c72296f934193df6155cffb0b10580.jpg";
                  }}
                />
                
                {/* Gallery Navigation */}
                {venue.images.length > 1 && (
                  <>
                    <button
                      onClick={() => setGalleryImageIndex((prev) => (prev - 1 + venue.images.length) % venue.images.length)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/75 text-white p-3 rounded-full transition z-10"
                    >
                      <FaChevronLeft size={20} />
                    </button>
                    <button
                      onClick={() => setGalleryImageIndex((prev) => (prev + 1) % venue.images.length)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/75 text-white p-3 rounded-full transition z-10"
                    >
                      <FaChevronRight size={20} />
                    </button>

                    {/* Image Indicators */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                      {venue.images.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setGalleryImageIndex(idx)}
                          className={`w-2 h-2 rounded-full transition ${
                            idx === galleryImageIndex ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/75'
                          }`}
                        />
                      ))}
                    </div>

                    {/* View All Gallery Button */}
                    <button
                      onClick={() => setShowGalleryModal(true)}
                      className="absolute top-4 right-4 bg-[#5d0f0f] text-white px-4 py-2 rounded-lg hover:bg-[#4a0c0c] transition flex items-center gap-2 z-10"
                    >
                      View All ({venue.images.length})
                    </button>
                  </>
                )}

                {/* Image Counter */}
                <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded-lg text-sm">
                  {galleryImageIndex + 1} / {venue.images.length}
                </div>
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-[#5d0f0f] to-[#8b1515]">
                <p className="text-white text-lg">No images available</p>
              </div>
            )}
          </div>

          {/* Venue Details */}
          <div className="p-8">
            <div className="mb-6">
              <h1 className="text-4xl font-bold text-gray-900 mb-3">{venue.name}</h1>
              <p className="text-gray-600 text-lg leading-relaxed">{venue.description}</p>
            </div>

            {/* Contact Info Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6 border-t border-b">
              {venue.location && (
                <div className="flex items-start gap-3">
                  <FaMapMarkerAlt className="text-[#5d0f0f] mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="font-semibold">{venue.location}</p>
                  </div>
                </div>
              )}
              {venue.contactNumber && (
                <div className="flex items-start gap-3">
                  <FaPhone className="text-[#5d0f0f] mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-semibold">{venue.contactNumber}</p>
                  </div>
                </div>
              )}
              {venue.email && (
                <div className="flex items-start gap-3">
                  <FaEnvelope className="text-[#5d0f0f] mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-semibold text-sm">{venue.email}</p>
                  </div>
                </div>
              )}
              <div className="flex items-start gap-3">
                <div>
                  <p className="text-sm text-gray-600">Capacity</p>
                  <p className="font-semibold">{venue.capacity || 'Not specified'} guests</p>
                </div>
              </div>
              {venue.numberOfHalls && (
                <div className="flex items-start gap-3">
                  <div>
                    <p className="text-sm text-gray-600">Number of Halls</p>
                    <p className="font-semibold">{venue.numberOfHalls}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Pricing & Key Info */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
              {venue.pricePerPlate && (
                <div className="p-6 bg-gradient-to-br from-[#5d0f0f] to-[#8b1515] rounded-lg text-white">
                  <p className="text-sm opacity-90">Price Per Plate</p>
                  <p className="text-3xl font-bold mt-1">₹{venue.pricePerPlate}</p>
                </div>
              )}
              {venue.capacity && (
                <div className="p-6 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg text-white">
                  <p className="text-sm opacity-90">Total Capacity</p>
                  <p className="text-3xl font-bold mt-1">{venue.capacity}</p>
                  <p className="text-xs opacity-75 mt-2">guests</p>
                </div>
              )}
              {venue.numberOfHalls && (
                <div className="p-6 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg text-white">
                  <p className="text-sm opacity-90">Number of Halls</p>
                  <p className="text-3xl font-bold mt-1">{venue.numberOfHalls}</p>
                </div>
              )}
              {venue.pricePerDay && (
                <div className="p-6 bg-gradient-to-br from-green-600 to-green-700 rounded-lg text-white">
                  <p className="text-sm opacity-90">Price Per Day</p>
                  <p className="text-3xl font-bold mt-1">₹{venue.pricePerDay}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="flex border-b bg-gray-50">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'menus', label: 'Menus', count: menus.length },
              { id: 'packages', label: 'Packages', count: packages.length },
              { id: 'booking', label: 'Book Now' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`flex-1 px-6 py-4 font-semibold border-b-2 transition ${
                  selectedTab === tab.id
                    ? 'border-[#5d0f0f] text-[#5d0f0f] bg-white'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label} {tab.count !== undefined && <span className="ml-2 bg-[#5d0f0f] text-white px-2 py-1 rounded-full text-xs">{tab.count}</span>}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {selectedTab === 'overview' && (
              <div>
                <h2 className="text-2xl font-bold mb-4">About This Venue</h2>
                <p className="text-gray-700 text-lg leading-relaxed">{venue.description}</p>
              </div>
            )}

            {selectedTab === 'menus' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Available Menus</h2>
                {menus.length === 0 ? (
                  <p className="text-gray-500">No menus available</p>
                ) : (
                  <div className="space-y-6">
                    {menus.map(menu => (
                      <div key={menu._id} className="border rounded-lg p-6 hover:shadow-lg transition">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{menu.name}</h3>
                        {menu.description && <p className="text-gray-600 mb-4">{menu.description}</p>}

                        {menu.items && menu.items.length > 0 && (
                          <div className="space-y-3">
                            {menu.items.map(item => (
                              <div key={item._id} className="bg-gray-50 p-4 rounded-lg flex justify-between items-start">
                                <div className="flex-1">
                                  <h4 className="font-semibold text-gray-900">{item.name}</h4>
                                  {item.description && <p className="text-sm text-gray-600">{item.description}</p>}
                                  <div className="mt-2 flex gap-4 text-sm">
                                    <span className="text-[#5d0f0f] font-bold">₹{item.pricePerPlate}/plate</span>
                                    <span className="text-gray-600 capitalize">{item.category}</span>
                                    {item.isVegetarian && <span className="text-green-600">🌱 Veg</span>}
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 ml-4">
                                  <button
                                    onClick={() => handleDeselectItem(menu._id, item._id)}
                                    className="bg-red-100 text-red-600 p-2 rounded hover:bg-red-200"
                                  >
                                    <FaMinus />
                                  </button>
                                  <span className="w-8 text-center font-semibold">
                                    {selectedItems[`${menu._id}-${item._id}`] || 0}
                                  </span>
                                  <button
                                    onClick={() => handleSelectItem(menu._id, item._id)}
                                    className="bg-green-100 text-green-600 p-2 rounded hover:bg-green-200"
                                  >
                                    <FaPlus />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {selectedTab === 'packages' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Event Packages</h2>
                {packages.length === 0 ? (
                  <p className="text-gray-500">No packages available</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {packages.map(pkg => (
                      <div key={pkg._id} className="border-2 rounded-lg p-6 hover:border-[#5d0f0f] transition">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="text-xl font-bold text-gray-900">{pkg.name}</h3>
                          <span className="bg-[#5d0f0f] text-white px-3 py-1 rounded-full text-sm capitalize">
                            {pkg.type}
                          </span>
                        </div>

                        {pkg.description && <p className="text-gray-600 mb-3">{pkg.description}</p>}

                        <div className="text-2xl font-bold text-[#5d0f0f] mb-4">₹{pkg.basePrice}</div>

                        {pkg.minCapacity || pkg.maxCapacity ? (
                          <p className="text-sm text-gray-600 mb-3">
                            Capacity: {pkg.minCapacity} - {pkg.maxCapacity} guests
                          </p>
                        ) : null}

                        {pkg.features && pkg.features.length > 0 && (
                          <div className="mb-4 space-y-1">
                            <p className="font-semibold text-gray-700 mb-2">Includes:</p>
                            {pkg.features.map((feature, idx) => (
                              <p key={idx} className="text-sm text-gray-600">✓ {feature}</p>
                            ))}
                          </div>
                        )}

                        {pkg.addOns && (pkg.addOns.decoration?.enabled || pkg.addOns.soundSystem?.enabled || pkg.addOns.bartender?.enabled) && (
                          <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200 space-y-2">
                            <p className="font-semibold text-blue-900 mb-2">➕ Available Add-ons:</p>
                            {pkg.addOns.decoration?.enabled && (
                              <p className="text-sm text-blue-800">🎨 Decoration - ₹{pkg.addOns.decoration.price}</p>
                            )}
                            {pkg.addOns.soundSystem?.enabled && (
                              <p className="text-sm text-blue-800">🔊 Sound System - ₹{pkg.addOns.soundSystem.price}</p>
                            )}
                            {pkg.addOns.bartender?.enabled && (
                              <p className="text-sm text-blue-800">🍸 Bartender - ₹{pkg.addOns.bartender.price}</p>
                            )}
                          </div>
                        )}

                        <button
                          onClick={() => {
                            setBookingData(prev => ({
                              ...prev,
                              selectedPackage: pkg._id
                            }));
                            setSelectedTab('booking');
                          }}
                          className="w-full bg-[#5d0f0f] text-white py-2 rounded-lg hover:bg-[#4a0c0c] font-semibold"
                        >
                          Select Package
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {selectedTab === 'booking' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Book This Venue</h2>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Booking Form */}
                  <div className="lg:col-span-2 space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Event Date</label>
                      <input
                        type="date"
                        value={bookingData.eventDate}
                        onChange={(e) => setBookingData(prev => ({ ...prev, eventDate: e.target.value }))}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5d0f0f]"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Event Type</label>
                      <select
                        value={bookingData.eventType}
                        onChange={(e) => setBookingData(prev => ({ ...prev, eventType: e.target.value }))}
                        className="w-full px-4 py-2 border rounded-lg"
                      >
                        <option value="">Select event type</option>
                        <option value="wedding">Wedding</option>
                        <option value="corporate">Corporate Event</option>
                        <option value="birthday">Birthday Party</option>
                        <option value="engagement">Engagement</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Number of Guests</label>
                      <input
                        type="number"
                        min="1"
                        value={bookingData.guestCount}
                        onChange={(e) => {
                          setBookingData(prev => ({ ...prev, guestCount: e.target.value }));
                          setNumberOfGuests(parseInt(e.target.value) || 50);
                        }}
                        className="w-full px-4 py-2 border rounded-lg"
                      />
                    </div>

                    {menus.length > 0 && (
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Select Menu</label>
                        <select
                          value={bookingData.selectedMenu || ''}
                          onChange={(e) => setBookingData(prev => ({ ...prev, selectedMenu: e.target.value }))}
                          className="w-full px-4 py-2 border rounded-lg"
                        >
                          <option value="">Choose a menu</option>
                          {menus.map(menu => (
                            <option key={menu._id} value={menu._id}>{menu.name}</option>
                          ))}
                        </select>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Special Requirements</label>
                      <textarea
                        value={bookingData.specialRequirements}
                        onChange={(e) => setBookingData(prev => ({ ...prev, specialRequirements: e.target.value }))}
                        rows="3"
                        className="w-full px-4 py-2 border rounded-lg"
                        placeholder="Any special requests or dietary restrictions..."
                      ></textarea>
                    </div>

                    <button
                      onClick={handleBooking}
                      className="w-full bg-[#5d0f0f] text-white py-3 rounded-lg hover:bg-[#4a0c0c] font-bold text-lg flex items-center justify-center gap-2"
                    >
                      <FaShoppingCart /> Request Booking
                    </button>
                  </div>

                  {/* Price Summary */}
                  <div className="bg-gray-50 rounded-lg p-6 h-fit sticky top-20">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Price Summary</h3>
                    <div className="space-y-3 mb-4">
                      {menuTotal > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-700">📋 Menu Items:</span>
                          <span className="font-semibold">₹{menuTotal}</span>
                        </div>
                      )}
                      {packagePrice > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-700">📦 Package:</span>
                          <span className="font-semibold">₹{packagePrice}</span>
                        </div>
                      )}
                      
                      {/* Show selected add-ons if package is selected */}
                      {bookingData.selectedPackage && packages.find(p => p._id === bookingData.selectedPackage) && (
                        (() => {
                          const pkg = packages.find(p => p._id === bookingData.selectedPackage);
                          return (
                            <>
                              {pkg.addOns?.decoration?.enabled && (
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-600">🎨 Decoration:</span>
                                  <span className="text-gray-700">₹{pkg.addOns.decoration.price}</span>
                                </div>
                              )}
                              {pkg.addOns?.soundSystem?.enabled && (
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-600">🔊 Sound System:</span>
                                  <span className="text-gray-700">₹{pkg.addOns.soundSystem.price}</span>
                                </div>
                              )}
                              {pkg.addOns?.bartender?.enabled && (
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-600">🍸 Bartender:</span>
                                  <span className="text-gray-700">₹{pkg.addOns.bartender.price}</span>
                                </div>
                              )}
                            </>
                          );
                        })()
                      )}
                      
                      <div className="border-t pt-3 flex justify-between">
                        <span className="font-bold text-gray-900">Total:</span>
                        <span className="text-2xl font-bold text-[#5d0f0f]">₹{totalPrice}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">
                      {numberOfGuests} guests × selected items
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Gallery Modal */}
        {showGalleryModal && venue.images && venue.images.length > 0 && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <div className="relative max-w-4xl w-full">
              {/* Close Button */}
              <button
                onClick={() => setShowGalleryModal(false)}
                className="absolute -top-10 right-0 text-white hover:text-gray-300 transition"
              >
                <FaTimes size={28} />
              </button>

              {/* Main Image */}
              <img
                src={venue.images[galleryImageIndex]}
                alt={`Gallery - ${galleryImageIndex + 1}`}
                className="w-full max-h-[70vh] object-contain rounded-lg"
                onError={(e) => {
                  e.target.src = "https://i.pinimg.com/736x/08/c7/22/08c72296f934193df6155cffb0b10580.jpg";
                }}
              />

              {/* Navigation */}
              {venue.images.length > 1 && (
                <>
                  <button
                    onClick={() => setGalleryImageIndex((prev) => (prev - 1 + venue.images.length) % venue.images.length)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full transition"
                  >
                    <FaChevronLeft size={24} />
                  </button>
                  <button
                    onClick={() => setGalleryImageIndex((prev) => (prev + 1) % venue.images.length)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full transition"
                  >
                    <FaChevronRight size={24} />
                  </button>
                </>
              )}

              {/* Image Counter */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm">
                {galleryImageIndex + 1} / {venue.images.length}
              </div>

              {/* Thumbnail Strip */}
              <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
                {venue.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setGalleryImageIndex(idx)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden transition ${
                      idx === galleryImageIndex ? 'ring-2 ring-[#5d0f0f]' : 'opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = "https://i.pinimg.com/736x/08/c7/22/08c72296f934193df6155cffb0b10580.jpg";
                      }}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserVenueDetail;
