'use client';

import React, { useState, useRef, useEffect, useTransition } from 'react';
import Image from 'next/image';
import { usePathname, useRouter, Link } from '@/i18n/routing';
import { useTranslations, useLocale } from 'next-intl';
// --- FIX START: Import useSearchParams ---
import { useSearchParams } from 'next/navigation';
// --- FIX END ---

// Icons
import { FaGlobe, FaBell, FaUser, FaBars, FaTimes } from 'react-icons/fa';
import { Heart } from 'lucide-react';

// Components
import Container from '@/components/Shared/Container/Container';

// Context
import { useAuth } from '@/context/AuthContext';

const Navbar = () => {
  const t = useTranslations('HomePage.Navbar');
  const currentLocale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  // --- FIX START: Get current params ---
  const searchParams = useSearchParams();
  // --- FIX END ---
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // 1. Get User, Logout, AND isLoading from Context
  const { user, logout, isLoading } = useAuth();

  // Language Switch Logic
  const [isPending, startTransition] = useTransition();

  const handleLanguageSwitch = () => {
    const nextLocale = currentLocale === 'en' ? 'fr' : 'en';
    
    startTransition(() => {
      // --- FIX START: Preserve Query Params ---
      const currentQuery = searchParams.toString();
      const queryString = currentQuery ? `?${currentQuery}` : '';
      
      // Append query string to the pathname
      router.replace(`${pathname}${queryString}`, { locale: nextLocale });
      // --- FIX END ---
    });
  };

  const navItems = [
    { name: t('home'), path: '/' },
    { name: t('hotels'), path: '/hotels' },
    { name: t('restaurants'), path: '/restaurants' },
  ];

  const toggleMobileMenu = () => setMobileMenuOpen(prev => !prev);

  // 2. Define Auth Content Logic (Anti-Flicker)
  const renderAuthSection = () => {
    if (user) {
      return <UserDropdown t={t} logout={logout} user={user} />;
    }

    if (isLoading) {
      return <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse border border-gray-300" />;
    }

    return (
      <button
        onClick={() => router.push('/auth/login')}
        className="bg-[#4B75A5] text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-[#3a5d85] transition"
      >
        {t('login')}
      </button>
    );
  };

  return (
    <nav className="bg-white sticky top-0 z-50 shadow-sm">
      <Container>
        <div className="flex justify-between items-center py-4 px-4">

          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image src="/Images/Logo.svg" alt="Nakiese Logo" width={130} height={40} priority />
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center bg-gray-100 rounded-full overflow-hidden">
            {navItems.map(({ name, path }) => (
              <Link
                key={path}
                href={path}
                className={`px-4 py-2 text-md font-semibold transition ${pathname === path ? 'bg-gray-300' : 'hover:bg-gray-200'}`}
              >
                {name}
              </Link>
            ))}
          </div>

          {/* Desktop Right Side Icons */}
          <div className="hidden md:flex items-center space-x-3">
            <div className="relative group">
              <IconButton
                icon={<FaGlobe className={isPending ? 'opacity-50' : ''} />}
                onClick={handleLanguageSwitch}
              />
              <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs bg-black text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                {currentLocale.toUpperCase()}
              </span>
            </div>

            <IconButton
              icon={<Heart className='w-4 h-4' />}
              onClick={() => router.push('/wishlist')}
            />

            {renderAuthSection()}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex gap-2">
            <IconButton
              icon={<FaGlobe className={isPending ? 'opacity-50' : ''} />}
              onClick={handleLanguageSwitch}
            />
            <button
              onClick={toggleMobileMenu}
              className="w-10 h-10 border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-100 transition"
            >
              {mobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden px-4 pb-4">
            <div className="bg-gray-100 rounded-lg shadow-sm">
              {navItems.map(({ name, path }) => (
                <Link
                  key={path}
                  href={path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block w-full text-left px-4 py-3 text-md font-medium ${pathname === path ? 'bg-gray-300' : 'hover:bg-gray-200'}`}
                >
                  {name}
                </Link>
              ))}

              <div className="flex items-center justify-around mt-3 px-2 py-2 border-t border-gray-200">
                <IconButton icon={<FaBell />} />

                <div onClick={() => setMobileMenuOpen(false)}>
                   {renderAuthSection()}
                </div>
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
const UserDropdown = ({ t, logout, user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef();
  const router = useRouter();

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
    setIsOpen(false);
    await logout(); 
  };

  const menuItems = [
    { label: t('profile'), onClick: () => { setIsOpen(false); router.push('/profile'); } },
    { label: t('bookings'), onClick: () => { setIsOpen(false); router.push('/bookings'); } },
    { label: t('logout'), onClick: handleLogout },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <IconButton icon={<FaUser className='w-4 h-4' />} onClick={toggleDropdown} />
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50">
          
          {user?.username && (
            <div className="px-4 py-2 border-b border-gray-100 text-xs text-gray-500 font-semibold uppercase">
              {user.username}
            </div>
          )}

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