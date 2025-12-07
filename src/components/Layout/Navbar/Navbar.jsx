'use client';

import React, { useState, useRef, useEffect, useTransition } from 'react';
import Image from 'next/image';
// ✅ IMPORT 1: Use specific imports from your routing config
import { usePathname, useRouter, Link } from '@/i18n/routing';
import { useTranslations, useLocale } from 'next-intl';

import { FaGlobe, FaBell, FaUser, FaBars, FaTimes } from 'react-icons/fa';
import { Heart } from 'lucide-react';
import { BiCart } from 'react-icons/bi';
import Container from '@/components/Shared/Container/Container';
import useAuthStore from '@/store/useAuthStore';

const Navbar = () => {
  // ✅ Hook for translations
  const t = useTranslations('HomePage.Navbar');

  // ✅ Hook to get current active language ('en' or 'fr')
  const currentLocale = useLocale();

  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // Handling Language Switch (Toggle between EN and FR)
  const [isPending, startTransition] = useTransition();
  const handleLanguageSwitch = () => {
    const nextLocale = currentLocale === 'en' ? 'fr' : 'en';
    startTransition(() => {
      // replace(pathname, {locale: ...}) updates the URL without reloading the page fully
      router.replace(pathname, { locale: nextLocale });
    });
  };

  const navItems = [
    { name: t('home'), path: '/' },
    { name: t('hotels'), path: '/hotels' },
    { name: t('restaurants'), path: '/restaurants' },
  ];

  const toggleMobileMenu = () => setMobileMenuOpen(prev => !prev);

  return (
    <nav className="bg-white sticky top-0 z-50 shadow-sm">
      <Container>
        <div className="flex justify-between items-center py-4 px-4">

          {/* Logo */}
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
              <Link
                key={path}
                href={path}
                className={`px-4 py-2 text-md font-semibold transition ${pathname === path ? 'bg-gray-300' : 'hover:bg-gray-200'}`}
              >
                {name}
              </Link>
            ))}
          </div>

          {/* Icons (Desktop) */}
          <div className="hidden md:flex items-center space-x-3">
            {/* ✅ Language Switcher Button */}
            <div className="relative group">
              <IconButton
                icon={<FaGlobe className={isPending ? 'opacity-50' : ''} />}
                onClick={handleLanguageSwitch}
              />
              {/* Tooltip to show current lang */}
              <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs bg-black text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                {currentLocale.toUpperCase()}
              </span>
            </div>

            <IconButton
              icon={<Heart className='w-4 h-4' />}
              onClick={() => router.push('/wishlist')}
            />


            {/* CONDITIONAL RENDERING */}
            {isAuthenticated ? (
              <UserDropdown t={t} />
            ) : (
              <button
                onClick={() => router.push('/auth/login')}
                className="bg-[#4B75A5] text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-[#3a5d85] transition"
              >
                {t('login')}
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex gap-2">
            {/* Added Lang Switcher to Mobile Header too */}
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

        {/* Mobile Menu */}
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

                {isAuthenticated ? (
                  <UserDropdown t={t} />
                ) : (
                  <button
                    onClick={() => router.push('/auth/login')}
                    className="text-sm font-bold text-[#4B75A5]"
                  >
                    {t('login')}
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
// ✅ Pass translation function 't' as prop
const UserDropdown = ({ t }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef();
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

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
    router.push('/'); // Safe redirect after logout
  };

  const menuItems = [
    { label: t('profile'), onClick: () => { setIsOpen(false); router.push('/profile'); } },
    { label: t('bookings'), onClick: () => { setIsOpen(false); router.push('/profile'); } },
    { label: t('logout'), onClick: handleLogout },
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