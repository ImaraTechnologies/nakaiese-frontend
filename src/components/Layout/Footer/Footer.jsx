"use client";

import Image from "next/image";
import Link from "next/link";
import { BiPhone } from "react-icons/bi";
import { FaEnvelope } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="w-full bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
          {/* Brand & Info */}
          <div className="lg:col-span-6">
            <Link href="/" aria-label="Nakiese Logo" className="inline-flex items-center mb-6">
              <Image
                src="/Images/Logo.svg"
                alt="Nakiese Logo"
                width={130}
                height={40}
                priority
                className="mr-3 h-auto w-auto"
              />
            </Link>

            <p className="text-gray-800 mb-6 leading-relaxed">
              Welcome to <strong>Nakiese</strong> – Your premier destination for experiencing
              the vibrant essence of authentic African living! 🌍✨ <br />
              Discover the <strong>rich traditions, culture, and lifestyle</strong> that make
              Africa truly unique.
            </p>

            <div className="flex items-center mb-4">
              <BiPhone className="text-xl text-black mr-2" />
              <p className="text-gray-800">+243 906947381</p>
            </div>

            <div className="flex items-center">
              <FaEnvelope className="text-xl text-black mr-2" />
              <p className="text-gray-800">support@nakiese.com</p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-3">
            <h4 className="text-lg font-bold text-gray-900 mb-5">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-gray-800 hover:underline">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/hotels" className="text-gray-800 hover:underline">
                  Hotels
                </Link>
              </li>
              <li>
                <Link href="/restaurants" className="text-gray-800 hover:underline">
                  Restaurants
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-gray-800 hover:underline">
                  Login
                </Link>
              </li>
              <li>
                <Link href="/register" className="text-gray-800 hover:underline">
                  Register
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="lg:col-span-3">
            <h4 className="text-lg font-bold text-gray-900 mb-5">Resources</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/terms" className="text-gray-800 hover:underline">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-800 hover:underline">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/refund" className="text-gray-800 hover:underline">
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-gray-800 hover:underline">
                  Help & Support
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <hr className="my-6 border-gray-300" />

        <p className="text-center text-gray-700 text-sm">
          © {new Date().getFullYear()} ATPL Pro. All rights reserved. |{" "}
          <Link href="/terms" className="hover:underline">
            Terms of Service
          </Link>{" "}
          |{" "}
          <Link href="/privacy" className="hover:underline">
            Privacy Policy
          </Link>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
