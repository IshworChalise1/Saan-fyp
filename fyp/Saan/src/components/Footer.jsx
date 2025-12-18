import React from "react";

function Footer() {
  return (
    <footer className="bg-[#5d0f0f] text-white">
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
  );
}

export default Footer;
