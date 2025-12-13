'use client';

import Image from "next/image";
import { Link } from '@/i18n/routing'; // Use your i18n Link wrapper
import { useTranslations } from 'next-intl';
import { 
  Phone, 
  Mail, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin,
  ArrowRight 
} from "lucide-react"; // Switched to Lucide for consistency with other components

const Footer = () => {
  const t = useTranslations('Footer');
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8 border-t border-gray-800">
      <div className="container mx-auto px-4">
        
        {/* Top Section: Brand + Newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
          
          {/* Brand Column (Left) */}
          <div className="lg:col-span-4 space-y-6">
            <Link href="/" aria-label="Nakiese Logo" className="inline-block">
              {/* You might want a white version of your logo for dark backgrounds */}
              <Image
                src="/Images/Logo.svg" 
                alt="Nakiese Logo"
                width={140}
                height={45}
                className="brightness-0 invert" // CSS trick to make black logo white
              />
            </Link>
            <p className="text-gray-400 leading-relaxed text-sm">
              {t('Brand.description')}
            </p>
            
            <div className="space-y-3 pt-2">
              <a href={`tel:${t('Brand.phone')}`} className="flex items-center gap-3 hover:text-white transition-colors group">
                <div className="p-2 bg-gray-800 rounded-full group-hover:bg-blue-600 transition-colors">
                  <Phone size={16} />
                </div>
                <span className="text-sm font-medium">{t('Brand.phone')}</span>
              </a>
              <a href={`mailto:${t('Brand.email')}`} className="flex items-center gap-3 hover:text-white transition-colors group">
                <div className="p-2 bg-gray-800 rounded-full group-hover:bg-blue-600 transition-colors">
                  <Mail size={16} />
                </div>
                <span className="text-sm font-medium">{t('Brand.email')}</span>
              </a>
            </div>
          </div>

          {/* Links Grid (Middle) */}
          <div className="lg:col-span-5 grid grid-cols-2 sm:grid-cols-3 gap-8">
            
            {/* Column 1 */}
            <div>
              <h4 className="text-white font-bold mb-6">{t('Columns.company')}</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="/about" className="hover:text-white transition-colors">{t('Links.about')}</Link></li>
                <li><Link href="/careers" className="hover:text-white transition-colors">{t('Links.careers')}</Link></li>
                <li><Link href="/blog" className="hover:text-white transition-colors">{t('Links.blog')}</Link></li>
              </ul>
            </div>

            {/* Column 2 */}
            <div>
              <h4 className="text-white font-bold mb-6">{t('Columns.support')}</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="/contact" className="hover:text-white transition-colors">{t('Links.contact')}</Link></li>
                <li><Link href="/help" className="hover:text-white transition-colors">{t('Links.help_center')}</Link></li>
              </ul>
            </div>

            {/* Column 3 */}
            <div>
              <h4 className="text-white font-bold mb-6">{t('Columns.legal')}</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="/terms" className="hover:text-white transition-colors">{t('Links.terms')}</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">{t('Links.privacy')}</Link></li>
                <li><Link href="/refund" className="hover:text-white transition-colors">{t('Links.refund')}</Link></li>
              </ul>
            </div>
          </div>

          {/* Newsletter Column (Right) */}
          <div className="lg:col-span-3">
            <div className="bg-gray-800 p-6 rounded-2xl">
              <h4 className="text-white font-bold mb-2">{t('Newsletter.title')}</h4>
              <p className="text-gray-400 text-xs mb-4">{t('Newsletter.subtitle')}</p>
              
              <form className="space-y-2">
                <input 
                  type="email" 
                  placeholder={t('Newsletter.placeholder')}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-lg text-sm transition-all flex items-center justify-center gap-2">
                  {t('Newsletter.button')} <ArrowRight size={16} />
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-gray-800 mb-8" />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            {t('copyright', { year: currentYear })}
          </p>

          {/* Social Icons */}
          <div className="flex items-center gap-4">
            {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
              <a 
                key={i} 
                href="#" 
                className="text-gray-400 hover:text-white transition-colors hover:scale-110 transform duration-200"
              >
                <Icon size={20} />
              </a>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;