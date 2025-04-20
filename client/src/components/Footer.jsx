import React from "react";
import { FaFacebook } from "react-icons/fa";
import { FaTwitterSquare } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <div className="w-full bg-[#343A40] text-white py-8">
      <div className="container mx-auto px-4">
        {/* Quick Links */}
        <div className="flex flex-wrap justify-center gap-6 mb-6">
          <a href="/aboutus" className="hover:text-gray-400">
            About Us
          </a>
          <a href="/course" className="hover:text-gray-400">
            Courses
          </a>
          <a href="/contact" className="hover:text-gray-400">
            Contact
          </a>
          <a href="" className="hover:text-gray-400">
            Privacy Policy
          </a>
          <a href="" className="hover:text-gray-400">
            Terms of Service
          </a>
        </div>

        {/* Social Media Icons */}
        <div className="flex justify-center gap-4 mb-6">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaFacebook />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaTwitterSquare />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaLinkedin />
          </a>
        </div>

        {/* Contact Information */}
        <div className="text-center mb-6">
          <p>
            Email:{" "}
            <a
              href="mailto:info@lmswebsite.com"
              className="hover:text-gray-400"
            >
              info@EdMachine.com
            </a>
          </p>
          <p>
            Phone:{" "}
            <a href="tel:+11234567890" className="hover:text-gray-400">
              +1 (123) 456-7890
            </a>
          </p>
          <p>Address: 123 Learning St., Education City, India</p>
        </div>

        {/* Copyright Notice */}
        <div className="text-center text-sm text-gray-400">
          © 2023 ED Machine. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default Footer;
