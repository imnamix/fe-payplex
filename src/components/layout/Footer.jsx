import React from "react";
import { Link } from "react-router-dom";
import { Twitter, Github, Linkedin, ArrowUp } from "lucide-react";

const Footer = () => {
  const year = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-gray-950 text-gray-400">
      <div className="container mx-auto px-4 py-10">
        
        {/* Top Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Logo */}
          <Link to="/" className="group">
            <h1
              className="
                text-3xl font-extrabold tracking-wide
                bg-gradient-to-r from-blue-500 to-indigo-500
                bg-clip-text text-transparent
                group-hover:opacity-90 transition
              "
            >
              Payplex
            </h1>
          </Link>

          {/* Links */}
          <div className="flex gap-6 text-sm">
            {[
              { to: "/about", label: "About" },
              { to: "/contact", label: "Contact" },
              { to: "/privacy", label: "Privacy" },
            ].map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="relative hover:text-white transition after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-indigo-500 after:transition-all hover:after:w-full"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Social */}
          <div className="flex gap-4">
            {[Twitter, Github, Linkedin].map((Icon, index) => (
              <a
                key={index}
                href="#"
                className="
                  p-2 rounded-lg bg-gray-900
                  hover:bg-indigo-600
                  hover:scale-110
                  transition-all duration-200
                "
              >
                <Icon className="h-5 w-5 text-gray-300 hover:text-white" />
              </a>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 my-8" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <p className="text-gray-500">
            © {year} Payplex. All rights reserved.
          </p>

          {/* Scroll to Top */}
          <button
            onClick={scrollToTop}
            className="
              flex items-center gap-2 px-3 py-2 rounded-lg
              bg-gray-900 hover:bg-indigo-600
              text-gray-300 hover:text-white
              transition-all duration-200
            "
          >
            <ArrowUp className="h-4 w-4" />
            Top
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
