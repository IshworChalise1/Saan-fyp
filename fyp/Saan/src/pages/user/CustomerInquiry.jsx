import React, { useState } from 'react';
import Navigation from '../../components/Navigation';

function CustomerInquiry() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    type: 'inquiry',
    message: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // For now, just log data (later you can send to backend)
    console.log('Customer Message:', formData);

    alert('Your message has been submitted successfully!');

    // Reset form
    setFormData({
      name: '',
      email: '',
      type: 'inquiry',
      message: '',
    });
  };

  return (
    <>
      <Navigation />

      <div className="pt-24 px-4 min-h-screen bg-gray-100">
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-md">
          <h1 className="text-3xl font-bold text-center mb-6 text-[#5d0f0f]">
            Customer Inquiry / Complaint
          </h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block font-medium mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#5d0f0f]"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block font-medium mb-1">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#5d0f0f]"
              />
            </div>

            {/* Type */}
            <div>
              <label className="block font-medium mb-1">Message Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2"
              >
                <option value="inquiry">Inquiry</option>
                <option value="complaint">Complaint</option>
              </select>
            </div>

            {/* Message */}
            <div>
              <label className="block font-medium mb-1">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="5"
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#5d0f0f]"
              ></textarea>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-[#5d0f0f] text-white py-3 rounded-lg font-medium hover:bg-[#7a1a1a] transition"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default CustomerInquiry;
