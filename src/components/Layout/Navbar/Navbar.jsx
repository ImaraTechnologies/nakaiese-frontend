'use client';

import React, { useState, useRef, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link'; // <--- FIXED: Import Link
import { FaGlobe, FaBell, FaUser, FaBars, FaTimes } from 'react-icons/fa';
import { Heart } from 'lucide-react';
import { BiCart } from 'react-icons/bi';
import Container from '../../Shared/Container/Container';
import { useAuth } from '@/context/AuthContext'; // <--- Integrated Auth

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth(); // <--- Check if user is logged in

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Hotels', path: '/hotels' },
    { name: 'Restaurants', path: '/restaurants' },
  ];

  const toggleMobileMenu = () => setMobileMenuOpen(prev => !prev);

  return (
    <nav className="bg-white sticky top-0 z-50 shadow-sm">
      <Container>
        <div className="flex justify-between items-center py-4 px-4">
          
          {/* Logo - FIXED: Used Link instead of <a> */}
          <Link href="/" className="flex items-center">
            <Image
              src="/Images/Logo.svg"
              alt="Nakiese Logo"
              width={130}
              height={40}
              priority
            />
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center bg-gray-100 rounded-full overflow-hidden">
            {navItems.map(({ name, path }) => (
              <button
                key={path}
                onClick={() => router.push(path)}
                className={`px-4 py-2 text-md font-semibold transition ${
                  pathname === path ? 'bg-gray-300' : 'hover:bg-gray-200'
                }`}
              >
                {name}
              </button>
            ))}
          </div>

          {/* Icons (Desktop) */}
          <div className="hidden md:flex items-center space-x-3">
            <IconButton
              icon={<Heart className='w-4 h-4' />}
              onClick={() => router.push('/wishlist')}
            />
            <IconButton 
              icon={<BiCart className='w-4 h-4' />} 
              onClick={() => router.push('/cart')} 
            />
            
            {/* CONDITIONAL RENDERING: Show User Dropdown OR Login Button */}
            {user ? (
              <UserDropdown />
            ) : (
              <button
                onClick={() => router.push('/auth/login')}
                className="bg-[#4B75A5] text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-[#3a5d85] transition"
              >
                Sign In
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="w-10 h-10 border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-100 transition"
            >
              {mobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden px-4 pb-4">
            <div className="bg-gray-100 rounded-lg shadow-sm">
              {navItems.map(({ name, path }) => (
                <button
                  key={path}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    router.push(path);
                  }}
                  className={`block w-full text-left px-4 py-3 text-md font-medium ${
                    pathname === path ? 'bg-gray-300' : 'hover:bg-gray-200'
                  }`}
                >
                  {name}
                </button>
              ))}
              
              <div className="flex items-center justify-around mt-3 px-2 py-2 border-t border-gray-200">
                <IconButton icon={<FaGlobe />} />
                <IconButton icon={<FaBell />} />
                
                {/* Mobile Auth Check */}
                {user ? (
                   <UserDropdown />
                ) : (
                  <button
                    onClick={() => router.push('/auth/login')}
                    className="text-sm font-bold text-[#4B75A5]"
                  >
                    Sign In
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </Container>
    </nav>
  );
};

// Reusable Icon Button
const IconButton = ({ icon, onClick }) => (
  <button
    className="w-8 h-8 border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-100 transition"
    onClick={onClick}
    type="button"
  >
    {icon}
  </button>
);

// User Dropdown Component
const UserDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef();
  const router = useRouter();
  
  // Get logout function from Auth Hook
  const { logout } = useAuth(); 

  const toggleDropdown = () => setIsOpen(prev => !prev);

  useEffect(() => {
    const handleClickOutside = event => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
      await logout();
      setIsOpen(false);
      // Redirect is usually handled inside logout(), but safe to ensure here if needed
  };

  const menuItems = [
    { label: 'Profile', onClick: () => { setIsOpen(false); router.push('/profile'); } },
    { label: 'My Bookings', onClick: () => { setIsOpen(false); router.push('/profile'); } }, // Adjusted path if needed
    { label: 'Logout', onClick: handleLogout }, // <--- Connected to Real Logout
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <IconButton icon={<FaUser className='w-4 h-4' />} onClick={toggleDropdown} />
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={item.onClick}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Navbar;